const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    dialect: 'mysql',
    logging: false
  }
);

let schemaEnhancementPromise = null;
let loggedSuccessfulConnection = false;

async function ensureMySqlSchema() {
  if (schemaEnhancementPromise) return schemaEnhancementPromise;

  schemaEnhancementPromise = (async () => {
    require('../models/mysql/models');

    await sequelize.authenticate();

    if (!loggedSuccessfulConnection) {
      console.log('✅ MySQL connected successfully');
      loggedSuccessfulConnection = true;
    }

    await sequelize.sync({ alter: true });
  })().catch((err) => {
    schemaEnhancementPromise = null;
    throw err;
  });

  return schemaEnhancementPromise;
}

module.exports = sequelize;
module.exports.sequelize = sequelize;
module.exports.ensureMySqlSchema = ensureMySqlSchema;
