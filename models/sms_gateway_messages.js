const { DataTypes, Sequelize } = require("sequelize");

module.exports = class SMSGatewayMessage {
  model(config) {
    const smsGatewayMessages = config.define(
      "sms_gateway_messages",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        message_id: {
          type: DataTypes.INTEGER
        },
        message: {
          type: DataTypes.TEXT
        },
        from_msisdn: {
          type: DataTypes.STRING
        },
        status: {
          type: DataTypes.ENUM,
          values: ["A", "D"],
          defaultValue: "A"
        }
      },
      {
        underscored: true,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true,
        createdAt: "posted_ts"
      }
    );

    return smsGatewayMessages;
  }
};
