const { DataTypes } = require("sequelize");

module.exports = class ApproveList {
  model(config) {
    const approveList = config.define(
      "approve_list",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        msisdn: {
          type: DataTypes.STRING,
        },
        message: {
          type: DataTypes.TEXT,
        },
        message_id: {
          type: DataTypes.TEXT,
        },
        feed: {
          type: DataTypes.TEXT,
        },
        region_id: {
          type: DataTypes.INTEGER,
        },
        cons_id: {
          type: DataTypes.INTEGER,
        },
        poll_id: {
          type: DataTypes.INTEGER,
        },
        agent_id: {
          type: DataTypes.INTEGER,
        },
        is_approved: {
          type: DataTypes.ENUM,
          values: ["Y", "N"],
          defaultValue: "N",
        },
        type: {
          type: DataTypes.ENUM,
          values: ["M", "P"],
          defaultValue: "M",
        },
        year: {
          type: DataTypes.STRING,
        },
        posted_ts: {
          type: DataTypes.DATE,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["A", "D"],
          defaultValue: "A",
        },
      },
      {
        underscored: true,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true,
      }
    );

    return approveList;
  }
};
