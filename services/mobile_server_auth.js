module.exports = class ServerMobileAuth {
  constructor(smsGatewayMessageModel) {
    this.smsGatewayMessageModel = smsGatewayMessageModel;
  }

  insert = async (smsGatewayMessageModel, payload) => {};

  async find({ query: { payload, type } }) {
    const { smsGatewayMessageModel } = this;

    if (!type) throw new Error("[type] expected");
    try {
      switch (type) {
        case "auth":
          return { alive: true };

        case "insert":
          await this.insert(smsGatewayMessageModel, payload);
          break;
      }

      return { status: "completed" };
    } catch (err) {
      console.warn("Init, ", err);
      return { status: err };
    }
  }

  async create(req) {
    try {
      console.log("req, ", req);
      return { success: req };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }
};
