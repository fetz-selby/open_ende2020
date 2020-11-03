module.exports = class RegionalAnalysis {
  constructor(query, regionModel, partyModel) {
    this.query = query;
    this.regionModel = regionModel;
    this.partyModel = partyModel;
  }
  async find({ query: { year, regionId } }) {
    const { query, regionModel, partyModel } = this;

    try {
      return await query.findAll({
        where: { year, region_id: regionId },
        include: [regionModel, partyModel]
      });
    } catch (err) {
      console.warn("RegionalAnalysis, ", err);
      return [];
    }
  }

  async create(req) {
    const { query, regionModel, partyModel } = this;
    const filteredReq = { ...req, id: "" };

    delete filteredReq.id;

    try {
      const region = (
        await regionModel.findOne({
          where: { id: filteredReq.region_id, status: "A" }
        })
      ).toJSON();

      const party = (
        await partyModel.findOne({
          where: { id: filteredReq.party_id, status: "A" }
        })
      ).toJSON();

      const regionAnalysis = (await query.create(filteredReq)).toJSON();
      return { ...regionAnalysis, region, party, regionId: req.region_id };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }

  async update(id, regional) {
    const {
      region_id,
      party_id,
      votes,
      type,
      bar_ratio,
      angle,
      percentage,
      year
    } = regional;
    const { query, regionModel, partyModel } = this;

    try {
      await query.update(
        {
          region_id,
          party_id,
          votes,
          type,
          bar_ratio,
          angle,
          percentage,
          year
        },
        { where: { id, status: "A" } }
      );

      const region = (
        await regionModel.findOne({
          where: { id: region_id, status: "A" }
        })
      ).toJSON();

      const party = (
        await partyModel.findOne({
          where: { id: party_id, status: "A" }
        })
      ).toJSON();

      return { ...regional, region, party, regionId: region_id };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }
};
