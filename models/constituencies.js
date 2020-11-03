const { DataTypes } = require("sequelize");

module.exports = class Constituency {
  model(config) {
    const constituencies = config.define(
      "constituencies",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING
        },
        district_id: {
          type: DataTypes.INTEGER
        },
        reg_votes: {
          type: DataTypes.INTEGER
        },
        reject_votes: {
          type: DataTypes.INTEGER
        },
        casted_votes: {
          type: DataTypes.INTEGER
        },
        year: {
          type: DataTypes.STRING
        },
        is_declared: {
          type: DataTypes.ENUM,
          values: ["Y", "N"],
          defaultValue: "N"
        },
        auto_compute: {
          type: DataTypes.ENUM,
          values: ["T", "F"],
          defaultValue: "F"
        },
        parent_id: {
          type: DataTypes.INTEGER
        },
        seat_won_id: {
          type: DataTypes.INTEGER
        },
        total_votes: {
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

    return constituencies;
  }
};
