const { DataTypes } = require("sequelize");

module.exports = class ComputedRegion {
  model(config) {
    const computedRegions = config.define(
      "computed_regions",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        region_id: {
          type: DataTypes.INTEGER
        },
        is_computed: {
          type: DataTypes.ENUM,
          values: ["F", "T"],
          defaultValue: "F"
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

    return computedRegions;
  }
};
