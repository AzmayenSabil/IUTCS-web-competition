const moment = require("moment");

const Menu = require("../../../models/menus");
const Setting = require("../../../models/settings");
const Order = require("../../../models/orders");
const Package = require("../../../models/packages");
const User = require("../../../models/users");

const {
  validateToken,
  getToken,
} = require("../../../middleware/token/adminJWT");
const Sequelize = require("sequelize");

const { sequelize, Model } = require("../../../db");

// Get all menus with pagination
const getAllPastMenus = async (req, res) => {
  const { page, pageSize } = req.query; // Retrieve pagination parameters from req.query
  // console.log("Request query ", page, pageSize);

  const totalCountQuery = `
      SELECT COUNT(*) AS total_menus
      FROM menus
      WHERE menus.deletedAt IS NULL AND menus.date < CURDATE();
    `;
  const totalCountResult = await sequelize.query(totalCountQuery, {
    type: Sequelize.QueryTypes.SELECT,
  });
  const totalMenus = totalCountResult[0].total_menus;

  const calculatedTotalPage = Math.ceil(totalMenus / pageSize);
  if (calculatedTotalPage < page) {
    page = calculatedTotalPage;
  }

  const offset = (parseInt(page) - 1) * parseInt(pageSize);

  try {
    const accessToken = getToken(req, res);

    const menuDataQuery = `
      SELECT
        menus.menu_id AS menu_id,
        DATE_FORMAT(menus.date, '%Y-%m-%d') AS date,
        menus.meal_type AS meal_type,
        packages.package_id AS package_id,
        packages.name AS package_name,
        COUNT(orders.menu_id) AS orders_count
      FROM
        menus
      INNER JOIN packages ON packages.package_id = menus.package_id
      LEFT JOIN orders ON menus.menu_id = orders.menu_id
      LEFT JOIN users ON users.user_id = orders.user_id
      WHERE menus.deletedAt IS NULL AND menus.date < CURDATE()
      GROUP BY menus.menu_id
      ORDER BY menus.date DESC
      LIMIT :pageSize OFFSET :offset;
    `;

    const menuData = await sequelize.query(menuDataQuery, {
      replacements: { pageSize: parseInt(pageSize), offset },
      type: Sequelize.QueryTypes.SELECT,
    });

    const formattedMenuData = menuData.map((menu) => {
      // const ordersForMenu = menu.orders ? JSON.parse(menu.orders) : [];

      return {
        menu_id: menu.menu_id,
        date: menu.date,
        meal_type: menu.meal_type,
        package_id: menu.package_id,
        package_name: menu.package_name,
        orders_count: menu.orders_count,
        // orders: ordersForMenu,
      };
    });

    res.status(200).json({
      code: 200,
      data: formattedMenuData,
      total_menus: totalMenus,
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

const getAllOrdersOfAPastMenu = async (req, res) => {
  try {
    const { menu_id } = req.params;

    const ordersQuery = `
      SELECT
        orders.user_id AS user_id,
        orders.createdAt as createdAt,
        users.name AS username,
        users.employee_id AS employee_id
      FROM orders
      LEFT JOIN users ON orders.user_id = users.user_id
      WHERE orders.menu_id = :menu_id;
    `;

    const orders = await sequelize.query(ordersQuery, {
      replacements: { menu_id },
      type: Sequelize.QueryTypes.SELECT,
    });
    // console.log(orders)

    res.status(200).json({
      code: 200,
      data: orders.map((order) => ({
        user_id: order.user_id,
        username: order.username,
        employee_id: order.employee_id,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

const getAllPastMenusBetweenTwoDate = async (req, res) => {
  const { page, pageSize, from, to } = req.query; // Retrieve pagination parameters from req.query
  // console.log("Request query ", page, pageSize);
  const offset = (parseInt(page) - 1) * parseInt(pageSize);
  // console.log(from, to);
  try {
    const accessToken = getToken(req, res);

    const pastMenuDataQueryBetweenTwoDate = `
      SELECT
        menus.menu_id AS menu_id,
        DATE_FORMAT(menus.date, '%Y-%m-%d') AS date,
        menus.meal_type AS meal_type,
        packages.package_id AS package_id,
        packages.name AS package_name,
        IFNULL(
          CONCAT('[', GROUP_CONCAT(
            IF(orders.user_id IS NOT NULL,
              JSON_OBJECT(
                'user_id', orders.user_id,
                'username', users.name,
                'employee_id', users.employee_id
              ), 
              NULL
            )
          ), ']'),
          NULL
        ) AS orders
      FROM
        menus
      INNER JOIN packages ON packages.package_id = menus.package_id
      LEFT JOIN orders ON menus.menu_id = orders.menu_id
      LEFT JOIN users ON users.user_id = orders.user_id
      WHERE menus.deletedAt IS NULL AND menus.date < CURDATE() AND DATE(menus.date) BETWEEN DATE(:from) AND DATE(:to)
      GROUP BY menus.menu_id
      ORDER BY menus.date DESC
      LIMIT :pageSize OFFSET :offset;
    `;

    const pastMenuDataBetweenTwoDate = await sequelize.query(
      pastMenuDataQueryBetweenTwoDate,
      {
        replacements: { pageSize: parseInt(pageSize), offset, from, to },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const formattedPastMenuDataBetweenTwoDate = pastMenuDataBetweenTwoDate.map(
      (menu) => {
        const ordersForPastMenuBetweenTwoDate = menu.orders
          ? JSON.parse(menu.orders)
          : [];

        return {
          menu_id: menu.menu_id,
          date: menu.date,
          meal_type: menu.meal_type,
          package_id: menu.package_id,
          package_name: menu.package_name,
          ordersForPastMenuBetweenTwoDate: ordersForPastMenuBetweenTwoDate,
        };
      }
    );

    const totalCountQuery = `
    SELECT COUNT(*) AS total_menus
    FROM menus
    WHERE menus.deletedAt IS NULL AND menus.date < CURDATE() AND DATE(menus.date) BETWEEN DATE(:from) AND DATE(:to);
    `;
    const totalCountResult = await sequelize.query(totalCountQuery, {
      replacements: { from, to },
      type: Sequelize.QueryTypes.SELECT,
    });
    const totalMenus = totalCountResult[0].total_menus;

    res.status(200).json({
      code: 200,
      pastDataBetweenTwoDate: formattedPastMenuDataBetweenTwoDate,
      total_menus: totalMenus,
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

module.exports = {
  getAllPastMenus,
  getAllOrdersOfAPastMenu,
  getAllPastMenusBetweenTwoDate,
};
