function toggleButton(button) {
  const buttons = document.querySelectorAll(".select-button");
  buttons.forEach((element) => {
    if (!element.classList.contains("select-character")) {
      element.classList.add("select-character");
      element.classList.remove("selected");
    }
  });
  button.classList.remove("select-character");
  button.classList.add("selected");
  if (button.id === "add-character")
    document.getElementById("character-creator").style.display = "flex";
}

userInfo.then((data) => {
  if (!data.characters) {
    toggleButton(document.querySelector("#add-character"));
  }
});
