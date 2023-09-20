const moment = require("moment-timezone");

const Menus = require("../../../models/menus");
const Setting = require("../../../models/settings");
// moment.tz.setDefault("Asia/Dhaka");

const { getToken } = require("../../../middleware/token/adminJWT");
const Sequelize = require("sequelize");

const { sequelize, Model } = require("../../../db");

// Get all menus with pagination
const getAllMenus = async (req, res) => {
  let { page, pageSize, fromMonth, toMonth } = req.query; // Retrieve pagination parameters from req.query

  //console.log("Request query ", page, pageSize);
  // let { page, pageSize } = req.query;
  // console.log("Request query ", page, pageSize);
  const totalCountQuery = `
    SELECT COUNT(*) AS total_menus
    FROM menus
    WHERE deletedAt IS NULL AND menus.date >= CURDATE();
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
    const menuDataQuery = `
      SELECT
          menus.menu_id AS menu_id,
          DATE_FORMAT(menus.date, '%Y-%m-%d') AS date,
          menus.meal_type AS meal_type,
          packages.package_id AS package_id,
          packages.name AS package_name,
          COUNT(orders.menu_id) AS orders_count
      FROM menus
      INNER JOIN packages ON packages.package_id = menus.package_id
      LEFT JOIN orders ON menus.menu_id = orders.menu_id
      LEFT JOIN users ON users.user_id = orders.user_id
      WHERE menus.deletedAt IS NULL AND menus.date >= CURDATE() 
      GROUP BY menus.menu_id, menus.date, menus.meal_type, packages.package_id, packages.name
      ORDER BY menus.date ASC
      LIMIT :pageSize OFFSET :offset;
    `;

    const menuData = await sequelize.query(menuDataQuery, {
      replacements: { pageSize: parseInt(pageSize), offset },
      type: Sequelize.QueryTypes.SELECT,
    });

    // console.log("hello"+menuDataBetweenTwoMonths)

    const formattedMenuData = menuData.map((menu) => {
      return {
        menu_id: menu.menu_id,
        date: menu.date,
        meal_type: menu.meal_type,
        package_id: menu.package_id,
        package_name: menu.package_name,
        orders_count: menu.orders_count,
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

const getAllMenusBetweenTwoDate = async (req, res) => {
  const { page, pageSize, from, to } = req.query; // Retrieve pagination parameters from req.query
  const offset = (parseInt(page) - 1) * parseInt(pageSize);
  // console.log(from, to);

  try {
    const accessToken = getToken(req, res);

    const getMenusBetweenTwoDateQuery = `
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
      WHERE menus.deletedAt IS NULL AND menus.date >= CURDATE() AND DATE(menus.date) BETWEEN DATE(:from) AND DATE(:to) 
      GROUP BY menus.menu_id
      ORDER BY menus.date ASC
      LIMIT :pageSize OFFSET :offset;
    
    `;

    const menuDataBetweenTwoDate = await sequelize.query(
      getMenusBetweenTwoDateQuery,
      {
        replacements: { pageSize: parseInt(pageSize), offset, from, to },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const formattedMenuDataBetweenTwoDate = menuDataBetweenTwoDate.map(
      (menu) => {
        const ordersForMenuBetweenTwoDate = menu.orders
          ? JSON.parse(menu.orders)
          : [];

        return {
          menu_id: menu.menu_id,
          date: menu.date,
          meal_type: menu.meal_type,
          package_id: menu.package_id,
          package_name: menu.package_name,
          ordersForMenuBetweenTwoDate: ordersForMenuBetweenTwoDate,
        };
      }
    );
    // console.log(menuDataBetweenTwoDate)

    const totalCountQuery = `
      SELECT COUNT(*) AS total_menus
      FROM menus
      WHERE menus.deletedAt IS NULL AND menus.date >= CURDATE() AND DATE(menus.date) BETWEEN DATE(:from) AND DATE(:to)
    `;
    const totalCountResult = await sequelize.query(totalCountQuery, {
      replacements: { from, to },
      type: Sequelize.QueryTypes.SELECT,
    });
    const totalMenus = totalCountResult[0].total_menus;

    res.status(200).json({
      code: 200,
      dataBetweenTwoDate: formattedMenuDataBetweenTwoDate,
      total_menus: totalMenus,
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
  }
};

const getAllOrdersOfAMenu = async (req, res) => {
  try {
    const { menu_id } = req.params;

    const ordersQuery = `
      SELECT
        orders.user_id AS user_id,
        orders.menu_id AS menu_id,
        users.name AS username,
        users.employee_id AS employee_id,
        CONVERT_TZ(orders.createdAt, '+00:00', '+06:00') as createdAt
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
        menu_id: order.menu_id,
        username: order.username,
        employeeId: order.employee_id,
        // createdAt: moment(order.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

function formatDateString(dateString) {
  const dateParts = dateString.split("T")[0].split("-");
  const timeParts = dateString.split("T")[1].split(".")[0].split(":");

  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  const hours = timeParts[0];
  const minutes = timeParts[1];
  const seconds = timeParts[2];

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const overwriteMenu = async (req, res) => {
  try {
    const { duplicates } = req.body;
    // console.log(duplicates);

    if (!duplicates || !Array.isArray(duplicates) || duplicates.length === 0) {
      return res.status(400).json({
        code: 400,
        error: "Bad Request",
        message: "Invalid or empty 'duplicates' array provided.",
      });
    }

    // const menus = await Menus.findAll();
    // console.log(menus);

    // Create an empty array to store the updated menus
    const updatedMenus = [];
    // let rowsAffected = 0;
    // Iterate through the duplicate menus and update the old menus
    for (const duplicateMenu of duplicates) {
      const { date, meal_type, package_name, package_id } = duplicateMenu;
      // console.log(duplicateMenu);

      const formattedDate = formatDateString(date.toString());
      // console.log(formattedDate);

      // Perform the update in the database
      const menu = await Menus.findOne({
        where: {
          date: formattedDate,
          meal_type: meal_type,
          deletedAt: null,
        },
      });
      // console.log(menu);

      if (menu) {
        menu.package_id = package_id;
        await menu.save(); // Save the changes to the database
        updatedMenus.push(menu);
      } else {
        console.error(
          `Error updating menu for date: ${date}, meal_type: ${meal_type}`
        );
      }
    }

    return res.status(200).json({
      code: 200,
      menus: updatedMenus, // Return the updatedMenus array in the response
      message: "Menus overwritten successfully.",
    });

    // // Iterate through the duplicate menus and update the old menus
    // for (const duplicateMenu of duplicates) {
    //   const { date, meal_type, package_name, package_id } = duplicateMenu;

    //   // Perform the update in the database
    //   const res = await Menu.update(
    //     { package_id },
    //     {
    //       where: {
    //         date,
    //         meal_type,
    //       },
    //     }
    //   );
    //   console.log(res);
    // }

    // return res.status(200).json({
    //   code: 200,
    //   menus: duplicates,
    //   message: "Menus overwritten successfully.",
    // });
  } catch (error) {
    console.error("Error updating menus:", error);
    return res.status(500).json({
      code: 500,
      error: "Internal server error",
    });
  }
};

const createMenu = async (req, res) => {
  const { startDate, endDate, selectedWeekdays, package_id, meal_type } =
    req.body;

  try {
    // Add your authentication and authorization logic here if needed
    const accessToken = getToken(req, res);

    const start = moment(startDate);
    const end = moment(endDate);

    //console.log(start, end)

    const newMenus = [];
    const duplicatedMenus = [];
    const selectedWeekdaysSet = new Set(selectedWeekdays);

    const packageNameQuery = `SELECT name FROM packages WHERE package_id = :package_id;`;

    const packageName = await sequelize.query(packageNameQuery, {
      replacements: {
        package_id: package_id,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    const existingMenusQuery = `
      SELECT menu_id, DATE(date) AS date, meal_type, COUNT(*) AS meal_type_count 
      FROM menus WHERE meal_type = :meal_type AND deletedAt IS NULL 
      AND DATE(date) BETWEEN DATE(:startDate) AND DATE(:endDate)
      GROUP BY DATE(date), meal_type;
    `;

    const existingMenus = await sequelize.query(existingMenusQuery, {
      replacements: {
        meal_type: meal_type,
        startDate: start.format(),
        endDate: end.format(),
      },
      type: sequelize.QueryTypes.SELECT,
    });

    // console.log(existingMenus);

    if (existingMenus.length > 0) {
      // If there are duplicate menus, handle the logic to separate unique and duplicated ones
      const settings = await Setting.findAll(); // Query settings from the table

      while (start <= end) {
        const currentWeekday = start.format("ddd");
        if (selectedWeekdaysSet.has(currentWeekday)) {
          let formattedDateBreakfast = "";
          let formattedDateLunch = "";

          if (meal_type.includes("Breakfast")) {
            const breakfastSettings = settings.find(
              (setting) => setting.name === "Breakfast"
            );

            // Extracting hour and minute from the breakfast time
            const breakfastTime = breakfastSettings.value;
            const [timePart] = breakfastTime.split(" "); // Extract the "hh:mm" part

            // Remove any colon characters and extract the hours and minutes
            const [breakfastHour, breakfastMinute] = timePart
              .split(":")
              .map(Number);

            formattedDateBreakfast = start
              .clone()
              .set({ hour: breakfastHour, minute: breakfastMinute, second: 0 })
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

            // Check if a duplicate menu exists for breakfast
            const isDuplicateBreakfast = existingMenus.some(
              (menu) =>
                menu.meal_type === "Breakfast" &&
                moment(menu.date).isSame(start, "day")
            );

            if (isDuplicateBreakfast) {
              duplicatedMenus.push({
                date: formattedDateBreakfast,
                meal_type: "Breakfast",
                package_id: package_id,
                package_name: packageName[0].name,
              });
            } else {
              // Create a new breakfast menu if not a duplicate
              const breakfastMenu = await Menu.create({
                date: formattedDateBreakfast,
                package_id,
                meal_type: "Breakfast",
              });
              newMenus.push(breakfastMenu);
            }
          }

          if (meal_type.includes("Lunch")) {
            const lunchSettings = settings.find(
              (setting) => setting.name === "Lunch"
            );

            // Extracting hour and minute from the lunch time
            const lunchTime = lunchSettings.value;
            const [timePart] = lunchTime.split(" "); // Extract the "hh:mm" part

            // Remove any colon characters and extract the hours and minutes
            const [lunchHour, lunchMinute] = timePart.split(":").map(Number);

            formattedDateLunch = start
              .clone()
              .set({ hour: lunchHour, minute: lunchMinute, second: 0 })
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

            // Check if a duplicate menu exists for lunch
            const isDuplicateLunch = existingMenus.some(
              (menu) =>
                menu.meal_type === "Lunch" &&
                moment(menu.date).isSame(start, "day")
            );

            if (isDuplicateLunch) {
              duplicatedMenus.push({
                date: formattedDateLunch,
                meal_type: "Lunch",
                package_id: package_id,
                package_name: packageName[0].name,
              });
            } else {
              // Create a new lunch menu if not a duplicate
              const lunchMenu = await Menu.create({
                date: formattedDateLunch,
                package_id,
                meal_type: "Lunch",
              });
              newMenus.push(lunchMenu);
            }
          }
        }
        start.add(1, "day");
      }
      res.header("access-token", accessToken).json({
        code: 201, // Change the status code to 201 to indicate partial success (Created)
        data: { uniqueMenus: newMenus, duplicateMenus: duplicatedMenus },
        message: "Some menus created successfully, and some are duplicates",
      });
    } else {
      const settings = await Setting.findAll(); // Query settings from the table

      while (start <= end) {
        const currentWeekday = start.format("ddd");
        if (selectedWeekdaysSet.has(currentWeekday)) {
          let formattedDateBreakfast = "";
          let formattedDateLunch = "";

          if (meal_type.includes("Breakfast")) {
            const breakfastSettings = settings.find(
              (setting) => setting.name === "Breakfast"
            );

            // Extracting hour and minute from the breakfast time
            const breakfastTime = breakfastSettings.value;
            const [timePart] = breakfastTime.split(" "); // Extract the "hh:mm" part

            // Remove any colon characters and extract the hours and minutes
            const [breakfastHour, breakfastMinute] = timePart
              .split(":")
              .map(Number);

            formattedDateBreakfast = start
              .clone()
              .set({ hour: breakfastHour, minute: breakfastMinute, second: 0 })
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

            // Create a new breakfast menu
            const breakfastMenu = await Menu.create({
              date: formattedDateBreakfast,
              package_id,
              meal_type: "Breakfast",
            });
            newMenus.push(breakfastMenu);
          }

          if (meal_type.includes("Lunch")) {
            const lunchSettings = settings.find(
              (setting) => setting.name === "Lunch"
            );

            // Extracting hour and minute from the lunch time
            const lunchTime = lunchSettings.value;
            const [timePart] = lunchTime.split(" "); // Extract the "hh:mm" part

            // Remove any colon characters and extract the hours and minutes
            const [lunchHour, lunchMinute] = timePart.split(":").map(Number);

            formattedDateLunch = start
              .clone()
              .set({ hour: lunchHour, minute: lunchMinute, second: 0 })
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

            // Create a new lunch menu
            const lunchMenu = await Menu.create({
              date: formattedDateLunch,
              package_id,
              meal_type: "Lunch",
            });
            newMenus.push(lunchMenu);
          }
        }
        start.add(1, "day");
      }

      res.header("access-token", accessToken).json({
        code: 200,
        data: { menus: newMenus },
        message: "Menus created successfully",
      });
    }
  } catch (error) {
    console.error("Error creating menus:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

// Update a menu
const updateMenu = async (req, res) => {
  const menuId = req.params.menu_id;
  const { date, package_id, meal_type } = req.body;

  try {
    const accessToken = getToken(req, res);
    const menu = await Menu.findByPk(menuId);
    if (!menu) {
      return res.status(404).json({ code: 404, error: "Menu not found" });
    }

    if (date) {
      menu.date = date;
    }
    if (package_id) {
      menu.package_id = package_id;
    }
    if (meal_type) {
      menu.meal_type = meal_type;
    }

    await menu.save();

    res.header("access-token", accessToken).json({
      code: 200,
      data: { menu },
      message: "Menu updated successfully",
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

// Delete a menu
const deleteMenu = async (req, res) => {
  const menuId = req.params.menu_id;

  try {
    const accessToken = getToken(req, res);
    const menu = await Menu.findByPk(menuId);
    if (!menu) {
      return res.status(404).json({ code: 404, error: "Menu not found" });
    }

    // "Soft delete" the menu by updating the deleted_at column using moment
    menu.deletedAt = moment().format("YYYY-MM-DD HH:mm:ss"); // Set deleted_at to the current timestamp
    await menu.save();

    res.header("access-token", accessToken).json({
      code: 200,
      data: { menu },
      message: "Menu marked as deleted",
    });
  } catch (error) {
    console.error("Error marking menu as deleted:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

// // Delete a menu
// const deleteMenu = async (req, res) => {
//   const menuId = req.params.menu_id;

//   try {
//     const accessToken = getToken(req, res);
//     const menu = await Menu.findByPk(menuId);
//     if (!menu) {
//       return res.status(404).json({ code: 404, error: "Menu not found" });
//     }

//     await menu.destroy();

//     res.header("access-token", accessToken).json({
//       code: 200,
//       data: { menu },
//       message: "Menu deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting menu:", error);
//     res.status(500).json({ code: 500, error: "Internal server error" });
//   }
// };

module.exports = {
  getAllMenus,
  getAllMenusBetweenTwoDate,
  getAllOrdersOfAMenu,
  overwriteMenu,
  createMenu,
  updateMenu,
  deleteMenu,
};
