const { DataTypes } = require("sequelize");

module.exports = class NationalAnalysis {
  model(config) {
    const nationalAnalysis = config.define(
      "national_analysis",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        votes: {
          type: DataTypes.INTEGER
        },
        type: {
          type: DataTypes.ENUM,
          values: ["P", "M"],
          defaultValue: "M"
        },
        party_id: {
          type: DataTypes.INTEGER
        },
        percentage: {
          type: DataTypes.DOUBLE
        },
        angle: {
          type: DataTypes.DOUBLE
        },
        bar: {
          type: DataTypes.DOUBLE
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
      {
        underscored: true,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
      }
    );

    return nationalAnalysis;
  }
};
