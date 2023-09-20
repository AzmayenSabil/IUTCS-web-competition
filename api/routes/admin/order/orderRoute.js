const express = require("express");
const router = express.Router();
const orderController = require("../../../controller/admin/order/orderController");
const { validateToken } = require("../../../middleware/token/adminJWT");

// Route to get all orders
router.get("/allOrders", validateToken, orderController.getAllOrders);
router.get(
  "/history/:user_id",
  validateToken,
  orderController.getOrderHistoryOfAUser
);
router.delete(
  "/:user_id/menus/:menu_id",
  validateToken,
  orderController.deleteOrderOfAMenu
);

module.exports = router;
