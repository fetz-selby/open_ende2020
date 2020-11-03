const { DataTypes } = require("sequelize");

module.exports = class Party {
  model(config) {
    const parties = config.define(
      "parties",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING
        },
        logo_path: {
          type: DataTypes.TEXT
        },
        color: {
          type: DataTypes.STRING
        },
        order_queue: {
          type: DataTypes.INTEGER
        },
        status: {
          type: DataTypes.ENUM,
          values: ["A", "D"],
          defaultValue: "A"
        }
      },
      { underscored: true, createdAt: false, updatedAt: false }
    );

    return parties;
  }
};
