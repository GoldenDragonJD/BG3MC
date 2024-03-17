function displayCharacterInfo(characterName) {
  userInfo = fetch("/grabAccountInfo", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  }).then((response) => response.json().then((data) => data));

  userInfo.then((data) => {
    const characterInfo = data.characters[characterName];
    document.getElementById("character-display-header").innerHTML =
      characterInfo["name"];
    document.getElementById(
      "character-display-image"
    ).src = `/public/Thumbnail/100px-Race_${characterInfo["race"]}.png`;

    if (data.characters[characterName].level > 0) {
      document.getElementById("roll-button").innerHTML = "LEVELED UP";
    }

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

    for (let i = 0; i < 12; i++) {
      document
        .querySelector(`#level-${i + 1}-container > h2`)
        .style.setProperty("--level-color", "#262626");
      document.querySelector(
        `#level-${i + 1}-container > img`
      ).src = `/public/Images/levelPlaceHolder.png`;

      document
        .getElementById(allClasses[i])
        .classList.remove("unavailable-class");
      document.getElementById(allClasses[i]).classList.add("available-class");
    }

    for (let i = 0; i < data.characters[characterName].classes.length; i++) {
      document
        .querySelector(`#level-${i + 1}-container > h2`)
        .style.setProperty("--level-color", "white");
      document.querySelector(
        `#level-${i + 1}-container > img`
      ).src = `/public/Images/${data.characters[characterName].classes[i]}.png`;

      document
        .getElementById(data.characters[characterName].classes[i])
        .classList.add("unavailable-class");
      document
        .getElementById(data.characters[characterName].classes[i])
        .classList.remove("available-class");
    }

    if (
      data.characters[characterName].spins > 0 &&
      data.characters[characterName].level > 0
    ) {
      document.getElementById("respin-button").style.display = "flex";
      document.getElementById("character-display-spins").style.display = "flex";
      document.getElementById("character-display-spins").innerHTML =
        data.characters[characterName].spins;
    } else {
      document.getElementById("respin-button").style.display = "none";
      document.getElementById("character-display-spins").style.display = "none";
    }

    const difficulty = data.characters[characterName].diff;

    document.getElementsByClassName("difficulty-info-header")[0].innerHTML =
      difficulty;
    if (difficulty === "Normal")
      document
        .getElementsByClassName("difficulty-info-header")[0]
        .style.setProperty("--difficulty-color-header", "limegreen");
    if (difficulty === "Tactician")
      document
        .getElementsByClassName("difficulty-info-header")[0]
        .style.setProperty("--difficulty-color-header", "orange");
    if (difficulty === "Heroic")
      document
        .getElementsByClassName("difficulty-info-header")[0]
        .style.setProperty("--difficulty-color-header", "red");

    document.getElementsByClassName("difficulty-info-header")[1].innerHTML =
      difficulty;
    if (difficulty === "Normal")
      document
        .getElementsByClassName("difficulty-info-header")[1]
        .style.setProperty("--difficulty-color-header", "limegreen");
    if (difficulty === "Tactician")
      document
        .getElementsByClassName("difficulty-info-header")[1]
        .style.setProperty("--difficulty-color-header", "orange");
    if (difficulty === "Heroic")
      document
        .getElementsByClassName("difficulty-info-header")[1]
        .style.setProperty("--difficulty-color-header", "red");
  });
}
