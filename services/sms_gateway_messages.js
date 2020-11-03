module.exports = class SMSGatewayMessage {
  constructor(query) {
    this.query = query;
  }
  async find() {
    const { query } = this;

    try {
      return await query.findAll();
    } catch (err) {
      console.warn("SMSGatewayMessage, ", err);
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
