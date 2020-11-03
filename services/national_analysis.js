module.exports = class NationalAnalysis {
  constructor(query, partyModel) {
    this.query = query;
    this.partyModel = partyModel;
  }
  async find({ query: { year } }) {
    const { query, partyModel } = this;
    try {
      return await query.findAll({ where: { year }, include: [partyModel] });
    } catch (err) {
      console.warn("NationalAnalysis, ", err);
      return [];
    }
  }

  async create(req) {
    const { query, partyModel } = this;
    const filteredReq = { ...req, id: "" };

    delete filteredReq.id;

    try {
      const party = (
        await partyModel.findOne({
          where: { id: filteredReq.party_id, status: "A" }
        })
      ).toJSON();

      const nationalAnalysis = (await query.create(filteredReq)).toJSON();
      return { ...nationalAnalysis, party };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }

  async update(id, national) {
    const { votes, type, party_id, percentage, angle, bar, year } = national;
    const { query, partyModel } = this;

    try {
      await query.update(
        { votes, type, party_id, percentage, angle, bar, year },
        { where: { id, status: "A" } }
      );
      const party = (
        await partyModel.findOne({
          where: { id: party_id, status: "A" }
        })
      ).toJSON();

      return { ...national, party };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to update" };
    }
  }
};
