const jwt = require("jsonwebtoken");
require("dotenv").config();

const createTokens = (email, password) => {
  // Generate tokens based on the provided email and password
  const accessToken = jwt.sign({ email, password }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken || !accessToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Access token is missing or invalid" });
  }

  const token = accessToken.slice(7); // Remove the "Bearer " prefix from the token

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken; // Store the decoded token in the request object for future use
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

const getToken = (req, res) => {
  const accessToken = req.headers.authorization;

  if (accessToken && accessToken.startsWith("Bearer ")) {
    const token = accessToken.slice(7);
    return token; // Return the token
  } else {
    throw new Error("Token not found"); // Throw an error if the token is not found
  }
};

module.exports = { createTokens, validateToken, getToken };
