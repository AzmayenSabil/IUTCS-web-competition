var generator = require("generate-password");

var newPassword = generator.generate({
  length: 6,
  numbers: true,
  lowercase: true,
  uppercase: true,
  strict: true, //  strict requirements
  minNumbers: 1, //  at least one number
});

module.exports = newPassword;
