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

function renderHeader() {
  document.getElementById('header').innerHTML = `
    <img class="logo-responsive" src="/assets/img/Capa 1.svg" alt="Logo">
    <span class="headline">Kanban Project Management Tool</span>
    <div class="header-right">
      <a href="/texte/help.html"><img class="help-button" src="/assets/img/help.svg" alt="Help"></a>
      <span id="current-user-initials" class="user">G</span>
      <div id="user-dropdown" class="dropdown hidden">
        <a href="/texte/privacy.html">Privacy Policy</a>
        <a href="/texte/legal.html">Legal Notice</a>
        <a href="/log-in.html">Log out</a>
      </div>
    </div>
  `;

  let userName = sessionStorage.getItem("userName") || "Gast";
  createCurrentUserInitials({ name: userName });
}

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
