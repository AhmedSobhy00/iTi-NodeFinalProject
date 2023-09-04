const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const util = require("util");

const AsyncAsign = util.promisify(jwt.sign);
const secrtkey = "hahaha";
let userSchema = mongoose.Schema({
  email: String,
  firstNamed: String,
  lastNamed: String,
  password: String,
  phoneNumber: Number,
  address: String,
  cart: Array,
  isAdmin: String,
  confirmation: String,
});
userSchema.methods.generateToken = function () {
  let token = AsyncAsign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    secrtkey
  );

  return token;
};
let User = mongoose.model("users", userSchema);

module.exports = User;
