const { sequelize, Model } = require("../db");
const { DataTypes } = require("sequelize");
const moment = require("moment"); // Import the moment library

const Package = sequelize.define(
  "Package",
  {
    package_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    vendor: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.STRING,
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
    modelName: "Package",
    tableName: "packages",
    timestamps: false,
    // paranoid: true,
    // deletedAt: "deletedAt",
  }
);

// Hook to update createdAt before creating a new package
Package.beforeCreate((pkg, _) => {
  pkg.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
});

// Hook to update updatedAt before updating a package
Package.beforeUpdate((pkg, _) => {
  pkg.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
});

module.exports = Package;
