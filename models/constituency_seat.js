const { DataTypes } = require("sequelize");

module.exports = class ConstituencySeat {
  model(config) {
    const constituencySeat = config.define(
      "constituency_seat",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        votes: {
          type: DataTypes.INTEGER
        },
        cons_id: {
          type: DataTypes.INTEGER
        },
        party_id: {
          type: DataTypes.INTEGER
        },
        candidate_id: {
          type: DataTypes.INTEGER
        },
        region_id: {
          type: DataTypes.INTEGER
        },
        percentage: {
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

    return constituencySeat;
  }
};
