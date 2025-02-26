function renderSidebar() {
  document.getElementById("sidbar").innerHTML = `

    <nav class="sidbar-nav">
        <div class="sidbar-top">
              <img class="sidbar-logo" src="/assets/img/Capa 2.svg" alt="Logo">
                <div class="menu">
                    <button class="menu-button menu-button-design font-size">
                      <img src="/assets/img/summary-icon.svg" alt="Summary">
                      <span>Summary</span>
                  </button>
                  <a href="/add-task/add-task.html">
                  <button class="menu-button menu-button-design font-size">
                      <img src="/assets/img/add_task_icon.svg" alt="Add Task">
                      <span>Add Task</span>
                  </button>
                  </a>
                  <a href="">
                  <button class="menu-button menu-button-design font-size">
                      <img src="/assets/img/board-icon.svg" alt="Board">
                      <span>Board</span>
                  </button>
                  </a>
                  <a href="/contacts.html">
                    <button class="menu-button menu-button-design font-size">
                        <img src="/assets/img/perm_contact_calendar.svg" alt="Contacts">
                        <span>Contacts</span>
                      </button>
                    </a>
                </div>
          </div>
          <div class="sidbar-bottom">
            <a href="privacy.html">
                <button class="menu-button menu-button-lower-design font-size">
                    Privacy Policy
                </button>
            </a>
            <a href="legal.html">
                <button class="menu-button menu-button-lower-design font-size">
                    Legal Notice
                </button>
            </a>
        </div>
    </nav>


`;
}
