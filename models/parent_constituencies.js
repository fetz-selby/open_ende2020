const { DataTypes } = require("sequelize");

module.exports = class ParentConstituency {
  model(config) {
    const parentConstituencies = config.define(
      "parent_constituencies",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING
        },
        region_id: {
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

    return parentConstituencies;
  }
};
