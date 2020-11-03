const { DataTypes } = require("sequelize");

module.exports = class Region {
  model(config) {
    const regions = config.define(
      "regions",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        seats: {
          type: DataTypes.INTEGER,
        },
        gateway: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["A", "D"],
          defaultValue: "A",
        },
      },
      { underscored: true, createdAt: false, updatedAt: false }
    );

    return regions;
  }
};
