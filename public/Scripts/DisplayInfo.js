userInfo.then((data) => {
  const userNameElements = document.getElementsByClassName("username-display");

  for (let element of userNameElements) {
    element.innerHTML = data.username;
  }

  const characters = Object.values(data.characters);
  const listElement = document.getElementById("character-list");
  if (!characters) return;

  for (let character of characters) {
    const listObj = document.createElement("li");
    const inputObj = document.createElement("input");

    inputObj.classList.add("select-button");
    inputObj.classList.add("select-character");
    inputObj.onclick = () => toggleButton(inputObj);
    inputObj.type = "button";
    inputObj.value = character.name;
    inputObj.id = `select-button-${character.name}`;

    listObj.appendChild(inputObj);
    listElement.appendChild(listObj);
  }
});

if (document.querySelector(".selected")) {
  if (document.querySelector(".selected").id !== "add-character") {
    document.getElementById("character-creator").style.display = "none";
    document.getElementById("character-display").style.display = "flex";
  } else {
    document.getElementById("character-creator").style.display = "flex";
    document.getElementById("character-display").style.display = "none";
  }
} else {
  document.getElementById("character-creator").style.display = "none";
  document.getElementById("character-display").style.display = "none";
}

let delay = 200;

setInterval(() => {
  if (
    window.localStorage.getItem("lastVisited") &&
    window.localStorage.getItem("lastVisited") !== ""
  ) {
    const lastVisited = window.localStorage.getItem("lastVisited");
    const button = document.getElementById(`${lastVisited}`);

    toggleButton(button);
    delay = 2000;
  }
}, delay);
