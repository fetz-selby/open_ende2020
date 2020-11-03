module.exports = class Party {
  constructor(query) {
    this.query = query;
  }
  async find() {
    const { query } = this;

    try {
      return await query.findAll();
    } catch (err) {
      console.warn("Party, ", err);
      return [];
    }
  }

  async create(req) {
    const { query } = this;
    const filteredReq = { ...req, id: "" };

    delete filteredReq.id;

    try {
      const party = (await query.create(filteredReq)).toJSON();

      return { ...party };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }

  async update(id, party) {
    const { name, logo_path, color, order_queue } = party;
    const { query } = this;

    try {
      await query.update(
        { name, logo_path, color, order_queue },
        { where: { id, status: "A" } }
      );

      return { ...party };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to update" };
    }
  }
};
