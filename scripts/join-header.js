/**
 * Creates the initials for the current user and updates the user icon in the header.
 * Retrieves the user's name and color from session storage and applies them to the user icon.
 * @param {Object} user - The user object containing the user's name.
 * @param {string} user.name - The full name of the user.
 */
function createCurrentUserInitials(user) {
  const userImage = document.getElementById("current-user-initials");
  if (!user?.name || !userImage) return;
  
  const [first, second] = user.name.split(" ");
  const initials = (first?.charAt(0) || "") + (second?.charAt(0) || "");
  const color = sessionStorage.getItem("userColor") || "#000";
  
  userImage.innerHTML = initials.toUpperCase();
  userImage.classList.add("user-initials");
  userImage.style.color = color;
  userImage.style.backgroundColor = "transparent";
}

/**
 * Renders the header for the application.
 * Updates the inner HTML of the element with the ID "header" to display the logo, headline, and user-related elements.
 * Also initializes the current user's initials in the header.
 */
function renderHeader() {
  document.getElementById('header').innerHTML = `
    <img class="logo-responsive" src="/assets/img/Capa 1.svg" alt="Logo">
    <span class="headline">Kanban Project Management Tool</span>
    <div class="header-right">
      <a href="./help.html"><img class="help-button" src="/assets/img/help.svg" alt="Help"></a>
      <span id="current-user-initials" class="user">G</span>
      <div id="user-dropdown" class="dropdown hidden">
        <a href="./privacy.html">Privacy Policy</a>
        <a href="./legal.html">Legal Notice</a>
        <a href="./index.html">Log out</a>
      </div>
    </div>
  `;

  let userName = sessionStorage.getItem("userName") || "Gast";
  createCurrentUserInitials({ name: userName });
}

/**
 * Initializes the dropdown menu events for the user icon in the header.
 * Toggles the visibility of the dropdown menu when the user icon is clicked.
 * Hides the dropdown menu when clicking outside of it.
 */
function initDropdownEvents() {
  const userIcon = document.getElementById("current-user-initials");
  const dropdown = document.getElementById("user-dropdown");

  if (!userIcon || !dropdown) return; // Sicherheits-Check

  userIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.classList.contains("hidden")) {
      dropdown.classList.add("hidden");
    }
  });
}
