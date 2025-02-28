function renderSidebar() {
  document.getElementById("sidbar").innerHTML = `
  
        <nav class="sidbar-nav">
            <div class="sidbar-top">
                <img class="sidbar-logo" src="/assets/img/Capa 2.svg" alt="Logo">
                <div class="menu">
                    <a href="/log-in.html">
                        <button class="menu-button menu-button-design font-size">
                            <img src="/assets/img/Icons.svg" alt="Log in Icon" />
                            <span>Log in</span>
                        </button>
                    </a>
                </div>
            </div>
            <div class="sidbar-bottom">
                <a href="privacy-login.html">
                    <button class="menu-button menu-button-lower-design font-size">
                      Privacy Policy
                    </button>
                </a>
                <a href="legal-login.html">
                  <button class="menu-button menu-button-lower-design font-size">
                      Legal Notice
                  </button>
                </a>
            </div>
        </nav>
  
  
  `;
}
