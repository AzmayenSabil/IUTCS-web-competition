const { sequelize } = require("../db");
const { DataTypes } = require("sequelize");

const EmergencyContact = sequelize.define(
  "EmergencyContact",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
    },
    emergency_contact_one: {
      type: DataTypes.STRING,
    },
    emergency_contact_two: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "emergencycontacts",
    timestamps: true,
  }
);

module.exports = EmergencyContact;
