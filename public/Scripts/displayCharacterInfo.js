function displayCharacterInfo(characterName) {
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
  });
}
