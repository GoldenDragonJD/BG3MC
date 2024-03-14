function displayCharacterInfo(characterName) {
  userInfo.then((data) => {
    const characterInfo = data.characters[characterName];
    document.getElementById("character-display-header").innerHTML =
      characterInfo["name"];
    document.getElementById(
      "character-display-image"
    ).src = `/public/Thumbnail/100px-Race_${characterInfo["race"]}.png`;
  });
}
