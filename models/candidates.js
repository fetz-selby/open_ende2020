const { DataTypes } = require("sequelize");

module.exports = class Candidate {
  model(config) {
    const candidates = config.define(
      "candidates",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING
        },
        party_id: {
          type: DataTypes.INTEGER
        },
        constituency_id: {
          type: DataTypes.INTEGER
        },
        votes: {
          type: DataTypes.INTEGER
        },
        group_type: {
          type: DataTypes.ENUM,
          values: ["M", "P"],
          defaultValue: "M"
        },
        year: {
          type: DataTypes.TEXT
        },
        code: {
          type: DataTypes.STRING
        },
        avatar_path: {
          type: DataTypes.TEXT
        },
        percentage: {
          type: DataTypes.DOUBLE
        },
        angle: {
          type: DataTypes.DOUBLE
        },
        bar_ratio: {
          type: DataTypes.DOUBLE
        },
        status: {
          type: DataTypes.STRING,
          values: ["A", "D"],
          defaultValue: "A"
        }
      },
      { underscored: true, createdAt: false, updatedAt: false }
    );

    return candidates;
  }
};
