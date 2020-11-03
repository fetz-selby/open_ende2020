module.exports = class ConstituencySeat {
  constructor(
    query,
    constituencyModel,
    partyModel,
    candidateModel,
    regionModel
  ) {
    this.query = query;
    this.constituencyModel = constituencyModel;
    this.partyModel = partyModel;
    this.candidateModel = candidateModel;
    this.regionModel = regionModel;
  }
  async find({ query: { year, regionId } }) {
    const {
      query,
      constituencyModel,
      partyModel,
      candidateModel,
      regionModel
    } = this;

    try {
      return await query.findAll({
        where: { year, region_id: regionId, status: "A" },
        include: [constituencyModel, partyModel, candidateModel, regionModel]
      });
    } catch (err) {
      console.warn("ConstituencySeat, ", err);
      return [];
    }
  }
};
