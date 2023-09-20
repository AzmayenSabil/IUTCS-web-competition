const { sequelize } = require("../db");
const { DataTypes } = require("sequelize");

const Setting = sequelize.define(
  "Setting",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: "id", // Specify the column name in the table
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "settings",
    timestamps: false, // If you don't have timestamps in your table, set this to false
  }
);

module.exports = Setting;
