const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  console.log('Attempting to connect to PostgreSQL database...');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  });
} else {
  console.log('No DATABASE_URL found. Falling back to local SQLite database...');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false
  });
}

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connected successfully using: ${sequelize.getDialect()}!`);
  } catch (error) {
    console.error('Database connection failed. Attempting SQLite fallback...');
    // If PG connection failed, we dynamically fall back to SQLite to ensure system runs
    if (sequelize.getDialect() === 'postgres') {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../database.sqlite'),
        logging: false
      });
      await sequelize.authenticate();
      console.log('Database connected successfully using SQLite fallback!');
    } else {
      throw error;
    }
  }
};

module.exports = {
  sequelize,
  checkConnection
};
