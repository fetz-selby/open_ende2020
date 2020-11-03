const { DataTypes } = require("sequelize");

module.exports = class Agent {
  model(config) {
    const agents = config.define(
      "agents",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING
        },
        msisdn: {
          type: DataTypes.STRING(13)
        },
        pin: {
          type: DataTypes.STRING
        },
        cons_id: {
          type: DataTypes.INTEGER
        },
        poll_id: {
          type: DataTypes.INTEGER
        },
        year: {
          type: DataTypes.STRING
        },
        status: {
          type: DataTypes.ENUM,
          values: ["A", "D"],
          defaultValue: "A"
        }
      },
      { underscored: true, createdAt: false, updatedAt: false }
    );

    return agents;
  }
};
