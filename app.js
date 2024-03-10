const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const sha256 = require("js-sha256");
const { Batch } = require("mongodb");
require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URI);

const token = sha256("token66").toString();

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

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
    character: [Object],
  })
);

app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/next", async (req, res) => {
  User.find({ username: req.query.username }).then(async (user) => {
    if (await bcrypt.compare(token, req.query.token)) {
      res.json(user);
    } else res.redirect("/");
  });
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }).then(async (user) => {
    if (user) return res.json({ message: "Username is taken!" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      password: hashedPassword,
      character: [],
    });
    const hashedToken = await bcrypt.hash(token, 10);

    newUser.save();
    res.json({ message: "Success", token: hashedToken });
  });
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }).then(async (user) => {
    if (!user) return res.json({ message: "Username does not exist!" });
    if (await bcrypt.compare(password, user.password)) {
      const hashedToken = await bcrypt.hash(token, 10);
      res.json({ message: "Success", token: hashedToken });
    } else res.json({ message: "Incorrect password try again!" });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(listener.address().port);
});
