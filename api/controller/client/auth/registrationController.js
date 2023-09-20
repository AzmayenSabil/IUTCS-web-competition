const User = require("../../../models/users");
const bcrypt = require("bcrypt");
var CryptoJS = require("crypto-js");

const { Op } = require("sequelize");
const createUser = async (req, res) => {
  const my_secret_key = process.env.MY_SECRET_KEY;

  try {
    const { name, employee_id, email, gender, active, password } = req.body;

    var bytes = CryptoJS.AES.decrypt(password, my_secret_key);
    var decryptedPassword = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // Check if a user with the same email or employee ID already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { employee_id: employee_id }],
      },
    });

    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(decryptedPassword, 10);

      const newUser = await User.create({
        name: name,
        employee_id: employee_id,
        email: email,
        active: active,

        gender: gender,
        password: hashedPassword,
      });

      res.json({
        code: 200,
        data: {
          id: newUser.id,
          name: newUser.name,
          employee_id: newUser.employee_id,
          email: newUser.email,
          gender: newUser.gender,
        },
        message: "User registered successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createUser };
