userInfo.then((data) => {
  const userNameElements = document.getElementsByClassName("username-display");

  for (let element of userNameElements) {
    element.innerHTML = data.username;
  }
});

if (document.querySelector(".selected")) {
  if (document.querySelector(".selected").id !== "add-character") {
    document.getElementById("character-creator").style.display = "none";
  } else {
    document.getElementById("character-creator").style.display = "flex";
  }
} else {
  document.getElementById("character-creator").style.display = "none";
}
