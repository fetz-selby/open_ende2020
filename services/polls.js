module.exports = class Poll {
  constructor(query, constituencyModel, parentConstituencyModel) {
    this.query = query;
    this.constituencyModel = constituencyModel;
    this.parentConstituencyModel = parentConstituencyModel;
  }

  async find({ query: { year, regionId } }) {
    const { query, constituencyModel, parentConstituencyModel } = this;

    try {
      //Fetch Parent Constituencies with regionId
      const parentConstituencyIds = (
        await parentConstituencyModel.findAll({
          where: { region_id: regionId, status: "A" }
        })
      ).map(p => p.dataValues.id);

      const constituencyIds = (
        await constituencyModel.findAll({
          where: { year, parent_id: parentConstituencyIds }
        })
      ).map(c => c.dataValues.id);

      return await query.findAll({
        where: { cons_id: constituencyIds, status: "A" },
        include: [constituencyModel]
      });
    } catch (err) {
      console.warn("Poll, ", err);
      return [];
    }
  }

  async create(req) {
    const { query, constituencyModel } = this;
    const filteredReq = { ...req, id: "" };

    delete filteredReq.id;

    try {
      const constituency = (
        await constituencyModel.findOne({
          where: { id: filteredReq.cons_id, status: "A" }
        })
      ).toJSON();

      const poll = (await query.create(filteredReq)).toJSON();
      return { ...poll, constituency, regionId: req.regionId };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }

  async update(id, poll) {
    const {
      name,
      cons_id,
      external_id,
      rejected_votes,
      valid_votes,
      total_voters,
      year
    } = poll;
    const { query, constituencyModel } = this;

    try {
      await query.update(
        {
          name,
          cons_id,
          rejected_votes,
          valid_votes,
          external_id,
          total_voters,
          year
        },
        { where: { id, status: "A" } }
      );

      const constituency = (
        await constituencyModel.findOne({
          where: { id: cons_id, status: "A" }
        })
      ).toJSON();

      return { ...poll, constituency };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to update" };
    }
  }
};
