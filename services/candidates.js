module.exports = class Candidate {
  constructor(query, constituencyModel, partyModel, parentConstituencyModel) {
    this.query = query;
    this.constituencyModel = constituencyModel;
    this.partyModel = partyModel;
    this.parentConstituencyModel = parentConstituencyModel;
  }
  async find({ query: { year, regionId } }) {
    const {
      query,
      constituencyModel,
      partyModel,
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
        where: { year, constituency_id: constituencyIds, status: "A" },
        include: [constituencyModel, partyModel]
      });
    } catch (err) {
      return [];
    }
  }

  async create(req) {
    const { query, constituencyModel, partyModel } = this;
    const filteredReq = { ...req, id: "" };

    delete filteredReq.id;

    try {
      const constituency = (
        await constituencyModel.findOne({
          where: { id: filteredReq.constituency_id, status: "A" }
        })
      ).toJSON();
      const party = (
        await partyModel.findOne({
          where: { id: filteredReq.party_id, status: "A" }
        })
      ).toJSON();
      const candidate = (await query.create(filteredReq)).toJSON();

      return { ...candidate, constituency, party, regionId: req.regionId };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }

  async update(id, candidate) {
    const {
      name,
      party_id,
      constituency_id,
      votes,
      group_type,
      year,
      avatar_path,
      percentage,
      angle,
      bar_ratio
    } = candidate;
    const { query, constituencyModel, partyModel } = this;
    try {
      await query.update(
        {
          name,
          party_id,
          constituency_id,
          votes,
          group_type,
          year,
          avatar_path,
          percentage,
          angle,
          bar_ratio
        },
        { where: { id, status: "A" } }
      );

      const constituency = (
        await constituencyModel.findOne({
          where: { id: constituency_id, status: "A" }
        })
      ).toJSON();
      const party = (
        await partyModel.findOne({
          where: { id: party_id, status: "A" }
        })
      ).toJSON();

      return { ...candidate, constituency, party };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }
};
