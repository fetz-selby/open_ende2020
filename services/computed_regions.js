module.exports = class ComputedRegion {
  constructor(query, regionModel) {
    this.query = query;
    this.regionModel = regionModel;
  }
  async find({ query: { year, regionId } }) {
    const { query, regionModel } = this;
    try {
      if (year && regionId) {
        return await query.findAll({
          where: { year, region_id: regionId },
          include: [regionModel]
        });
      } else if (year) {
        return await query.findAll({
          where: { year },
          include: [regionModel]
        });
      } else if (regionId) {
        return await query.findAll({
          where: { region_id: regionId },
          include: [regionModel]
        });
      }
      return await query.findAll({ include: [regionModel] });
    } catch (err) {
      console.warn("ComputedRegion, ", err);
      return [];
    }
  }

  async create(agent) {
    return {};
  }

  async update(regionId, year) {
    return {};
  }
};
