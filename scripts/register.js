/**
 * Displays a message in a message box.
 * The message box is shown for 2 seconds before being hidden.
 * @param {string} message - The message to display.
 * @param {boolean} [isSuccess=false] - Whether the message indicates success or error.
 */
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

/**
 * Generates a random color from a predefined list of colors.
 * @returns {string} A randomly selected color in hexadecimal format.
 */
function getRandomColor() {
  let colors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Validates the email input field and shows an inline error message if invalid.
 * @returns {boolean} True if email is valid, otherwise false.
 */
function validateEmailInput() {
  const emailInput = document.getElementById("email");
  const errorMessage = document.getElementById("email-error");
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());

  if (!isValid) {
    errorMessage.classList.add("visible");
    return false;
  } else {
    errorMessage.classList.remove("visible");
    return true;
  }
}

/**
 * Validates the password length and shows an inline error message if too short.
 * @returns {boolean} True if password has at least 6 characters, otherwise false.
 */
function validatePassword() {
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("password-error");

  if (passwordInput.value.trim().length < 6) {
    errorMessage.classList.add("visible");
    return false;
  } else {
    errorMessage.classList.remove("visible");
    return true;
  }
}

/**
 * Validates that password and confirmation match.
 * Shows inline error message if they don't match.
 * @returns {boolean} True if passwords match, otherwise false.
 */
function validatePasswordMatch() {
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm-password");
  const errorMessage = document.getElementById("confirm-password-error");

  if (confirmInput.value.trim() !== passwordInput.value.trim()) {
    errorMessage.classList.add("visible");
    return false;
  } else {
    errorMessage.classList.remove("visible");
    return true;
  }
}

/**
 * Handles the user registration process.
 * Runs all validations, then checks if email is already taken.
 * If valid, saves user data to Firebase.
 */
function registerUser() {
  const emailValid = validateEmailInput();
  const passwordValid = validatePassword();
  const passwordsMatch = validatePasswordMatch();
  const privacyChecked = document.getElementById("privacy-policy").checked;

  if (!emailValid || !passwordValid || !passwordsMatch || !privacyChecked) {
    if (!privacyChecked) {
      showMessage("Please accept the privacy policy!", false);
    }
    return;
  }

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("first-name").value;

  isEmailTaken(email, (exists) => {
    if (!exists) saveUser(name, email, password);
  });
}

/**
 * Enables or disables the register button depending on whether the form is filled.
 */
function checkFormValidity() {
  const name = document.getElementById("first-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();
  const privacyChecked = document.getElementById("privacy-policy").checked;
  const registerBtn = document.getElementById("register-btn");

  registerBtn.disabled = !(name && email && password && confirmPassword && privacyChecked);
}

document.getElementById("first-name").addEventListener("input", checkFormValidity);
document.getElementById("email").addEventListener("input", checkFormValidity);
document.getElementById("password").addEventListener("input", checkFormValidity);
document.getElementById("confirm-password").addEventListener("input", checkFormValidity);
document.getElementById("privacy-policy").addEventListener("change", checkFormValidity);

/**
 * Checks if the provided email is already registered in Firebase.
 * @param {string} email - Email address to check.
 * @param {Function} callback - Function to call with the result (true/false).
 */
function isEmailTaken(email, callback) {
  fetch(firebaseURLUser)
    .then((response) => response.json())
    .then((users) => {
      const exists = Object.values(users || {}).some((user) => user.email === email);
      if (exists) {
        showMessage("This email address is already registered!", false);
      }
      callback(exists);
    })
    .catch(console.error);
}

/**
 * Saves the user data to Firebase and redirects to login page.
 * @param {string} name - User's full name.
 * @param {string} email - Email address.
 * @param {string} password - Password.
 */
function saveUser(name, email, password) {
  const color = getRandomColor();
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

