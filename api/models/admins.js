const { sequelize } = require("../db");
const { DataTypes } = require("sequelize");

const Admin = sequelize.define(
  "Admin",
  {
    user_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      // field: 'user_id', // Specify the column name in the table
    },
    admin_id: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.STRING,
    },
    isSuperAdmin: {
      type: DataTypes.STRING,
    },
    emailNotification: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      // Add the deletedAt column definition
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "admins",
    timestamps: true, // If you don't have timestamps in your table, set this to false
    paranoid: true, // Enable soft deletes
    deletedAt: "deletedAt", // Specify the name of the soft delete column
  }
); //created_at & updated_at are redundants so delete these two columns

module.exports = Admin;
