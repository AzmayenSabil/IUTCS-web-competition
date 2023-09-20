const { sequelize } = require("../../../db");
const Sequelize = require("sequelize");
const nodemailer = require("nodemailer");
const pdfMake = require("pdfmake/build/pdfmake");
const vfsFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = vfsFonts.pdfMake.vfs;

const sendOrderViaEmailForBreakfast = async () => {
  const currDate = new Date();

  try {
    const orderDataQueryForCurrentDate = `
        SELECT
          users.employee_id as employee_id,
          users.name as employee_name,
          menus.meal_type as mealType,
          DATE_FORMAT(DATE(menus.date), '%Y-%m-%d') as date,
          packages.name as packageName
        FROM
          users
        INNER JOIN
          orders ON users.user_id = orders.user_id
        INNER JOIN
          menus ON orders.menu_id = menus.menu_id
        INNER JOIN
          packages ON packages.package_id = menus.package_id
        WHERE
          DATE(menus.date) = CURDATE(); 
      `;

    const orderDataListForCurrentDate = await sequelize.query(
      orderDataQueryForCurrentDate,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const breakfastOrders = orderDataListForCurrentDate.filter(
      (order) => order.mealType === "Breakfast"
    );

    const breakfastPdf = await generatePdf(breakfastOrders, "Breakfast");

    let testAccount = await nodemailer.createTestAccount();

    // connect with the SMTP
    let transporter = await nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    // Fetch all email addresses from the admin table
    const adminEmailQuery = `
        SELECT email
        FROM admins where admins.emailNotification = "yes";
      `;

    const adminEmails = await sequelize.query(adminEmailQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    for (const admin of adminEmails) {
      // Attach the PDFs to the email
      let info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: admin.email,
        subject: `Order List for ${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()}`,
        attachments: [
          {
            filename: `breakfast_orders_${currDate.getDate()}.pdf`,
            content: breakfastPdf,
            contentType: "application/pdf",
          },
        ],
      });

      //   console.log(`Email sent to ${admin.email}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const sendOrderViaEmailForLunch = async () => {
  const currDate = new Date();

  try {
    const orderDataQueryForCurrentDate = `
      SELECT
        users.employee_id as employee_id,
        users.name as employee_name,
        menus.meal_type as mealType,
        DATE_FORMAT(DATE(menus.date), '%Y-%m-%d') as date,
        packages.name as packageName
      FROM
        users
      INNER JOIN
        orders ON users.user_id = orders.user_id
      INNER JOIN
        menus ON orders.menu_id = menus.menu_id
      INNER JOIN
        packages ON packages.package_id = menus.package_id
      WHERE
        DATE(menus.date) = CURDATE(); 
    `;

    const orderDataListForCurrentDate = await sequelize.query(
      orderDataQueryForCurrentDate,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const lunchOrders = orderDataListForCurrentDate.filter(
      (order) => order.mealType === "Lunch"
    );

    const lunchPdf = await generatePdf(lunchOrders, "Lunch");

    let testAccount = await nodemailer.createTestAccount();

    // connect with the SMTP
    let transporter = await nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    // Fetch all email addresses from the admin table
    const adminEmailQuery = `
      SELECT email
      FROM admins where admins.emailNotification = "yes";
    `;

    const adminEmails = await sequelize.query(adminEmailQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    for (const admin of adminEmails) {
      // Attach the PDFs to the email
      let info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: admin.email,
        subject: `Order List for ${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()}`,
        attachments: [
          {
            filename: `lunch_orders_${currDate.getDate()}.pdf`,
            content: lunchPdf,
            contentType: "application/pdf",
          },
        ],
      });

      //   console.log(`Email sent to ${admin.email}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const generatePdf = async (orderData, mealType) => {
  return new Promise((resolve, reject) => {
    const docDefinition = {
      content: [
        {
          text: `${mealType} Orders\n\nDate: ${orderData && orderData[0].date}
          \n\nPackage Name: ${
            orderData && orderData[0].packageName
          }\n\nOrder Count: ${orderData.length}\n\n\n\n`,
          style: "header",
        },
        {
          table: {
            headerRows: 1,
            widths: [20, 100, 100, 80, 100],
            body: [
              ["SL", "Employee ID", "Employee Name", "Date", "Package"],
              ...orderData.map((order, index) => [
                index + 1,
                order.employee_id,
                order.employee_name,
                order.date,
                order.packageName,
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    const pdfBuffer = pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
      resolve(buffer);
    });
  });
};

// BREAKFAST --------

// Schedule the function to run every day at 12 PM (local server time)
const scheduleTimeForBreakfast = new Date();
scheduleTimeForBreakfast.setHours(11, 16, 0, 0); // Set time to 12 PM

// Calculate the time until the first run
const currentTimeForBreakfast = new Date();
let timeUntilNextRunForBreakfast =
  scheduleTimeForBreakfast - currentTimeForBreakfast;
if (timeUntilNextRunForBreakfast < 0) {
  // If the time has already passed for today, schedule for tomorrow
  timeUntilNextRunForBreakfast += 24 * 60 * 60 * 1000; // 24 hours in milliseconds
}

// Set up the interval to trigger the function every day
const intervalForBreakfast = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
setTimeout(() => {
  sendOrderViaEmailForBreakfast(); // Trigger immediately
  setInterval(sendOrderViaEmailForBreakfast, intervalForBreakfast); // Then trigger every 24 hours
}, timeUntilNextRunForBreakfast);

// LUCNH  -------

// Schedule the function to run every day at 12 PM (local server time)
const scheduleTimeForLunch = new Date();
scheduleTimeForLunch.setHours(11, 16, 0, 0); // Set time to 12 PM

// Calculate the time until the first run
const currentTimeForLunch = new Date();
let timeUntilNextRunForLunch = scheduleTimeForLunch - currentTimeForLunch;
if (timeUntilNextRunForLunch < 0) {
  // If the time has already passed for today, schedule for tomorrow
  timeUntilNextRunForLunch += 24 * 60 * 60 * 1000; // 24 hours in milliseconds
}

// Set up the interval to trigger the function every day
const intervalForLunch = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
setTimeout(() => {
  sendOrderViaEmailForLunch(); // Trigger immediately
  setInterval(sendOrderViaEmailForLunch, intervalForLunch); // Then trigger every 24 hours
}, timeUntilNextRunForLunch);

module.exports = {
  sendOrderViaEmailForBreakfast,
  sendOrderViaEmailForLunch,
};
