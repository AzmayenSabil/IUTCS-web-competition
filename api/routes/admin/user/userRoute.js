const express = require("express");
const router = express.Router();
const userController = require("../../../controller/admin/user/userController");
const { validateToken } = require("../../../middleware/token/adminJWT");

router.post("/", validateToken, userController.createUser);
router.get("/", validateToken, userController.getAllUser);
router.post("/update/:user_id", validateToken, userController.updateUser);
router.post(
  "/updateStatus/:user_id",
  validateToken,
  userController.updateUserStatus
);
router.post(
  "/changePassword/:user_id",
  validateToken,
  userController.changePassword
);
// router.get("/info/:user_id", validateToken, userController.getUserInfo);
router.post(
  "/addPending/:user_id",
  validateToken,
  userController.addPendingUser
);
router.delete("/delete/:user_id", validateToken, userController.deleteUser);

module.exports = router;
