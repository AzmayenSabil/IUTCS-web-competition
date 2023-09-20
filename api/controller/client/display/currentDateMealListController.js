const Package = require("../../../models/packages");
const Menu = require("../../../models/menus");
const Order = require("../../../models/orders");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");
const moment = require("moment-timezone");

const {
  createTokens,
  validateToken,
} = require("../../../middleware/token/clientJWT");
const { verify } = require("jsonwebtoken");
require("dotenv").config();
const getCurrentDateMealList = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header
    const decodedToken = verify(accessToken, process.env.JWT_SECRET);
    const { id, name } = decodedToken;

    const { user_id } = req.params;

    const currentDate = moment().format("YYYY-MM-DD");

    // console.log(currentDate);

    const currentDateBreakfastMealQuery = `
    SELECT 
    count(menus.menu_id) as total_breakfast,
    DATE_FORMAT(menus.date, '%Y-%m-%d') AS date,
    DATE_FORMAT(menus.date, '%W') AS day,
    packages.name AS meal_details,
    packages.package_id AS package_id, 
    menus.menu_id AS menu_id,
    menus.meal_type as meal
FROM 
    menus
INNER JOIN 
    packages ON packages.package_id = menus.package_id
WHERE 
    (
      DATE(menus.date) = '${currentDate}'
    )
    AND packages.active = 'yes'
    AND menus.meal_type = 'breakfast' 
    AND menus.deletedAt IS NULL;
    `;
    const currentDateLunchMealQuery = `
    SELECT 
    count(menus.menu_id) as total_lunch,
    DATE_FORMAT(menus.date, '%Y-%m-%d') AS date,
    DATE_FORMAT(menus.date, '%W') AS day,
    packages.name AS meal_details,
    packages.package_id AS package_id, 
    menus.menu_id AS menu_id,
    menus.meal_type as meal
FROM 
    menus
INNER JOIN 
    packages ON packages.package_id = menus.package_id
WHERE 
    (
      DATE(menus.date) = '${currentDate}' 
    )
    AND packages.active = 'yes'
    AND menus.meal_type = 'lunch' 
    AND menus.deletedAt IS NULL;
    `;

    const currentDateBreakfastOrderedQuery = `
    select 
    count(orders.user_id) as breakfast_ordered
    from orders 
    inner join users on users.user_id = orders.user_id 
    INNER join menus on menus.menu_id = orders.menu_id 
    WHERE orders.user_id = :user_id and 
    date(menus.date) = '${currentDate}' and menus.meal_type = 'Breakfast';
    `;
    const currentDateLunchtOrderedQuery = `
    select 
    count(orders.user_id) as lunch_ordered 
    from orders 
    inner join users on users.user_id = orders.user_id 
    INNER join menus on menus.menu_id = orders.menu_id 
    WHERE orders.user_id = :user_id and 
    date(menus.date) = '${currentDate}' and menus.meal_type = 'Lunch';
    `;

    const currentDateBreakfastMeal = await sequelize.query(
      currentDateBreakfastMealQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const currentDateLunchMeal = await sequelize.query(
      currentDateLunchMealQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const isCurrentDateBreakfastOrdered = await sequelize.query(
      currentDateBreakfastOrderedQuery,
      {
        replacements: { user_id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const isCurrentDateLunchOrdered = await sequelize.query(
      currentDateLunchtOrderedQuery,
      {
        replacements: { user_id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      code: 200,
      // token: accessToken,
      data: {
        user_id: id,
        currentDateBreakfastMeal: currentDateBreakfastMeal[0],
        currentDateLunchMeal: currentDateLunchMeal[0],
        isCurrentDateBreakfastOrdered: isCurrentDateBreakfastOrdered[0],
        isCurrentDateLunchOrdered: isCurrentDateLunchOrdered[0],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getCurrentDateMealList };
