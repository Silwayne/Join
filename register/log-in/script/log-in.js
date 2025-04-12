const firebaseURL =
  "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users.json";

function showMessage(message, isSuccess = false) {
  let messageBox = document.getElementById("message-box");
  messageBox.textContent = message;
  messageBox.style.backgroundColor = isSuccess ? "#28a745" : "#dc3545";
  messageBox.classList.remove("d-none");
  messageBox.style.display = "block";

  setTimeout(() => {
    messageBox.classList.add("d-none");
    messageBox.style.display = "none";
  }, 2000);
}

window.onload = function () {
  const loader = document.getElementById("loader");
  const logo = document.getElementById("logo");

  setTimeout(() => {
    logo.style.width = "100px";
    logo.style.height = "122px";
    logo.style.top = "5%";
    logo.style.left = "5%";
    logo.style.transform = "translate(0, 0)";
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 1000);
  }, 500);
};

function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  fetchUsers(email, password);
}

function fetchUsers(email, password) {
  fetch(firebaseURL)
    .then((response) => response.json())
    .then((users) => checkLogin(users, email, password))
    .catch(console.error);
}

function checkLogin(users, email, password) {
  let userList = Object.values(users || {});
  let userFound = userList.find(
    (user) => user.email === email && user.password === password
  );

  if (userFound) {
    sessionStorage.setItem("userName", userFound.name);
    sessionStorage.setItem("userColor", userFound.color);
    window.location.href = "./join-main/join-main.html";
  } else {
    showMessage("Incorrect email or password!");
  }
}

function guestLogin() {
  let guestEmail = "guest@join.de";
  let guestPassword = "guest123";

  sessionStorage.setItem("email", guestEmail);
  sessionStorage.setItem("password", guestPassword);

  showMessage("You are logged in as a guest!", true);
  setTimeout(() => (window.location.href = "./join-main/join-main.html"), 2000);
}
