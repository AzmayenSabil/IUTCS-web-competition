const express = require("express");
const user = express();
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const router = express.Router();
const { validateToken } = require("../../../middleware/token/adminJWT");

user.use(bodyParser.urlencoded({ extended: true }));
user.use(express.static(path.resolve(__dirname, "routes")));

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./routes");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

const holidayController = require("../../../controller/admin/holiday/holidayController");

router.post("/import", validateToken, upload.single("file"), holidayController.importHoliday);

router.post("/addholiday", validateToken, holidayController.addHolliday);

router.put("/editholiday", validateToken, holidayController.editHoliday);

router.delete("/deleteHoliday/:holidayID", validateToken, holidayController.deleteHoliday);

router.get("/getAllHolidays", validateToken, holidayController.getAllHolidays);

router.get("/getAllHolidaysBetweenTwoDates",  validateToken, holidayController.getAllHolidaysBetweenTwoDates);




module.exports = router;
