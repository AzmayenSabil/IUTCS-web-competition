const Order = require("../../../models/orders");

const { getToken } = require("../../../middleware/token/adminJWT");
const mysql = require("mysql2/promise");
const { dbConfig } = require("../../../config/db.config");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");

const cron = require("node-cron");
const nodemailer = require("nodemailer");
const pdfMake = require("pdfmake/build/pdfmake");
const vfsFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = vfsFonts.pdfMake.vfs;

const PDFDocument = require("pdfkit");

const getAllOrders = async (req, res) => {
  try {
    // Assuming you have a database or some other data source to fetch the orders from
    const orders = await Order.findAll(); // Replace `Order` with your actual model/schema name

    res.status(200).json({ code: 200, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrderHistoryOfAUser = async (req, res) => {
  const userId = req.params.user_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    const accessToken = getToken(req, res);
    const query = `
      SELECT orders.*, menus.menu_id, menus.date, menus.package_id, menus.meal_type, packages.name AS package_name
      FROM orders
      INNER JOIN menus ON orders.menu_id = menus.menu_id
      INNER JOIN packages ON menus.package_id = packages.package_id
      WHERE orders.user_id = :userId
      ORDER BY menus.date DESC
      LIMIT :limit OFFSET :offset
    `;

    const countQuery = `
      SELECT COUNT(*) AS total_orders
      FROM orders
      WHERE user_id = :userId
    `;

    const [orderData, totalCount] = await Promise.all([
      sequelize.query(query, {
        replacements: { userId, limit: parseInt(pageSize), offset },
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(countQuery, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totalOrders = totalCount[0].total_orders;

    res
      .header("access-token", accessToken)
      .json({ code: 200, data: orderData, total_orders: totalOrders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

const deleteOrderOfAMenu = async (req, res) => {
  const userId = req.params.user_id;
  const menuId = req.params.menu_id;

  try {
    const accessToken = getToken(req, res);
    // Find the order to be deleted
    const order = await Order.findOne({
      where: { user_id: userId, menu_id: menuId },
    });

    if (!order) {
      return res.status(404).json({ code: 404, error: "Order not found" });
    }

    // Delete the order
    await order.destroy();

    res.header("access-token", accessToken).json({
      code: 200,
      data: order,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

// const deleteOrderOfAMenu = async (req, res) => {
//   const userId = req.params.user_id;
//   const menuId = req.params.menu_id;

//   try {
//     const accessToken = getToken(req, res);
//     // Find the order to be "deleted"
//     const order = await Order.findOne({
//       where: { user_id: userId, menu_id: menuId },
//     });

//     if (!order) {
//       return res.status(404).json({ code: 404, error: "Order not found" });
//     }

//     // "Soft delete" the order by updating the deleted_at column using moment
//     order.deleted_at = moment().format("YYYY-MM-DD HH:mm:ss"); // Set deleted_at to the current timestamp
//     await order.save();

//     res.header("access-token", accessToken).json({
//       code: 200,
//       data: order,
//       message: "Order marked as deleted",
//     });
//   } catch (error) {
//     console.error("Error marking order as deleted:", error);
//     res.status(500).json({ code: 500, error: "Internal server error" });
//   }
// };

module.exports = {
  getAllOrders,
  getOrderHistoryOfAUser,
  deleteOrderOfAMenu,
};
