/**
 * Displays a message in a message box.
 * The message box is shown for 2 seconds before being hidden.
 * @param {string} message - The message to display.
 */
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

/**
 * Generates a random color from a predefined list of colors.
 * @returns {string} - A randomly selected color in hexadecimal format.
 */
function getRandomColor() {
  let colors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];

  let randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

/**
 * Handles the user registration process.
 * Validates the input fields, checks if the email is already registered,
 * and saves the user data to Firebase if valid.
 */
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

function checkFormValidity() {
  const name = document.getElementById("first-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();
  const privacyChecked = document.getElementById("privacy-policy").checked;
  const registerBtn = document.getElementById("register-btn");

  if (name && email && password && confirmPassword && privacyChecked) {
    registerBtn.disabled = false;
  } else {
    registerBtn.disabled = true;
  }
}

document.getElementById("first-name").addEventListener("input", checkFormValidity);
document.getElementById("email").addEventListener("input", checkFormValidity);
document.getElementById("password").addEventListener("input", checkFormValidity);
document.getElementById("confirm-password").addEventListener("input", checkFormValidity);
document.getElementById("privacy-policy").addEventListener("change", checkFormValidity);

/**
 * Validates the password fields and the privacy policy checkbox.
 * Ensures that the passwords match and the privacy policy is accepted.
 * @param {string} password - The password entered by the user.
 * @param {string} confirmPassword - The confirmation password entered by the user.
 * @param {boolean} privacyChecked - Whether the privacy policy checkbox is checked.
 * @returns {boolean} - True if the validation passes, otherwise false.
 */
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

/**
 * Checks if the provided email is already registered in Firebase.
 * Displays an error message if the email is taken.
 * @param {string} email - The email to check.
 * @param {Function} callback - A callback function that receives a boolean indicating if the email exists.
 */
function isEmailTaken(email, callback) {
  fetch(firebaseURLUser)
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

/**
 * Saves the user data to Firebase.
 * Generates a random color for the user and posts the data to Firebase.
 * Displays a success message and redirects to the login page upon successful registration.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 */
function saveUser(name, email, password) {
  let color = getRandomColor();
  fetch(firebaseURLUser, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, color }),
  })
    .then(() => {
      showMessage("Registration successful! Redirecting...", true);
      setTimeout(() => (window.location.href = "./index.html"), 2000);
    })
    .catch(console.error);
}
