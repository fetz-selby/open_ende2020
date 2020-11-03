const { DataTypes } = require("sequelize");
const utils = require("../utils");

module.exports = class User {
  model(config) {
    const users = config.define(
      "users",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING
        },
        msisdn: {
          type: DataTypes.STRING(14),
          unique: true,
          validate: {
            isNumeric: true
          },
          set(val) {
            this.setDataValue("msisdn", val.trim());
          }
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          validate: {
            isEmail: true
          },
          set(val) {
            this.setDataValue("email", val.trim().toLowerCase());
          }
        },
        password: {
          type: DataTypes.STRING,
          set(val) {
            this.setDataValue("password", utils.getHash(val.trim()));
          }
        },
        level: {
          type: DataTypes.STRING(1)
        },
        is_external_user: {
          type: DataTypes.ENUM,
          values: ["Y", "N"],
          defaultValue: "N"
        },
        region_id: {
          type: DataTypes.INTEGER
        },
        year: {
          type: DataTypes.STRING(4)
        },
        status: {
          type: DataTypes.ENUM,
          values: ["A", "D"],
          defaultValue: "A"
        }
      },
      { underscored: true, createdAt: false, updatedAt: false }
    );

    return users;
  }
};
