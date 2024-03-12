function toggleRaceButton(button) {
  const buttons = document.querySelectorAll(".selected-race");
  buttons.forEach((element) => {
    element.classList.remove("selected-race");
    element.classList.add("race-select-button");
  });
  button.classList.remove("race-select-button");
  button.classList.add("selected-race");
  document.querySelector("#race-header").innerHTML = button.id;
}
