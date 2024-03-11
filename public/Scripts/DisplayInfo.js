userInfo.then((data) => {
  const userNameElements = document.getElementsByClassName("username-display");

  for (let element of userNameElements) {
    element.innerHTML = data.username;
  }
});
