const { DataTypes } = require("sequelize");

module.exports = class RegionalAnalysis {
  model(config) {
    const regionalAnalysis = config.define(
      "regional_analysis",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        region_id: {
          type: DataTypes.INTEGER
        },
        party_id: {
          type: DataTypes.INTEGER
        },
        votes: {
          type: DataTypes.INTEGER
        },
        type: {
          type: DataTypes.ENUM,
          values: ["P", "M"],
          defaultValue: "M"
        },
        status: {
          type: DataTypes.ENUM,
          values: ["A", "D"],
          defaultValue: "A"
        },
        bar_ratio: {
          type: DataTypes.DOUBLE
        },
        angle: {
          type: DataTypes.DOUBLE
        },
        percentage: {
          type: DataTypes.DOUBLE
        },
        year: {
          type: DataTypes.STRING
        }
      },
      {
        underscored: true,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
      }
    );

    return regionalAnalysis;
  }
};
