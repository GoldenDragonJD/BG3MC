const express = require('express');
const mongo = require("mongoose");

const app = express();

app.use("/public/css", express.static(__dirname + "/public/css"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 12345, () => {
  console.log(listener.address().port);
});