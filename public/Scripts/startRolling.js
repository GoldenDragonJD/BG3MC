function startRolling(button) {
  document.getElementById("roll-button").innerHTML = "LEVELED UP";
  const characterKey = document.getElementById(
    "character-display-header"
  ).innerHTML;

  fetch("/startRolling", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
      characterName: characterKey,
    }),
  }).then((response) => {
    response.json().then((data) => {
      if (data.message !== "Success Roll") return alert(data.message);

      document.getElementById("roll-button").style.display = "none";
      document
        .querySelector(`#level-${data.level}-container > h2`)
        .style.setProperty("--level-color", "limegreen");
      let availableClasses = document.getElementsByClassName("available-class");

      availableClasses = Array.from(availableClasses);

      const totalRounds = Math.floor(Math.random() * 3);

      for (let i = 0; i <= totalRounds; i++) {
        availableClasses = availableClasses.concat(availableClasses);
      }

      const innerFunc = function (availableClasses, round = 0) {
        if (!availableClasses) return;

        let elements = document.getElementsByClassName("available-class");
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.setProperty("--image-border-color", "#020202");
        }

        const currentClass = availableClasses.shift();

        document.getElementById("character-display-name").innerHTML =
          currentClass.id;

        if (currentClass.id === data.class && round === totalRounds) {
          document
            .getElementById(currentClass.id)
            .style.setProperty("--image-border-color", "limegreen");
          setTimeout(() => {
            document
              .getElementById(currentClass.id)
              .style.setProperty("--image-border-color", "#020202");
            document.getElementById("roll-button").style.display = "flex";
            currentClass.classList.add("unavailable-class");
            currentClass.classList.remove("available-class");
          }, 4000);

          document
            .querySelector(`#level-${data.level}-container > h2`)
            .style.setProperty("--level-color", "white");
          document.querySelector(
            `#level-${data.level}-container > img`
          ).src = `/public/Images/${data.class}.png`;

          return;
        }

        document
          .getElementById(currentClass.id)
          .style.setProperty("--image-border-color", "limegreen");

        if (currentClass.id === data.class) round++;
        setTimeout(innerFunc, 200, availableClasses, round);
      };

      setTimeout(innerFunc, 200, availableClasses);
    });
  });
}
