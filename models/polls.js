const { DataTypes } = require("sequelize");

module.exports = class Poll {
  model(config) {
    const polls = config.define(
      "polls",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING
        },
        cons_id: {
          type: DataTypes.INTEGER
        },
        rejected_votes: {
          type: DataTypes.INTEGER
        },
        valid_votes: {
          type: DataTypes.INTEGER
        },
        total_voters: {
          type: DataTypes.INTEGER
        },
        year: {
          type: DataTypes.STRING
        },
        external_id: {
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

    return polls;
  }
};
