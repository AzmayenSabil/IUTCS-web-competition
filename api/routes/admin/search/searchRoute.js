const express = require("express");
const router = express.Router();
const searchController = require("../../../controller/admin/search/searchController");
const { validateToken } = require("../../../middleware/token/adminJWT");

// Route to get searched menus
router.get("/", validateToken, searchController.getSearchedMenu);

// Route to get past searched menus
router.get("/pastMenus", validateToken, searchController.getPastSearchedMenu);

module.exports = router;
