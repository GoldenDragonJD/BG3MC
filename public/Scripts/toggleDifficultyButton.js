function toggleDifficultyButton(button) {
  const buttons = document.querySelectorAll(".selected-difficulty-button");

  buttons.forEach((element) => {
    element.classList.remove("selected-difficulty-button");
    element.classList.add("difficulty-select-button");
  });

  button.classList.add("selected-difficulty-button");
  button.classList.remove("difficulty-select-button");

  const difficultyHeader = document.querySelector("#difficulty-header");
  difficultyHeader.innerHTML = button.id;
  difficultyHeader.style.display = "flex";

  const difficultyDescription = document.querySelector(
    "#difficulty-description"
  );
  difficultyDescription.style.display = "flex";
  window.scrollTo(0, document.body.scrollHeight);

  if (button.id === "Normal") {
    button.style.setProperty("--difficulty-color", "limegreen");
    difficultyDescription.style.setProperty("--difficulty-color", "limegreen");
    difficultyHeader.style.setProperty("--difficulty-color", "limegreen");
    difficultyDescription.innerHTML = "+2 Spins.";
  } else if (button.id === "Tactician") {
    button.style.setProperty("--difficulty-color", "orange");
    difficultyDescription.style.setProperty("--difficulty-color", "orange");
    difficultyHeader.style.setProperty("--difficulty-color", "orange");
    difficultyDescription.innerHTML = "+1 Spins.";
  } else if (button.id === "Heroic") {
    button.style.setProperty("--difficulty-color", "red");
    difficultyDescription.style.setProperty("--difficulty-color", "red");
    difficultyHeader.style.setProperty("--difficulty-color", "red");
    difficultyDescription.innerHTML = "No Spins. Good Luck!";
  }
}
