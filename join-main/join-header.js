function renderHeader(){
    document.getElementById('header').innerHTML = `
    <img class="logo-responsive" src="/assets/img/Capa 1.svg" alt="Logo">
        <span class="headline">Kanban Project Management Tool</span>
    <div class="header-right">
      <a href="/texte/help.html"><img class="help-button" src="/assets/img/help.svg" alt="Help"></a>
      <span id="current-user-initials" class="user">G</span>
    </div>
    `
}

