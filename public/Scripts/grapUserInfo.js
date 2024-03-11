const username = window.location.search.split("=")[1].split("&")[0];
const password = window.location.search.split("=")[2].split("&")[0];

const userInfo = fetch("/grabAccountInfo", {
  method: "POST",
  headers: { "Content-type": "application/json" },
  body: JSON.stringify({
    username: username,
    password: password,
  }),
}).then((response) => response.json().then((data) => data));

console.log(
  "This is after:",
  userInfo.then((data) => data)
);
