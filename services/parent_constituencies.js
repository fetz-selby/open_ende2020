module.exports = class ParentConstituency {
  constructor(query, regionModel) {
    this.query = query;
    this.regionModel = regionModel;
  }

  async find({ query: { regionId } }) {
    const { query, regionModel } = this;

    try {
      return regionId
        ? await query.findAll({
            where: { region_id: regionId },
            include: [regionModel]
          })
        : await query.findAll({ include: [regionModel] });
    } catch (err) {
      console.warn("ParentConstituency, ", err);
      return [];
    }
  }

  async create(req) {
    const { query, regionModel } = this;
    const filteredReq = { ...req, id: "" };

    delete filteredReq.id;

    try {
      const region = (
        await regionModel.findOne({
          where: { id: filteredReq.region_id, status: "A" }
        })
      ).toJSON();

      const parentConstituency = (await query.create(filteredReq)).toJSON();
      return { ...parentConstituency, region, regionId: req.region_id };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }

  async update(id, parentConstituency) {
    const { name, region_id } = parentConstituency;
    const { query, regionModel } = this;

    try {
      await query.update({ name, region_id }, { where: { id, status: "A" } });

      const region = (
        await regionModel.findOne({
          where: { id: region_id, status: "A" }
        })
      ).toJSON();

      return { ...parentConstituency, region, regionId: region_id };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to update" };
    }
  }
};
