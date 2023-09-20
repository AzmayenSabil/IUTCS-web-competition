const Order = require("../../../models/orders");
const Menu = require("../../../models/menus");
const User = require("../../../models/users");
const Package = require("../../../models/packages");
const { validateToken } = require("../../../middleware/token/clientJWT");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");
const moment = require("moment-timezone");

const { Op } = Sequelize;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = process.env.JWT_SECRET;
require("dotenv").config();

const createOrder = async (req, res) => {
  let { menu_ids } = req.body;

  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header
    // Decode the access token and retrieve the id and name

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized User!" });
    }
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Extract the username and id from the decoded token
    const { id, name } = decodedToken;

    // Convert single menu_id to an array
    if (!Array.isArray(menu_ids)) {
      menu_ids = [menu_ids];
    }

    if (!menu_ids || menu_ids.length === 0) {
      // console.log("triggered")
      return res.status(500).json({ error: "Order already placed" });
    }

    // Create the orders for each menu_id and user_id
    // const orderedPackageData = await Promise.all(
    //   menu_ids.map(async (menu_id) => {
    //     // let menuTime = moment()

    //     return await Order.create({
    //       menu_id: menu_id,
    //       user_id: id, // Use the user_id from the decoded token
    //     });
    //   })
    // );
    const orderedPackageData = await Promise.all(
      menu_ids.map(async (menu_id) => {
        const [menuTimeRow] = await sequelize.query(
          `SELECT DATE_FORMAT(menus.date, '%Y-%m-%d %H:%i:%s') AS menu_time
          FROM menus WHERE menus.menu_id = ?`,
          {
            replacements: [menu_id],
            type: sequelize.QueryTypes.SELECT,
          }
        );

        const { menu_time } = menuTimeRow;

        const currentTime = moment().unix();
        const menuTimeUnix = moment(menu_time).unix(); // Remove format since menu_time includes both date and time

        if (currentTime >= menuTimeUnix) {
          return { menu_id: menu_id, skipped: true };
        } else {
          const order = await Order.create({
            menu_id: menu_id,
            user_id: id,
          });
          return { menu_id: menu_id, skipped: false, order: order };
        }
      })
    );

    res.json({
      code: 200,
      // token:accessToken,
      data: {
        iuser_id: id,
        username: name,
        orderedPackageData: orderedPackageData,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAggregatedOrderData = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }
  const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

  const { id, name } = decodedToken;

  const { user_id } = req.params; // Extract the user_id from req.params

  try {
    const lunchAndBreakfastCount = `
    SELECT
    COUNT(CASE WHEN menus.meal_type = 'lunch' THEN 1 END) AS total_lunch,
    COUNT(CASE WHEN menus.meal_type = 'breakfast' THEN 1 END) AS total_breakfast
FROM
    orders
INNER JOIN
    menus ON menus.menu_id = orders.menu_id
WHERE
    orders.user_id = :user_id;

  
  `;

    const lunchAndBreakfastOrderCount = await sequelize.query(
      lunchAndBreakfastCount,
      {
        replacements: { user_id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      code: 200,
      // accessToken: accessToken,
      data: {
        user_id: id,
        username: name,
        lunchAndBreakfastOrderCount: lunchAndBreakfastOrderCount,
      },
    });
  } catch (error) {
    console.error("Error fetching Present Order history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getClientPresentOrderHistory = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }
  const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

  const { id, name } = decodedToken;

  const { user_id } = req.params; // Extract the user_id from req.params

  const { page } = req.query;
  const limit = 8;

  const offset = (page - 1) * limit;

  try {
    const orderHistory = `
    SELECT DATE_FORMAT(menus.date, '%W') AS weekDay, DATE_FORMAT(menus.date, '%Y-%m-%d') AS date, 
    TIME(menus.createdAt) AS time, 
    DATE_FORMAT(orders.createdAt, '%Y-%m-%d') AS orderDate,  
    TIME(orders.createdAt) AS orderTime,
    packages.name as menu, menus.meal_type as type 
    FROM orders 
    INNER JOIN menus ON menus.menu_id = orders.menu_id 
    INNER JOIN packages ON menus.package_id = packages.package_id 
    WHERE (menus.meal_type = 'breakfast' OR menus.meal_type = 'lunch') AND date(menus.date) >= CURDATE() 
    AND orders.user_id = :user_id 
    ORDER BY menus.date ASC 
    LIMIT ${limit} OFFSET ${offset}`;

    const total_order_of_current_user = `
    SELECT
    COUNT(orders.user_id) AS total_order_of_current_user
    FROM
    orders
    inner join menus on orders.menu_id = menus.menu_id
    WHERE 
    orders.deleted_at IS NULL AND date(menus.date) >= CURDATE() AND orders.user_id = :user_id
  `;

    const clientOrderHistory = await sequelize.query(orderHistory, {
      replacements: { user_id },
      type: Sequelize.QueryTypes.SELECT,
    });

    const getTotalOrders = await sequelize.query(total_order_of_current_user, {
      replacements: { user_id },
      type: Sequelize.QueryTypes.SELECT,
    });

    // console.log(getTotalOrders[0].total_order_of_current_user)

    res.status(200).json({
      code: 200,
      // accessToken: accessToken,
      data: {
        user_id: id,
        username: name,
        getTotalOrders: getTotalOrders[0].total_order_of_current_user,
        clientOrderHistory: clientOrderHistory,
      },
    });
  } catch (error) {
    console.error("Error fetching Present Order history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getClientPastOrderHistory = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }
  const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

  const { id, name } = decodedToken;

  const { user_id } = req.params; // Extract the user_id from req.params

  const { page } = req.query;
  const limit = 8;

  const offset = (page - 1) * limit;

  try {
    const orderHistory = `
    SELECT DATE_FORMAT(menus.date, '%W') AS weekDay, DATE_FORMAT(menus.date, '%Y-%m-%d') AS date, 
    TIME(menus.createdAt) AS time, 
    DATE_FORMAT(orders.createdAt, '%Y-%m-%d') AS orderDate,  
    TIME(orders.createdAt) AS orderTime,
    packages.name as menu, menus.meal_type as type 
    FROM orders 
    INNER JOIN menus ON menus.menu_id = orders.menu_id 
    INNER JOIN packages ON menus.package_id = packages.package_id 
    WHERE (menus.meal_type = 'breakfast' OR menus.meal_type = 'lunch') AND date(menus.date) < CURDATE()  
    AND orders.user_id = :user_id 
    ORDER BY menus.date DESC 
    LIMIT ${limit} OFFSET ${offset}`;

    const total_order_of_current_user = `
    SELECT
    COUNT(orders.user_id) AS total_order_of_current_user
    FROM
    orders
    inner join menus on orders.menu_id = menus.menu_id
    WHERE
    orders.deleted_at IS NULL AND date(menus.date) < CURDATE() AND orders.user_id = :user_id
  `;

    const clientOrderHistory = await sequelize.query(orderHistory, {
      replacements: { user_id },
      type: Sequelize.QueryTypes.SELECT,
    });

    const getTotalOrders = await sequelize.query(total_order_of_current_user, {
      replacements: { user_id },
      type: Sequelize.QueryTypes.SELECT,
    });

    // console.log(getTotalOrders[0].total_order_of_current_user)

    res.status(200).json({
      code: 200,
      // accessToken: accessToken,
      data: {
        user_id: id,
        username: name,
        getTotalOrders: getTotalOrders[0].total_order_of_current_user,
        clientOrderHistory: clientOrderHistory,
      },
    });
  } catch (error) {
    console.error("Error fetching Present Order history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllMenuId = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }
  const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

  // Extract the username and id from the decoded token
  const { id, name } = decodedToken;

  const { user_id } = req.params; // Extract the user_id from req.params

  try {
    const checkAllMenuId = `SELECT menu_id FROM orders WHERE user_id = :user_id`;

    const checkMenuId = await sequelize.query(checkAllMenuId, {
      replacements: { user_id },
      type: Sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      code: 200,
      // accessToken: accessToken,
      data: {
        checkMenuId: checkMenuId,
      },
    });
  } catch (error) {
    console.error("Error fetching menu ids:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteOrderByMenuId = async (req, res) => {
  const { menu_id } = req.params;

  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized User!" });
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const { id, name } = decodedToken;

    const deletedOrder = await Order.destroy({
      where: { menu_id, user_id: id },
    });

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      code: 200,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getClientPresentOrderHistory,
  getClientPastOrderHistory,
  createOrder,
  getAllMenuId,
  deleteOrderByMenuId,
  getAggregatedOrderData,
};
