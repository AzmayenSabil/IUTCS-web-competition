const express = require("express");
const router = express.Router();
const menuController = require("../../../controller/admin/menu/menuController");
const { validateToken } = require("../../../middleware/token/adminJWT");

// Route to get all menus
router.get("/", validateToken, menuController.getAllMenus);

router.get(
  "/menu-between-date",
  validateToken,
  menuController.getAllMenusBetweenTwoDate
);

// Route to overwrite duplicates
router.post("/overwrite", validateToken, menuController.overwriteMenu);

// Route to create a new menu
router.post("/", validateToken, menuController.createMenu);

// Route to update a menu
router.put("/:menu_id", validateToken, menuController.updateMenu);

// Route to delete a menu
router.delete("/:menu_id", validateToken, menuController.deleteMenu);

// Route to get all orders of a menu
router.get("/:menu_id", validateToken, menuController.getAllOrdersOfAMenu);

module.exports = router;
