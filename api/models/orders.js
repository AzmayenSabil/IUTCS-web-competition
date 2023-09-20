const { sequelize } = require("../db");
const { DataTypes } = require("sequelize");
const moment = require("moment-timezone"); // Import the moment library
const Menu = require("../models/menus");
const User = require("../models/users");

const Order = sequelize.define(
  "Order",
  {
    user_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    menu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
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
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: false,
  }
);

// Define foreign key associations
Order.belongsTo(Menu, { foreignKey: "menu_id", targetKey: "menu_id" });
Order.belongsTo(User, { foreignKey: "user_id", targetKey: "user_id" });

// Hook to update createdAt before creating a new order
Order.beforeCreate((order, _) => {
  order.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
  // order.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
  // console.log(moment().format("YYYY-MM-DD HH:mm:ss"), order.createdAt);
});

// Hook to update updatedAt before updating an order
Order.beforeUpdate((order, _) => {
  order.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
});

module.exports = Order;
