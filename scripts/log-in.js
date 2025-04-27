/**
 * Displays a message in a message box with a specific background color.
 * The message box is shown for 2 seconds before being hidden.
 * @param {string} message - The message to display.
 * @param {boolean} [isSuccess=false] - Whether the message indicates success (true) or an error (false).
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
 * Initializes the loader animation on the login page.
 * Adjusts the logo size and position, fades out the loader, and hides it after a delay.
 */
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

/**
 * Handles the login process by retrieving the email and password from the input fields
 * and calling the function to fetch users from Firebase.
 */
function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  fetchUsers(email, password);
}

/**
 * Fetches the list of users from Firebase and checks the login credentials.
 * @param {string} email - The email entered by the user.
 * @param {string} password - The password entered by the user.
 */
function fetchUsers(email, password) {
  fetch(firebaseURLUser)
    .then((response) => response.json())
    .then((users) => checkLogin(users, email, password))
    .catch(console.error);
}

/**
 * Checks the login credentials against the list of users.
 * If the credentials match, the user is logged in and redirected to the main page.
 * Otherwise, an error message is displayed.
 * @param {Object} users - The list of users fetched from Firebase.
 * @param {string} email - The email entered by the user.
 * @param {string} password - The password entered by the user.
 */
function checkLogin(users, email, password) {
  let userList = Object.values(users || {});
  let userFound = userList.find(
    (user) => user.email === email && user.password === password
  );

  if (userFound) {
    sessionStorage.setItem("userName", userFound.name);
    sessionStorage.setItem("userColor", userFound.color);
    window.location.href = "./join-main.html";
  } else {
    showMessage("Incorrect email or password!");
  }
}

/**
 * Logs in as a guest user by setting default guest credentials in session storage.
 * Displays a success message and redirects to the main page after 2 seconds.
 */
function guestLogin() {
  let guestEmail = "guest@join.de";
  let guestPassword = "guest123";

  sessionStorage.setItem("email", guestEmail);
  sessionStorage.setItem("password", guestPassword);

  showMessage("You are logged in as a guest!", true);
  setTimeout(() => (window.location.href = "./join-main.html"), 2000);
}
