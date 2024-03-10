window.document
  .querySelector("#register-form")
  .addEventListener("submit", (action) => {
    action.preventDefault();

    let username = document.getElementById("username-register").value;
    let password = document.getElementById("password-register").value;

    fetch("/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message !== "Success") return alert(data.message);
        window.location.href =
          "/home?username=" +
          encodeURIComponent(username) +
          "&token=" +
          encodeURIComponent(data.token);
      });
  });

document.querySelector("#login-form").addEventListener("submit", (action) => {
  action.preventDefault();

  let username = document.getElementById("username-login").value;
  let password = document.getElementById("password-login").value;

  fetch("/login", {
    method: "POSt",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  }).then((response) =>
    response.json().then((data) => {
      if (data.message !== "Success") return alert(data.message);
      window.location.href =
        "/home?username=" +
        encodeURIComponent(username) +
        "&token=" +
        encodeURIComponent(data.token);
    })
  );
});
