function reSpin() {
  const characterKey = document.getElementById(
    "character-display-header"
  ).innerHTML;

  fetch("/reSpin", {
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
      if (data.message !== "Success Respin") return alert(data.message);
      window.location.reload();
    });
  });
}
