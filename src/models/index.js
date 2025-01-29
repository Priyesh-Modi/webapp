
// sequelize instance
const sequelize = require('../config/database');

// Import Sequelize class and DataTypes
const { Sequelize, DataTypes } = require('sequelize');

const HealthCheck = sequelize.define('HealthCheck', {
  CheckId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  datetime: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  // Disabled automatic creation of `createdAt` and `updatedAt`
  timestamps: false, 
});


const initializeDatabase = async () => {
  // Synchronize models with the database
  await sequelize.sync({ alter: true });
};

module.exports = { HealthCheck, initializeDatabase };
