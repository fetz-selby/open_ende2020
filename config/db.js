const { Sequelize } = require("sequelize");

const dialect = process.env.DIALET || "mysql";
const host = process.env.DB_HOST || "localhost";
const database = process.env.DB || "database";
const username = process.env.DB_USERNAME || "username";
const password = process.env.DB_PASSWORD || "password";

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect
});

module.exports = { sequelize };
