module.exports = class Region {
  constructor(query) {
    this.query = query;
  }
  async find() {
    const { query } = this;

    try {
      return await query.findAll({ where: { status: "A" } });
    } catch (err) {
      console.warn("Region, ", err);
      return [];
    }
  }

  async create(req) {
    const { query } = this;

    const region = { ...req, id: "" };

    delete region.id;

    try {
      return await query.create(region);
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }

  async update(_, data) {
    const { id, name, seats, gateway } = data;
    const { query } = this;
    try {
      const region = await query.update(
        { name, seats, gateway },
        { where: { id, status: "A" } }
      );
      return data;
    } catch (err) {
      console.error("could not update, ", err);
      return { error: "Failed to update" };
    }
  }

  async remove(id) {
    const { query } = this;

    try {
      await query.update({ status: "D" }, { where: { id } });
      return id;
    } catch (err) {
      console.error("could not delete, ", err);
      return 0;
    }
  }
};
