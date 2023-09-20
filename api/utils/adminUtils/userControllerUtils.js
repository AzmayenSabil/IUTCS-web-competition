// We are not using this now. Doing the updation from model

const moment = require("moment");

async function updateCreatedAt(user) {
  try {
    await user.update({ createdAt: moment().format("YYYY-MM-DD HH:mm:ss") });
    return true;
  } catch (error) {
    console.error("Error updating createdAt:", error);
    return false;
  }
}

module.exports = {
  updateCreatedAt,
};
