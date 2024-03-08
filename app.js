const express = require('express');
const mongoose = require("mongoose");
const sha256 = require("js-sha256");
require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on("error", () => {
  console.error("Connection to database Failed!");
  app.get("/", (req, res) => {
    res.statusCode = 500;
    res.send("Connection to database Failed!");
  });
});

db.once("open", () => {
  console.log("Connection to database Successful!");
});

db.on("close", () => {
  console.log("Connection to database Closed!");
  app.get("/", (req, res) => {
    res.statusCode = 500;
    res.send("Connection to database Closed!");
  });
});

const User = mongoose.model("User", new mongoose.Schema({
  username: String,
  password: String,
  level: Number,
  classes: [String],
}));

app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/next", (req, res) => {
  res.send("Login Successful!");
});

app.post("/", (req, res) => {
  if (req.body.action === "log_in") {
    console.log("Log In");
    res.redirect("/next");
  } else if (req.body.action === "sign_up") {
    const user = new User({
      username: `${req.body.user}`,
      password: `${sha256(req.body.pass)}`,
      level: 0,
      classes: [],
    })
    user.save();
    res.redirect("/next");
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(listener.address().port);
});