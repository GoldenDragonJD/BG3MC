function deleteButton() {
  const characterKey = document.getElementById(
    "character-display-header"
  ).innerHTML;

  let username = window.location.search.split("=")[1].split("&")[0];
  let password = window.location.search.split("=")[2].split("&")[0];

  username = decodeURIComponent(username);
  password = decodeURIComponent(password);

  fetch("/removeCharacter", {
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
      if (data.message !== "Successful Deletion.")
        return alert("Failed to Delete Character!");

      window.location.reload();
    });
  });
}
