/**
 * Renders the sidebar for the login page.
 * Updates the inner HTML of the element with the ID "sidbar" to display the navigation menu,
 * including links for "Log in", "Privacy Policy", and "Legal Notice".
 */
function renderSidebar() {
  document.getElementById("sidbar").innerHTML = `
  
        <nav class="sidbar-nav">
            <div class="sidbar-top">
                <img class="sidbar-logo" src="/assets/img/Capa 2.svg" alt="Logo">
                <div class="menu">
                    <a href="./index.html">
                        <button class="menu-button menu-button-design font-size">
                            <img src="/assets/img/Icons.svg" alt="Log in Icon" />
                            <span>Log in</span>
                        </button>
                    </a>
                </div>
            </div>
            <div class="sidbar-bottom">
                <a href="./privacy-login.html">
                    <button class="menu-button menu-button-lower-design font-size">
                      Privacy Policy
                    </button>
                </a>
                <a href="./legal-login.html">
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
 * Renders the responsive sidebar for the login page.
 * Updates the inner HTML of the element with the ID "sidebar-responsive" to display the footer navigation menu,
 * including links for "Log in", "Privacy Policy", and "Legal Notice".
 */
function renderSidebarResponsive() {
  document.getElementById("sidebar-responsive").innerHTML = `
    <footer class="footer-nav">
        <div class="footer-left">
            <a href="./index.html">
                <button class="footer-btn">
                    <i class="fa-solid fa-right-to-bracket"></i>
                    <img src="/assets/img/Icons.svg" alt="Log in Icon" />
                    <span>Log In</span>
                </button>
            </a>
        </div>
        <div class="footer-buttons">
            <a href="./privacy-login.html">
                <button class="footer-btn">Privacy Policy</button>
            </a>
            <a href="./legal-login.html">
                <button class="footer-btn">Legal Notice</button>
            </a>
        </div>
    </footer>
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
  const allLinks = document.querySelectorAll(
    ".menu a, .sidbar-bottom a, .menu-responsive a, .footer-buttons a, .footer-left a"
  );
  allLinks.forEach((link) => {
    const href = link.getAttribute("href").split("/").pop();
    if (href === currentPage) {
      const button = link.querySelector("button");
      if (button) button.classList.add("active-button");
    }
  });
}
