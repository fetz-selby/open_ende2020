module.exports = class User {
  constructor(query, regionModel) {
    this.query = query;
    this.regionModel = regionModel;
  }

  async find() {
    const { query, regionModel } = this;

    try {
      return await query.findAll({
        where: { status: "A" },
        include: [regionModel]
      });
    } catch (err) {
      console.warn("User, ", err);
      return [];
    }
  }

  async create(req) {
    const { query, regionModel } = this;
    const filteredReq = { ...req, id: "" };

    try {
      const region = (
        await regionModel.findOne({
          where: { id: filteredReq.region_id, status: "A" }
        })
      ).toJSON();
      const user = (await query.create(filteredReq)).toJSON();

      delete user.password;

      return { ...user, region };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }

  async update(id, user) {
    const { name, msisdn, email, password, level, region_id, year } = user;
    const { query, regionModel } = this;

    console.log("user, ", user);
    try {
      if (password) {
        await query.update(
          { name, msisdn, email, password, level, region_id, year },
          { where: { id, status: "A" } }
        );
      } else {
        await query.update(
          { name, msisdn, email, level, region_id, year },
          { where: { id, status: "A" } }
        );
      }
      const region = (
        await regionModel.findOne({
          where: { id: region_id, status: "A" }
        })
      ).toJSON();

      return { ...user, region };
    } catch (err) {
      console.error("could not update, ", err);
      return { error: "Failed to update" };
    }
  }
};
