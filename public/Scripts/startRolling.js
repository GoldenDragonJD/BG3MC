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
      document.getElementById("character-selector").style.display = "none";
      document
        .querySelector(`#level-${data.level}-container > h2`)
        .style.setProperty("--level-color", "limegreen");
      let availableClasses = document.getElementsByClassName("available-class");

      let delay = 80;
      availableClasses = Array.from(availableClasses);

      if (availableClasses.length < 5) delay = 300;

      let totalRounds = 0;
      if (availableClasses.length > 1) {
        totalRounds = Math.floor(Math.random() * 8) + 5;
        for (let i = 0; i <= totalRounds; i++) {
          availableClasses = availableClasses.concat(availableClasses);
        }
      }

      const innerFunc = function (availableClasses, round = totalRounds) {
        if (!availableClasses) return;

        let elements = document.getElementsByClassName("available-class");
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.setProperty("--image-border-color", "#020202");
        }

        const currentClass = availableClasses.shift();
        document.getElementById("character-display-name").innerHTML =
          currentClass.id;

        if (currentClass.id === data.class && round === 0) {
          document.getElementById("done-audio").play();
          document
            .getElementById(currentClass.id)
            .style.setProperty("--image-border-color", "limegreen");
          setTimeout(() => {
            document.getElementById("character-selector").style.display =
              "flex";
            document
              .getElementById(currentClass.id)
              .style.setProperty("--image-border-color", "#020202");
            document.getElementById("roll-button").style.display = "flex";
            currentClass.classList.add("unavailable-class");
            currentClass.classList.remove("available-class");
            userInfo.then((info) => {
              if (info.characters[characterKey].spins > 0) {
                document.getElementById("respin-button").style.display = "flex";
                document.getElementById(
                  "character-display-spins"
                ).style.display = "flex";
                document.getElementById("character-display-spins").innerHTML =
                  info.characters[characterKey].spins;
              } else {
                document.getElementById("respin-button").style.display = "none";
              }
            });
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
        document.getElementById(`${currentClass.id}-audio-player`).play();

        if (Math.random() < 0.5) {
          if (round === 2) delay = 400;
          if (round === 1) delay = 800;
          if (round === 0) delay = 1000;
        }

        console.log(delay);

        if (currentClass.id === data.class) round--;
        setTimeout(innerFunc, delay, availableClasses, round);
      };

      setTimeout(innerFunc, delay, availableClasses);
    });
  });
}
