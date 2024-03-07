const express = require('express');
const mongo = require("mongoose");
const sha256 = require("js-sha256");
const exp = require("constants");

const app = express();

app.use("/public/css", express.static(__dirname + "/public/css"));
app.use("/public/Images", express.static(__dirname + "/public/Images"));
app.use("/public/Fonts", express.static(__dirname + "/public/Fonts"));
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
    console.log("Sign Up");
  }
  res.json({
    username: `${req.body.user}`,
    password: `${sha256(req.body.pass)}`,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(listener.address().port);
});