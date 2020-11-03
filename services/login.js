module.exports = class Login {
  constructor(query, regionModel) {
    this.query = query;
    this.regionModel = regionModel;
  }
  async find({ query: { email, password } }) {
    const { query, regionModel } = this;

    try {
      const { getHash } = require("../utils");
      const user = (
        await query.findOne({
          where: { email, password: getHash(password), status: "A" }
        })
      ).toJSON();
      if (user) {
        delete user.password;

        const region = (
          await regionModel.findOne({
            where: { id: user.region_id, status: "A" }
          })
        ).toJSON();

        return { ...user, region: region.name };
      } else {
        throw Error("invalid cred");
      }
    } catch (err) {
      console.warn("Login, ", err);
      return { error: "invalid user" };
    }
  }
};
