/**
 * Renders the header for the application.
 * Updates the inner HTML of the element with the ID "header" to display the logo and headline.
 */

function renderHeader(){
    document.getElementById('header').innerHTML = `
    <img class="logo-responsive" src="./assets/img/Capa 1.svg" alt="Logo">
        <span class="headline">Kanban Project Management Tool</span>
    `
}