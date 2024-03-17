const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const sha256 = require("js-sha256");
const fs = require("fs");
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

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
    characters: {},
  })
);

app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/home", async (req, res) => {
  if (!req.query.token) req.query.token = "noPass";
  User.findOne({ username: req.query.username }).then((user) => {
    if (!user) return res.redirect("/");
    if (sha256(user.password).toString() === req.query.token) {
      res.sendFile(__dirname + "/views/home.html");
    } else res.redirect("/");
  });
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) return res.redirect("/");
  if (!password) return res.redirect("/");

  User.findOne({ username: username }).then(async (user) => {
    if (user) return res.json({ message: "Username is taken!" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      password: hashedPassword,
      characters: {},
    });
    const createToken = sha256(newUser.password).toString();

    newUser
      .save()
      .then((data) => {
        console.log("it worked!");
      })
      .catch((err) => console.log(err));
    res.json({ message: "Success", token: createToken });
  });
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }).then(async (user) => {
    if (!user) return res.json({ message: "Username does not exist!" });
    if (await bcrypt.compare(password, user.password)) {
      const createToken = sha256(user.password).toString();
      res.json({ message: "Success", token: createToken });
    } else res.json({ message: "Incorrect password try again!" });
  });
});

app.post("/grabAccountInfo", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) return res.redirect("/");
  if (!password) return res.redirect("/");

  User.findOne({ username: username }).then((user) => {
    if (!user) return res.redirect("/");
    if (password !== sha256(user.password)) return res.redirect("/");
    res.json(user);
  });
});

app.post("/addCharacter", async (req, res) => {
  const name = req.body.name;
  const race = req.body.race;
  const diff = req.body.diff;
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }).then((user) => {
    if (password !== sha256(user.password)) return res.redirect("/");
    fs.readFile(__dirname + "/private/list.json", "utf-8", (error, data) => {
      if (error) {
        console.log("am i getting sent here?");
        res.send("<script>window.location.reload()</script>");
        return;
      }
      const jsonData = JSON.parse(data);
      let raceCheck = false;
      let diffCheck = false;

      for (const raceName of jsonData.races) {
        if (raceName === race) raceCheck = true;
      }

      for (const diffName of jsonData.difficulties) {
        if (diffName === diff) diffCheck = true;
      }

      if (!raceCheck || !diffCheck) {
        res.redirect("/");
        return;
      }

      if (Object.keys(user.characters).includes(name)) {
        res.json({
          message:
            "Character Already Exists! This will be fixed but for now it s what it is.",
        });
        return;
      }

      let spins;

      if (diff === "Heroic") spins = 0;
      if (diff === "Tactician") spins = 1;
      if (diff === "Normal") spins = 2;

      const newCharacterObj = {
        name: name,
        race: race,
        diff: diff,
        level: 0,
        spins: spins,
        classes: [],
      };

      User.findOneAndUpdate(
        { username: username },
        { $set: { [`characters.${name}`]: newCharacterObj } },
        { new: true }
      )
        .then((updatedUser) => {
          console.log(updatedUser);
        })
        .catch((err) => {
          console.error(err);
        });

      res.json({ message: "Successful Creation" });
    });
  });
});

app.post("/removeCharacter", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const characterName = req.body.characterName;

  if (!username || !password) return res.redirect("/");

  User.findOne({ username: username }).then((user) => {
    if (!user) return res.redirect("/");
    if (sha256(user.password) !== password) {
      res.redirect("/");
      console.log("failed password!");
      return;
    }

    User.findOneAndUpdate(
      { username: username },
      { $unset: { [`characters.${characterName}`]: "" } }
    )
      .then((updatedUser) => {
        console.log(updatedUser);
      })
      .catch((err) => {
        console.error(err);
      });

    res.json({ message: "Successful Deletion." });
  });
});

app.post("/startRolling", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const characterName = req.body.characterName;

  if (!username || !password) return res.redirect("/");

  User.findOne({ username: username }).then((user) => {
    if (sha256(user.password) !== password) return res.redirect("/");

    let newLevel = user.characters[characterName].level + 1;

    if (newLevel === 13) return res.json({ message: "complete" });

    User.findOneAndUpdate(
      { username: username },
      { $set: { [`characters.${characterName}.level`]: newLevel } }
    ).then(() => {
      let choseClass = Math.floor(Math.random() * 12);

      const allClasses = [
        "Barbarian",
        "Bard",
        "Cleric",
        "Druid",
        "Fighter",
        "Monk",
        "Paladin",
        "Ranger",
        "Rogue",
        "Sorcerer",
        "Warlock",
        "Wizard",
      ];
      while (
        user.characters[characterName].classes.includes(allClasses[choseClass])
      ) {
        choseClass = Math.floor(Math.random() * 12);
      }

      User.findOneAndUpdate(
        { username: username },
        {
          $push: {
            [`characters.${characterName}.classes`]: allClasses[choseClass],
          },
        }
      ).then(() => {
        res.json({
          message: "Success Roll",
          level: newLevel,
          class: allClasses[choseClass],
        });
      });
    });
  });
});

app.post("/respin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const characterName = req.body.characterName;

  if (!username || !password) return res.redirect("/");

  User.findOne({ username: username }).then((user) => {
    if (sha256(user.password) !== password) return res.redirect("/");
    let newSpins = user.characters[characterName].spins - 1;

    if (newSpins < 0) return res.json({ message: "no more spins" });
    if (user.characters[characterName].level === 0) return res.redirect("/");

    User.findOneAndUpdate(
      { username: username },
      {
        $set: {
          [`characters.${characterName}.level`]:
            user.characters[characterName].level - 1,
        },
      }
    ).then(() => {
      User.findOneAndUpdate(
        { username: username },
        { $set: { [`characters.${characterName}.spins`]: newSpins } }
      ).then(() => {
        User.findOneAndUpdate(
          { username: username },
          { $pop: { [`characters.${characterName}.classes`]: 1 } }
        ).then(() => {
          res.json({ message: "Success Respin" });
        });
      });
    });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(listener.address().port);
});
