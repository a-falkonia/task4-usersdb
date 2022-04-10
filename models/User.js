const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: String,
  email: String,
  Regdate: String,
  Logdate: String,
  pass: String,
  blocked: Boolean,
});

module.exports = model("User", schema);