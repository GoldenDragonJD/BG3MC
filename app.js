const express = require('express');
const mongo = require("mongoose");
const sha256 = require("js-sha256");

const app = express();

app.use("/public/css", express.static(__dirname + "/public/css"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/spin", (req, res) => {
  res.json({
    username: req.body.input_user,
    password: sha256(req.body.input_pass),
  });
});

const listener = app.listen(process.env.PORT || 12345, () => {
  console.log(listener.address().port);
});