// sequelize instance
const sequelize = require("../config/database");

// Import Sequelize class and DataTypes
const { Sequelize, DataTypes } = require("sequelize");

const HealthCheck = sequelize.define(
  "HealthCheck",
  {
    CheckId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    datetime: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    // Disabled automatic creation of `createdAt` and `updatedAt`
    timestamps: false,
  }
);

// Define the File model
const File = sequelize.define("File", {
  fileId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

const initializeDatabase = async () => {
  // Synchronize models with the database
  await sequelize.sync({ alter: true });
};

module.exports = { HealthCheck, File, initializeDatabase };
