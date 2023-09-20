const express = require("express");
const router = express.Router();
const pastMenuController = require("../../../controller/admin/pastMenu/pastMenuController");
const { validateToken } = require("../../../middleware/token/adminJWT");

// Route to get all menus
router.get("/", validateToken, pastMenuController.getAllPastMenus);

// Route to get all orders between two dates
router.get(
  "/past-menu-between-two-date",
  validateToken,
  pastMenuController.getAllPastMenusBetweenTwoDate
);

// Route to get all orders of a menu
router.get(
  "/:menu_id",
  validateToken,
  pastMenuController.getAllOrdersOfAPastMenu
);

module.exports = router;
