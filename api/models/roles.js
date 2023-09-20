const { sequelize } = require("../db");
const { DataTypes } = require("sequelize");

const Role = sequelize.define(
  "Role",
  {
    role_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      // field: 'user_id', // Specify the column name in the table
    },
    role_name: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "roles",
    timestamps: true, // If you don't have timestamps in your table, set this to false
    paranoid: true, // Enable soft deletes
    deletedAt: "deletedAt", // Specify the name of the soft delete column
  }
); //created_at & updated_at are redundants so delete these two columns

module.exports = Role;
