const mongoose = require("mongoose");
const user = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  firstName: String,
  lastName: String,
  streetName: String,
  secondaryAddress: String,
  number: String,
});

module.exports = mongoose.model("User", user);
