const Sequelize = require('sequelize');
const TodoSequelize = require('../models/todo');
const dotenv = require('dotenv');
dotenv.config();


const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
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