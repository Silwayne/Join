/**
 * Renders the sidebar for the application.
 * Updates the inner HTML of the element with the ID "sidbar" to display the navigation menu,
 * including links for "Summary", "Add Task", "Board", "Contacts", "Privacy Policy", and "Legal Notice".
 */
function renderSidebar() {
  document.getElementById("sidbar").innerHTML = `
    <nav class="sidbar-nav">
        <div class="sidbar-top">
            <img class="sidbar-logo" src="./assets/img/Capa 2.svg" alt="Logo">
            <div class="menu">
                <a href="./join-main.html">
                    <button class="menu-button menu-button-design font-size">
                        <img src="./assets/img/summary-icon.svg" alt="Summary">
                        <span>Summary</span>
                    </button>
                </a>
                <a href="./add-task.html">
                    <button class="menu-button menu-button-design font-size">
                        <img src="./assets/img/add_task_icon.svg" alt="Add Task">
                        <span style="white-space: nowrap;">Add Task</span>
                    </button>
                </a>
                <a href="./board.html">
                    <button class="menu-button menu-button-design font-size">
                        <img src="./assets/img/board-icon.svg" alt="Board">
                        <span>Board</span>
                    </button>
                </a>
                <a href="./contacts.html">
                    <button class="menu-button menu-button-design font-size">
                        <img src="./assets/img/perm_contact_calendar.svg" alt="Contacts">
                        <span>Contacts</span>
                    </button>
                </a>
            </div>
        </div>
        <div class="sidbar-bottom d-none">
            <a href="./privacy.html">
                <button class="menu-button menu-button-lower-design font-size">
                    Privacy Policy
                </button>
            </a>
            <a href="./legal.html">
                <button class="menu-button menu-button-lower-design font-size">
                    Legal Notice
                </button>
            </a>
        </div>
    </nav>
`;
highlightActiveSidebarButton();
}

/**
 * Renders the responsive sidebar for the application.
 * Updates the inner HTML of the element with the ID "sidebar-responsive" to display the navigation menu
 * in a responsive layout, including links for "Summary", "Add Task", "Board", and "Contacts".
 */
function renderSidebarResponsive() {
  document.getElementById("sidebar-responsive").innerHTML = `
    <div class="menu-responsive">
        <a href="./join-main.html">
            <button class="menu-button-responsive menu-button-design-responsive font-size-responsive">
                <img src="./assets/img/summary-icon.svg" alt="Summary">
                <span>Summary</span>
            </button>
        </a>
        <a href="./add-task.html">
            <button class="menu-button-responsive menu-button-design-responsive font-size-responsive">
                <img src="./assets/img/add_task_icon.svg" style="width: 28px; alt="Add Task">
                <span style="white-space: nowrap;">Add Task</span>
            </button>
        </a>
        <a href="./board.html">
            <button class="menu-button-responsive menu-button-design-responsive font-size-responsive">
                <img src="./assets/img/board-icon.svg" alt="Board">
                <span>Board</span>
            </button>
        </a>
        <a href="./contacts.html">
            <button class="menu-button-responsive menu-button-design-responsive font-size-responsive">
                <img src="./assets/img/perm_contact_calendar.svg" alt="Contacts">
                <span>Contacts</span>
            </button>
        </a>
    </div>
    `;
  highlightActiveSidebarButton();
}

/**
 * Highlights the active sidebar button based on the current page.
 * Compares the current page's filename with the `href` attributes of all sidebar links.
 * If a match is found, the corresponding button element is assigned the "active-button" class.
 */
function highlightActiveSidebarButton() {
    const currentPage = window.location.pathname.split("/").pop();
    const allLinks = document.querySelectorAll(".menu a, .sidbar-bottom a, .menu-responsive a");
    allLinks.forEach(link => {
      const href = link.getAttribute("href").split("/").pop();
      if (href === currentPage) {
        const button = link.querySelector("button");
        if (button) button.classList.add("active-button");
      }
    });
  }