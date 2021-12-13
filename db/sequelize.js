const Sequelize = require('sequelize');
const TodoSequelize = require('../models/todo');
const dotenv = require('dotenv');
dotenv.config();


const sequelize = new Sequelize(process.env.MYSQLDB_DATABASE, process.env.MYSQLDB_USER, process.env.MYSQLDB_ROOT_PASSWORD, {
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const TodoModel = TodoSequelize(sequelize, Sequelize);

initialize(sequelize);

async function initialize(sequelize) {
  await sequelize.sync();
  console.log("All models were synchronized successfully.");
}

module.exports = {
  TodoModel
};