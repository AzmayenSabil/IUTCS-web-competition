const { sequelize, Model } = require("../db");
const { DataTypes } = require("sequelize");
const Package = require("../models/packages");
const moment = require("moment");

const Menu = sequelize.define(
  "Menu",
  {
    menu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    meal_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "Menu",
    tableName: "menus",
    timestamps: false,
    // paranoid: true, // Enable soft deletes
    // deletedAt: "deletedAt", // Specify the name of the soft delete column
  }
);

// Menu.belongsTo(Package,{foreignKey: 'package_id'});
// Menu.belongsTo(Package, {as:'menus',  foreignKey: "package_id", sourceKey: 'package_id' });

// Hook to update createdAt before creating a new package
Menu.beforeCreate((menu, _) => {
  menu.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
});

// Hook to update updatedAt before updating a package
Menu.beforeUpdate((menu, _) => {
  menu.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
});

module.exports = Menu;
