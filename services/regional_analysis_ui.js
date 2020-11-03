module.exports = class RegionalAnalysis {
  constructor(query, regionModel, partyModel) {
    this.query = query;
    this.regionModel = regionModel;
    this.partyModel = partyModel;
  }
  async find({ query: { year, regionId, candidateType } }) {
    const { query, regionModel, partyModel } = this;

    try {
      return (await query.findAll({
        where: { year, region_id: regionId, type: candidateType },
        include: [regionModel, partyModel]
      }));
    } catch (err) {
      console.warn("RegionalAnalysis, ", err);
      return [];
    }
  }
};
