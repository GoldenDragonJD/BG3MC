const addCharacterForm = document.querySelector("#character-creator-form");

addCharacterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const addCharacterName = document.querySelector("#name-input-field").value;
  const addCharacterRace = document.querySelector("#race-header").innerHTML;
  const addCharacterDiff =
    document.querySelector("#difficulty-header").innerHTML;

  const selectedButtons = document.getElementsByClassName("selected-race");

  if (selectedButtons.length === 0) {
    alert("Please Select A Race Before Creating A Character.");
    window.location.reload();
    return;
  }

  const selectedDiffs = document.getElementsByClassName(
    "selected-difficulty-button"
  );

  if (selectedDiffs.length === 0) {
    alert("Please Select A Difficulty Before Creating A Character.");
    window.location.reload();
    return;
  }

  fetch("/addCharacter", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      name: addCharacterName,
      race: addCharacterRace,
      diff: addCharacterDiff,
      username: username,
      password: password,
    }),
  }).then((response) => {
    response
      .json()
      .then((data) => {
        if (data.message !== "Successful Creation") {
          alert("Failed to create character!");
          window.location.reload();
          return;
        }
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
