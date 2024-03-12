let username = window.location.search.split("=")[1].split("&")[0];
let password = window.location.search.split("=")[2].split("&")[0];

username = decodeURIComponent(username);
password = decodeURIComponent(password);

// convert unicode to basic string

const userInfo = fetch("/grabAccountInfo", {
  method: "POST",
  headers: { "Content-type": "application/json" },
  body: JSON.stringify({
    username: username,
    password: password,
  }),
}).then((response) => response.json().then((data) => data));
