const { sequelize, Model } = require("../db");
const { DataTypes } = require("sequelize");
const moment = require("moment");

const Holidays = sequelize.define(
  "Holidays",
  {
    holiday_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      // unique: true,
    },
    holiday_name: {
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
  },
  {
    sequelize,
    modelName: "Holidays",
    tableName: "holidays",
    timestamps: false,
  }
);

// Hook to update createdAt before creating a new holiday
Holidays.beforeCreate((holidays, _) => {
  // console.log("Running created at");
  // holidayCalender.date = moment().format("YYYY-MM-DD");
  holidays.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
  holidays.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
});

// // Hook to update updatedAt before updating a holiday
Holidays.beforeUpdate((holidays, _) => {
  // console.log("Running updated at");
  holidays.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
});

module.exports = Holidays;
