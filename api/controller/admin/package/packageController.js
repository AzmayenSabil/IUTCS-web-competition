const Package = require("../../../models/packages");
const { getToken } = require("../../../middleware/token/adminJWT");
const { sequelize } = require("../../../db");
const moment = require("moment");

const addPackage = async (req, res) => {
  try {
    const { name, price, vendor, active } = req.body;
    const accessToken = getToken(req, res);

    const existingVendorWithSamePackage = await Package.findOne({
      where: { vendor: vendor, name: name, deletedAt: null },
    });
    if (existingVendorWithSamePackage) {
      return res.status(400).json({
        code: 400,
        error: "Existing package with the same vendor already exists",
      });
    }

    const data = await Package.create({
      name: name,
      price: price,
      vendor: vendor,
      active: active,
    });

    res.header("access-token", accessToken).status(200).json({
      code: 200,
      data: data,
      message: "New package added successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error: error.message });
  }
};

const verifyDeletion = async (req, res) => {
  try {
    const { packageId } = req.params;

    // Use a single SQL query to check for associated menus and their orders
    const sqlQuery = `
      SELECT 
        COUNT(m.menu_id) AS menu_count,
        SUM(CASE WHEN o.menu_id IS NOT NULL THEN 1 ELSE 0 END) AS menus_with_orders
      FROM menus m
      LEFT JOIN orders o ON m.menu_id = o.menu_id
      WHERE m.package_id = :packageId;
    `;

    const [result] = await sequelize.query(sqlQuery, {
      replacements: { packageId: packageId },
      type: sequelize.QueryTypes.SELECT,
    });

    // If there are no associated menus or all associated menus have no orders, return false (deletion is allowed)
    const canDelete = result.menu_count === 0 || result.menus_with_orders === 0;
    return res.json({ result: !canDelete });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const deletePackage = async (req, res) => {
//   try {
//     const { packageId } = req.params;
//     const accessToken = getToken(req, res);

//     const packageToDelete = await Package.findByPk(packageId);
//     if (!packageToDelete) {
//       return res
//         .status(404)
//         .json({ code: 404, error: "Sorry, Package not found" });
//     }

//     const data = await packageToDelete.destroy();

//     res.header("access-token", accessToken).status(200).json({
//       code: 200,
//       data: data,
//       message: "Package deleted successfully!",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ code: 400, error: error.message });
//   }
// };

const deletePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const accessToken = getToken(req, res);

    const packageToDelete = await Package.findByPk(packageId);
    if (!packageToDelete) {
      return res
        .status(404)
        .json({ code: 404, error: "Sorry, Package not found" });
    }

    // Manually update the deletedAt column to the current timestamp
    packageToDelete.deletedAt = moment().format("YYYY-MM-DD HH:mm:ss");
    await packageToDelete.save();

    res.header("access-token", accessToken).status(200).json({
      code: 200,
      message: "Package deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error: error.message });
  }
};

const updatePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { name, vendor, price, active } = req.body;

    const packageToUpdate = await Package.findByPk(packageId);
    if (!packageToUpdate) {
      return res
        .status(404)
        .json({ code: 404, error: "Sorry, Package not found" });
    }

    if (name) {
      packageToUpdate.name = name;
    }
    if (vendor) {
      packageToUpdate.vendor = vendor;
    }
    if (active) {
      packageToUpdate.active = active;
    }
    if (price) {
      packageToUpdate.price = price;
    }

    packageToUpdate.updatedAt = new Date();
    await packageToUpdate.save();

    res.status(200).json({
      code: 200,
      data: packageToUpdate,
      message: "Package updated successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error: error.message });
  }
};

const getAllPackage = async (req, res) => {
  try {
    const packages = await Package.findAll({
      where: {
        deletedAt: null, // Fetch only records where deletedAt is null
      },
    });
    const accessToken = getToken(req, res);
    res
      .header("access-token", accessToken)
      .status(200)
      .json({ code: 200, data: packages });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error: error.message });
  }
};

module.exports = {
  addPackage,
  verifyDeletion,
  deletePackage,
  updatePackage,
  getAllPackage,
};
