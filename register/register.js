const firebaseURL =
  "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users.json";

function showMessage(message) {
  let messageBox = document.getElementById("message-box");
  messageBox.textContent = message;
  messageBox.classList.remove("d-none");
  messageBox.style.display = "block";

  setTimeout(() => {
    messageBox.classList.add("d-none");
    messageBox.style.display = "none";
  }, 2000);
}

function getRandomColor() {
  let colors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];

  let randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function registerUser() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirm-password").value;
  let name = document.getElementById("first-name").value;
  let privacyChecked = document.getElementById("privacy-policy").checked;

  if (!validatePasswords(password, confirmPassword, privacyChecked)) return;

  isEmailTaken(email, (exists) => {
    if (!exists) saveUser(name, email, password);
  });
}

function validatePasswords(password, confirmPassword, privacyChecked) {
  if (!privacyChecked) {
    showMessage("Please accept the privacy policy!", false);
    return false;
  }
  if (password !== confirmPassword) {
    showMessage("Passwords do not match!", false);
    return false;
  }
  return true;
}

function isEmailTaken(email, callback) {
  fetch(firebaseURL)
    .then((response) => response.json())
    .then((users) => {
      let exists = Object.values(users || {}).some(
        (user) => user.email === email
      );
      if (exists)
        showMessage("This email address is already registered!", false);
      callback(exists);
    })
    .catch(console.error);
}

function saveUser(name, email, password) {
  let color = getRandomColor();
  fetch(firebaseURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, color }),
  })
    .then(() => {
      showMessage("Registration successful! Redirecting...", true);
      setTimeout(() => (window.location.href = "./log-in.html"), 2000);
    })
    .catch(console.error);
}
