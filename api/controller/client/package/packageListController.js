const Package = require("../../../models/packages");
const Menu = require("../../../models/menus");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");

const {
  createTokens,
  validateToken,
} = require("../../../middleware/token/clientJWT");
const { verify } = require("jsonwebtoken");
const moment = require("moment-timezone");
require("dotenv").config();
const getPackageList = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header
    const decodedToken = verify(accessToken, process.env.JWT_SECRET);
    const { id, name } = decodedToken;

    const { page } = req.query;
    const limit = 18;
    const offset = (page - 1) * limit;

    const currentHour = moment().format("H");
    const currentMinutes = moment().format("m");

    const currentDate = moment().format("YYYY-MM-DD");

    // console.log(currentDate);

    const currentTimeString = `${String(currentHour).padStart(2, "0")}:${String(
      currentMinutes
    ).padStart(2, "0")}:00`;

    const lunchPackage = `
    SELECT 
    DATE_FORMAT(menus.date, '%Y-%m-%d') AS date,
    DATE_FORMAT(menus.date, '%W') AS day,
    HOUR(menus.date) AS current_hour,
    packages.name AS meal_details,
    packages.package_id AS package_id,
    menus.menu_id AS menu_id
    FROM 
      menus
    INNER JOIN 
      packages ON packages.package_id = menus.package_id
    WHERE 
      (
        (DATE(menus.date) = '${currentDate}' AND TIME(menus.date) > '${currentTimeString}')
        OR
        (DATE(menus.date) > '${currentDate}')
      )
      AND packages.active = 'yes'
      AND menus.meal_type = 'lunch' 
      AND menus.deletedAt IS NULL 
    ORDER BY menus.date ASC
    LIMIT ${limit} OFFSET ${offset}
    ;`;
    // console.log(lunchPackage);

    const lunchPackageList = await sequelize.query(lunchPackage, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const breakfastPackage = `
    SELECT 
    DATE_FORMAT(menus.date, '%Y-%m-%d') AS date,
    DATE_FORMAT(menus.date, '%W') AS day,
    HOUR(menus.date) AS current_hour,
    packages.name AS meal_details,
    packages.package_id AS package_id,
    menus.menu_id AS menu_id
    FROM 
      menus
    INNER JOIN 
      packages ON packages.package_id = menus.package_id
    WHERE 
      (
        (DATE(menus.date) = '${currentDate}' AND  TIME(menus.date) > '${currentTimeString}')
        OR
        (DATE(menus.date) > '${currentDate}' ) 
      )
      AND packages.active = 'yes'
      AND menus.meal_type = 'breakfast' 
      AND menus.deletedAt IS NULL 
    ORDER BY menus.date ASC
    LIMIT ${limit} OFFSET ${offset}
    ;`;

    const breakfastPackageList = await sequelize.query(breakfastPackage, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const numberOfBreakfast = `
    SELECT count(menus.menu_id) as totalNumberOfBreakfast from menus 
    inner join packages on menus.package_id = packages.package_id
    where packages.active = 'yes' AND menus.meal_type = 'breakfast'  
    AND menus.deletedAt IS NULL  
    `;
    const numberOfLunch = `
    SELECT count(menus.menu_id) as totalNumberOfLunch from menus  
    inner join packages on menus.package_id = packages.package_id
    where packages.active = 'yes' AND menus.meal_type = 'lunch'  
    AND menus.deletedAt IS NULL 
    `;

    const getNumberOfBreakfast = await sequelize.query(numberOfBreakfast, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const getNumberOfLunch = await sequelize.query(numberOfLunch, {
      type: Sequelize.QueryTypes.SELECT,
    });

    // const numberOfBreakfast = `
    // SELECT count(menus.menu_id) as totalNumberOfBreakfast from menus
    // inner join packages on menus.package_id = packages.package_id
    // where packages.active = 'yes' AND menus.meal_type = 'breakfast'
    // AND menus.deletedAt IS NULL
    // `
    // const numberOfLunch = `
    // SELECT count(menus.menu_id) as totalNumberOfLunch from menus
    // inner join packages on menus.package_id = packages.package_id
    // where packages.active = 'yes' AND menus.meal_type = 'lunch'
    // AND menus.deletedAt IS NULL
    // `

    // const getNumberOfBreakfast = await sequelize.query(numberOfBreakfast, {
    //   type: Sequelize.QueryTypes.SELECT,
    // });
    // const getNumberOfLunch = await sequelize.query(numberOfLunch, {
    //   type: Sequelize.QueryTypes.SELECT,
    // });

    // console.log(getNumberOfLunch[0].totalNumberOfLunch)

    res.status(200).json({
      code: 200,
      // token: accessToken,
      data: {
        user_id: id,
        username: name,
        breakfastPackageList: breakfastPackageList,
        lunchPackageList: lunchPackageList,
        totalNumberOfBreakfast: getNumberOfBreakfast[0].totalNumberOfBreakfast,
        totalNumberOfLunch: getNumberOfLunch[0].totalNumberOfLunch,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getPackageList };
