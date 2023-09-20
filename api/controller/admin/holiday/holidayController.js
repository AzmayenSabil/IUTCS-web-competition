const { sequelize } = require("../../../db");
const csv = require("csvtojson");
const Holidays = require("../../../models/holidays");
const Sequelize = require("sequelize");




//import from csv/excel

const importHoliday = async (req, res) => {
  try {
    const holidayData = [];

    const response = await csv().fromFile(req.file.path);

    // console.log("Inside csv reader: ");
    for (let x = 0; x < response.length; x++) {
      // console.log(response[x]);
      holidayData.push({
        holiday_id: response[x].holiday_id,
        date: response[x].date,
        holiday_name: response[x].holiday_name,
        createdAt: response[x].createdAt,
        updatedAt: response[x].updatedAt,
      });
    }

    // console.log("------", holidayData);

    for (let i = 0; i < holidayData.length; i++) {
      const existingRecord = await Holidays.findOne({
        where: {
          date: holidayData[i].date,
        },
      });

      if (existingRecord) {
        const newHolidayNames = holidayData[i].holiday_name.split("| ");
        const existingHolidayNames = existingRecord.holiday_name.split("| ");

        const uniqueHolidayNames = [
          ...new Set(existingHolidayNames.concat(newHolidayNames)),
        ];

        if (uniqueHolidayNames.join("| ") !== existingRecord.holiday_name) {
          existingRecord.holiday_name = uniqueHolidayNames.join("| ");
          await existingRecord.save();
          // console.log(
          //   `Updated record with the same date: ${existingRecord.holiday_name} on ${holidayData[i].date}`
          // );
        } else {
          // console.log(
          //   `Record already exists with the same date and holiday_names: ${existingRecord.holiday_name} on ${holidayData[i].date}`
          // );
        }
      } else {
        const newRecord = await Holidays.create({
          date: holidayData[i].date,
          holiday_name: holidayData[i].holiday_name,
        });
        // console.log(
        //   `Created new record: ${newRecord.holiday_name} on ${newRecord.date}`
        // );
      }
    }
    const holidayDataQuery = `
  SELECT
   holiday_id,
 date,
 holiday_name
FROM holidays
 ORDER BY date ASC;
  `;

    const newHolidayData = await sequelize.query(holidayDataQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const formattedHolidayData = newHolidayData.map((holiday) => {
      return {
        holiday_id: holiday.holiday_id,
        date: holiday.date,
        holiday_name: holiday.holiday_name,
      };
    });

    res.send({
      status: 200,
      success: true,
      msg: "uploaded",
      data: formattedHolidayData


    });
  } catch (error) {
    // console.error(error);
    res
      .status(500)
      .send({ status: 500, success: false, msg: "Error occurred" });
  }
};


//add holiday

const addHolliday = async (req, res) => {
  try {
    const holidayData = req.body;

    if (!holidayData || !holidayData.date || !holidayData.holiday_name) {
      return res.status(400).json({ success: false, msg: "Invalid holiday data" });
    }

    const { date, holiday_name } = holidayData;

    const existingRecord = await Holidays.findOne({
      where: {
        date: date,
      },
    });

    if (existingRecord) {
      const newHolidayNames = holiday_name.split(" | ");
      const existingHolidayNames = existingRecord.holiday_name.split(" | ");

      const uniqueHolidayNames = [
        ...new Set(existingHolidayNames.concat(newHolidayNames)),
      ];

      if (uniqueHolidayNames.join(" | ") !== existingRecord.holiday_name) {
        existingRecord.holiday_name = uniqueHolidayNames.join(" | ");
        await existingRecord.save();
        // console.log(
        //   `Updated record with the same date: ${existingRecord.holiday_name} on ${date}`
        // );
      } else {
        // console.log(
        //   `Record already exists with the same date and holiday_names: ${existingRecord.holiday_name} on ${date}`
        // );
      }
    } else {
      const newRecord = await Holidays.create({
        date: date,
        holiday_name: holiday_name,
      });
      // console.log(
      //   `Created new record: ${newRecord.holiday_name} on ${newRecord.date}`
      // );
    }
    const holidayDataQuery = `
    SELECT
     holiday_id,
   date,
   holiday_name
  FROM holidays
   ORDER BY date ASC;
    `;

    const newHolidayData = await sequelize.query(holidayDataQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const formattedHolidayData = newHolidayData.map((holiday) => {
      return {
        holiday_id: holiday.holiday_id,
        date: holiday.date,
        holiday_name: holiday.holiday_name,
      };
    });

    res.status(200).json({
      success: true,
      msg: "Holiday added successfully",
      data: formattedHolidayData
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, msg: "Error occurred" });
  }
};



//edit holiday------------

const editHoliday = async (req, res) => {
  try {
    const holidayDataArray = req.body;
    //console.log(holidayDataArray)
    const { name, holidayID } = holidayDataArray;
    //console.log(holidayID, name)


    const existingRecord = await Holidays.findOne({
      where: {
        holiday_id: holidayID,
      },
    });
    let data;
    //console.log(existingRecord)
    if (existingRecord) {
      existingRecord.holiday_name = name;
      data = await existingRecord.save();
      // console.log(
      //   `Updated record with the same date`
      // );
    } else {
      // console.log(`Holiday not found for date: ${holidayID}`);
    }
    // }

    res.status(200).json({
      success: true,
      msg: "Holidays updated successfully",
      data: data
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, msg: "Error occurred" });
  }
};

//delete Holiday

const deleteHoliday = async (req, res) => {
  try {
    const { holidayID } = req.params;
    // console.log(holidayID);

    const existingRecord = await Holidays.findOne({
      where: {
        holiday_id: holidayID,
      },
    });

    if (existingRecord) {
      await existingRecord.destroy();
      // console.log(`Deleted record with holidayID: ${holidayID}`);
      res.status(200).json({ success: true, msg: "Record deleted successfully" });
    } else {
      // console.log(`Holiday not found for holidayID: ${holidayID}`);
      res.status(404).json({ success: false, msg: "Holiday not found" });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, msg: "Error occurred" });
  }
};



//get All Holidays


const getAllHolidays = async (req, res) => {
  try {
    const holidayDataQuery = `
  SELECT
   holiday_id,
 date,
 holiday_name
FROM holidays
 ORDER BY date ASC;
  `;

    const holidayData = await sequelize.query(holidayDataQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const formattedHolidayData = holidayData.map((holiday) => {
      return {
        holiday_id: holiday.holiday_id,
        date: holiday.date,
        holiday_name: holiday.holiday_name,
      };
    });

    res.status(200).json({
      code: 200,
      data: formattedHolidayData,
    });
  } catch (error) {
    // console.error("Error fetching holidays:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

//get All Holidays Between Two Dates

const getAllHolidaysBetweenTwoDates = async (req, res) => {
  try {
    // console.log(req.query)
    const { from, to } = req.query;
    // console.log(from, to)

    const getHolidaysBetweenTwoDatesQuery = `
      SELECT
        holiday_id,
        date,
        holiday_name
      FROM holidays
      WHERE date BETWEEN :from AND :to
      ORDER BY date ASC;
    `;

    const holidaysBetweenTwoDates = await sequelize.query(getHolidaysBetweenTwoDatesQuery, {
      replacements: { from, to },
      type: Sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      code: 200,
      holidaysBetweenTwoDates,
    });
  } catch (error) {
    // console.error('Error fetching holidays between two dates:', error);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};






module.exports = {
  importHoliday,
  addHolliday,
  editHoliday,
  deleteHoliday,
  deleteHoliday,
  getAllHolidays,
  getAllHolidaysBetweenTwoDates,
};
