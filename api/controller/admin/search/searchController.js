const Sequelize = require("sequelize");
const { Op } = Sequelize;

const Menu = require("../../../models/menus");
const Package = require("../../../models/packages"); // Import the packages model
const {
  validateToken,
  getToken,
} = require("../../../middleware/token/adminJWT");
const { sequelize, Model } = require("../../../db");

const getSearchedMenu = async (req, res) => {
  let { searchQuery, page, pageSize } = req.query;
  // console.log(req.query);
  const totalCountQuery = `
    SELECT COUNT(*) AS total_menus
    FROM menus
    INNER JOIN packages ON packages.package_id = menus.package_id
    WHERE
      (DATE_FORMAT(menus.date, '%Y-%m-%d') LIKE :searchQuery OR
      menus.meal_type LIKE :searchQuery
      OR LOWER(packages.name) LIKE LOWER(:searchQuery)
      ) AND menus.deletedAt IS NULL AND menus.date >= CURDATE();
  `;

  const totalCountResult = await sequelize.query(totalCountQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: { searchQuery: `%${searchQuery}%` },
  });

  const totalMenus = totalCountResult[0].total_menus;
  const calculatedTotalPage = Math.ceil(totalMenus / pageSize);
  if (calculatedTotalPage < page) {
    page = calculatedTotalPage;
  }
  const offset = (parseInt(page) - 1) * parseInt(pageSize);

  try {
    // const accessToken = getToken(req, res);

    // Natural join between packages and menus based on package_id in the totalCountQuery

    const totalMenus = totalCountResult[0].total_menus;

    if (totalMenus > 0) {
      const menuListQuery = `
        SELECT
        menus.menu_id AS menu_id,
        DATE_FORMAT(menus.date, '%Y-%m-%d') AS date,
        menus.meal_type AS meal_type,
        packages.package_id AS package_id,
        packages.name AS package_name
        FROM
        menus
        LEFT JOIN packages ON packages.package_id = menus.package_id
        WHERE
        (DATE_FORMAT(menus.date, '%Y-%m-%d') LIKE :searchQuery OR
        menus.meal_type LIKE :searchQuery
        OR LOWER(packages.name) LIKE LOWER(:searchQuery)
        ) AND menus.deletedAt IS NULL AND menus.date >= CURDATE()
        ORDER BY menus.date ASC
        LIMIT :pageSize OFFSET :offset;
      `;

      const menus = await sequelize.query(menuListQuery, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          searchQuery: `%${searchQuery.toLowerCase()}%`,
          pageSize: parseInt(pageSize),
          offset,
        },
      });

      if (menus.length > 0) {
        const menuIds = menus.map((menu) => menu.menu_id);
        const ordersQuery = `
          SELECT
          orders.menu_id AS menu_id,
          users.name AS username,
          users.user_id,
          users.employee_id
          FROM
          orders
          INNER JOIN users ON users.user_id = orders.user_id
          WHERE
          orders.menu_id IN (:menuIds);
        `;

        const orderResults = await sequelize.query(ordersQuery, {
          replacements: { menuIds },
          type: Sequelize.QueryTypes.SELECT,
        });

        const menuData = menus.map((menu) => {
          const ordersForMenu = orderResults
            .filter((order) => order.menu_id === menu.menu_id)
            .map((order) => {
              return {
                employee_id: order.employee_id,
                user_id: order.user_id,
                username: order.username,
              };
            });

          return {
            menu_id: menu.menu_id,
            date: menu.date,
            meal_type: menu.meal_type,
            package_id: menu.package_id,
            package_name: menu.package_name,
            orders: ordersForMenu,
          };
        });

        res.status(200).json({
          code: 200,
          data: menuData,
          total_menus: totalMenus,
        });
      }
    } else {
      res.status(403).json({
        code: 403,
        message: "No data",
      });
    }
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

const getPastSearchedMenu = async (req, res) => {
  const { searchQuery, page, pageSize } = req.query;
  // console.log(req.query);

  // Natural join between packages and menus based on package_id in the totalCountQuery
  const totalCountQuery = `
    SELECT COUNT(*) AS total_menus
    FROM menus
    INNER JOIN packages ON packages.package_id = menus.package_id
    WHERE
      (DATE_FORMAT(menus.date, '%Y-%m-%d') LIKE :searchQuery OR
      menus.meal_type LIKE :searchQuery
      OR LOWER(packages.name) LIKE LOWER(:searchQuery) )
      AND menus.date < CURDATE();
  `;

  const totalCountResult = await sequelize.query(totalCountQuery, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: { searchQuery: `%${searchQuery}%` },
  });

  const totalMenus = totalCountResult[0].total_menus;
  const calculatedTotalPage = Math.ceil(totalMenus / pageSize);
  if (calculatedTotalPage < page) {
    page = calculatedTotalPage;
  }

  const offset = (parseInt(page) - 1) * parseInt(pageSize);

  try {
    // const accessToken = getToken(req, res);

    const menuListQuery = `
      SELECT
        menus.menu_id AS menu_id,
        DATE_FORMAT(menus.date, '%Y-%m-%d') AS date,
        menus.meal_type AS meal_type,
        packages.package_id AS package_id,
        packages.name AS package_name
      FROM
        menus
      LEFT JOIN packages ON packages.package_id = menus.package_id
      WHERE
        (DATE_FORMAT(menus.date, '%Y-%m-%d') LIKE :searchQuery OR
        menus.meal_type LIKE :searchQuery
        OR LOWER(packages.name) LIKE LOWER(:searchQuery)
        ) 
        AND menus.deletedAt IS NULL AND menus.date < CURDATE()
      ORDER BY menus.date DESC
      LIMIT :pageSize OFFSET :offset;
    `;

    const menus = await sequelize.query(menuListQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        searchQuery: `%${searchQuery.toLowerCase()}%`,
        pageSize: parseInt(pageSize),
        offset,
      },
    });

    if (menus.length > 0) {
      const menuIds = menus.map((menu) => menu.menu_id);
      const ordersQuery = `
      SELECT
        orders.menu_id AS menu_id,
        users.name AS username,
        users.user_id,
        users.employee_id
      FROM
        orders
      INNER JOIN users ON users.user_id = orders.user_id
      WHERE
        orders.menu_id IN (:menuIds);
    `;

      const orderResults = await sequelize.query(ordersQuery, {
        replacements: { menuIds },
        type: Sequelize.QueryTypes.SELECT,
      });

      const menuData = menus.map((menu) => {
        const ordersForMenu = orderResults
          .filter((order) => order.menu_id === menu.menu_id)
          .map((order) => {
            return {
              employee_id: order.employee_id,
              user_id: order.user_id,
              username: order.username,
            };
          });

        return {
          menu_id: menu.menu_id,
          date: menu.date,
          meal_type: menu.meal_type,
          package_id: menu.package_id,
          package_name: menu.package_name,
          orders: ordersForMenu,
        };
      });

      res.status(200).json({
        code: 200,
        data: menuData,
        total_menus: totalMenus,
      });
    } else {
      res.status(403).json({
        code: 403,
        message: "No data",
      });
    }
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

module.exports = {
  getSearchedMenu,
  getPastSearchedMenu,
};
