const config = require("config");
const mongoose = require("mongoose");

mongoose.connect(
  config.get("mongoUri"),
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    else console.log("mongo connected");
  }
);

let UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  regdate: String,
  logdate: String,
  pass: String,
  blocked: Boolean,
});

let User = mongoose.model("users", UserSchema);

module.exports = {
  User,
};
