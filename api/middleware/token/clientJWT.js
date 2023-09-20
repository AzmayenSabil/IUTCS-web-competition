const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();

const createTokens = (user) => {
  const { name, user_id } = user;
  // console.log("ged" + name);
  // console.log("ged" + user_id);
  const accessToken = sign(
    { username: name, id: user_id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  // req.session.token = accessToken;

  return accessToken;
};

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header

  if (!accessToken)
    return res.status(400).json({ error: "User not Authenticated!" });

  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET);
    if (validToken) {
      req.authenticated = true;
      req.username = validToken.username; // Add username to the request object
      req.user_id = validToken.id; // Add user_id to the request object

      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { validateToken };

module.exports = { createTokens, validateToken };
