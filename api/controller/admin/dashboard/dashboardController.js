const User = require("../../../models/users");
const Order = require("../../../models/orders");
const Package = require("../../../models/packages");
const Menu = require("../../../models/menus");
const bcrypt = require("bcrypt");
const { getToken } = require("../../../middleware/token/adminJWT");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");
require("dotenv").config();

const getAllAggregatedDataForDashboardCards = async (req, res) => {
  const { monthIndex } = req.query;
  const accessToken = getToken(req, res);
  try {
    const countUserNumber = `
            SELECT count(user_id) as total_user FROM users where users.active = 'yes' ;
        `;

    const countOrderNumber = `
            SELECT COUNT(orders.user_id) as total_order 
            FROM orders 
            JOIN menus ON orders.menu_id = menus.menu_id
            WHERE orders.deleted_at IS NULL 
            AND YEAR(menus.date) = YEAR(CURRENT_DATE())
            AND MONTH(menus.date) = :monthIndex;
        `;
    const countNumberOfMaleUser = `SELECT COUNT(users.user_id) as total_male_user from users where users.active = 'yes' and users.gender = 'male'`;
    const countNumberOfFemaleUser = `SELECT COUNT(users.user_id) as total_female_user from users where users.active = 'yes' and users.gender = 'female'`;

    const getTotalUserNumber = await sequelize.query(countUserNumber, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const getTotalOrderNumber = await sequelize.query(countOrderNumber, {
      replacements: { monthIndex },
      type: Sequelize.QueryTypes.SELECT,
    });
    const getTotalMaleUser = await sequelize.query(countNumberOfMaleUser, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const getTotalFemaleUser = await sequelize.query(countNumberOfFemaleUser, {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      code: 200,
      data: {
        accessToken: accessToken,
        total_user: getTotalUserNumber[0].total_user,
        total_order: getTotalOrderNumber[0].total_order,
        total_male_user: getTotalMaleUser[0].total_male_user,
        total_female_user: getTotalFemaleUser[0].total_female_user,
      },
    });
  } catch (error) {
    console.error("Error fetching Dashboard Data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllAggregatedDataForDashboardCards,
};
