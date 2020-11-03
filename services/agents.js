module.exports = class Agent {
  constructor(query, constituencyModel, pollModel, parentConstituencyModel) {
    this.query = query;
    this.constituencyModel = constituencyModel;
    this.pollModel = pollModel;
    this.parentConstituencyModel = parentConstituencyModel;
  }

  async find({ query: { year, regionId } }) {
    const {
      query,
      constituencyModel,
      pollModel,
      parentConstituencyModel
    } = this;

    try {
      const parentConstituencyIds = (
        await parentConstituencyModel.findAll({
          where: { region_id: regionId, status: "A" }
        })
      ).map(p => p.dataValues.id);

      const constituencyIds = (
        await constituencyModel.findAll({
          where: { year, parent_id: parentConstituencyIds, status: "A" }
        })
      ).map(c => c.dataValues.id);

      return await query.findAll({
        where: { cons_id: constituencyIds, status: "A" },
        include: [constituencyModel, pollModel]
      });
    } catch (err) {
      console.warn("Agent, ", err);
      return [];
    }
  }

  async create(req) {
    const { query, constituencyModel, pollModel } = this;
    const filteredReq = { ...req, id: "" };

    delete filteredReq.id;

    try {
      const constituency = (
        await constituencyModel.findOne({
          where: { id: filteredReq.cons_id, status: "A" }
        })
      ).toJSON();
      const poll = (
        await pollModel.findOne({
          where: { id: filteredReq.poll_id, status: "A" }
        })
      ).toJSON();

      const agent = (await query.create(filteredReq)).toJSON();
      return { ...agent, constituency, poll, regionId: req.regionId };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }

  async update(id, agent) {
    const { name, msisdn, pin, cons_id, poll_id, year } = agent;
    const { query, constituencyModel, pollModel } = this;

    console.log("agent, ", agent);
    try {
      await query.update(
        { name, msisdn, pin, cons_id, poll_id, year },
        { where: { id, status: "A" } }
      );

      const constituency = (
        await constituencyModel.findOne({
          where: { id: cons_id, status: "A" }
        })
      ).toJSON();
      const poll = (
        await pollModel.findOne({
          where: { id: poll_id, status: "A" }
        })
      ).toJSON();

      return { ...agent, constituency, poll };
    } catch (err) {
      console.error("could not update, ", err);
      return { error: "Failed to update" };
    }
  }
};
