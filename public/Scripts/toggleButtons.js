function toggleButton(button) {
  if (button.id !== "add-character") clearInterval(loadButton);
  const buttons = document.querySelectorAll(".select-button");
  buttons.forEach((element) => {
    if (!element.classList.contains("select-character")) {
      element.classList.add("select-character");
      element.classList.remove("selected");
    }
  });
  button.classList.remove("select-character");
  button.classList.add("selected");
  if (button.id === "add-character") {
    document.getElementById("character-creator").style.display = "flex";
    document.getElementById("character-display").style.display = "none";
  } else {
    localStorage.setItem("lastVisited", `${button.id}`);
    document.getElementById("character-creator").style.display = "none";
    document.getElementById("character-display").style.display = "flex";
    displayCharacterInfo(button.value);
  }
}

userInfo.then((data) => {
  if (!data.characters) {
    toggleButton(document.querySelector("#add-character"));
  }
});
