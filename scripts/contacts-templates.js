/**
 * @file contacts-templates.js
 * @description This file contains the templates and rendering logic for managing the UI of the contacts section, including the left column contact list, contact details area, and overlays for adding or editing contacts.
 */

/**
 * Renders a single contact in the left column contact list.
 * @param {Object} user - The user object containing contact details.
 * @param {number} indexOfUser - The index of the user in the list.
 * @param {string} key - The unique key of the user.
 */
function renderLeftColumnContactsTemplate(user, indexOfUser, key) {
  leftContactsList.innerHTML += `
      <div
        class="contact-list"
        onclick='renderRightContactArea("${user.name}", "${user.email}", "${user.phone}", "${key}", users)'
        id="user${indexOfUser}"
      >
        <div class="user-area">
          <div class="user-picture">
            <div
              id="user-icon${indexOfUser}"
              class="user-initials user-icon"
            ></div>
          </div>
          <div class="user-info">
            <p class="user-name">${user.name}</p>
            <p class="user-email">${user.email}</p>
          </div>
        </div>
      </div>`;
}

/**
 * Displays the contact details area for a selected contact.
 * Updates the UI with the contact's information.
 * @param {string} paramKey - The unique key of the contact.
 * @param {Object} users - The list of all users.
 */
function contactDetailsAreaTemplate(paramKey, users) {
  let contactDetailsArea = document.getElementById("contact-details-area");
  contactDetailsArea.classList.add("show");
  contactDetailsArea.innerHTML = `            
              <div class="user-name-header">
                <div id="user-picture-big-index" class="user-picture-big">
                  Userimage
                </div>
                <div class="user-name-area">
                  <div id="big-user-name" class="big-user-name">User Name</div>
                  <div id="user-name-options" class="user-name-options">
                    <a
                      id="contact-edit"
                      onclick="editContactOverlay('${paramKey}', users)"
                      class="edit-options"
                      ><img
                        class="option-icon"
                        src="/assets/img/edit-icon.svg"
                      />
                      Edit</a
                    >
                    <a
                      id="contact-to-trash"
                      class="edit-options"
                      onclick="deleteContactFromDatabase('${paramKey}', users)"
                      ><img
                        class="option-icon"
                        src="/assets/img/trash-icon.svg"
                      />
                      Delete</a
                    >
                  </div>
                </div>
              </div>
              <h3 class="contact-information">Contact Information</h3>
              <div class="contact-details">
                <h4>E-Mail</h4>
                <br />
                <a id="user-email" class="user-email">user@name.com</a>
                <h4 class="phone-number">Phone</h4>
                <br />
                <p id="user-phone-number" class="user-phone-number"></p>
                <br />
              </div>
            </div>`;
}

/**
 * Displays the overlay for adding a new contact.
 * Dynamically generates the HTML for the overlay and appends it to the DOM.
 */
function displayAddContactOverlay() {
  let body = document.getElementById("overlayArea");
  let realBody = document.getElementById("body");
  realBody.style.overflow = "hidden";
  body.innerHTML += `
      <div onclick="closeAddContactOverlay()" id="outer-add-contact-overlay">
        <div onclick="stopPropagation(event)" id="add-contact-overlay">
          <div id="left-add-contact-column">
          <div id="add-contact-header-area">
            <img id="overlay-join-logo" src="/assets/img/Capa 2.svg" alt="" />
            <h1 id="add-contact-heading">Add contact</h1>
            <h2>Tasks are better with a team!</h2>
          </div>
          <div><button id="closeOverlayButton" onclick="closeOverlay()">X</button></div>
          </div>
          <div id="right-add-contact-column">
            <div class="new-contact-icon">
              <img src="/assets/img/new-contact-icon.svg" alt="" />
            </div>
            <div id="add-contact-options">
             <form id="addContactForm" class="add-contact-form" onsubmit="return addContactToDatabase(event)">
                <input required type="text" id="fullName" placeholder="First and second name" />
                <img class="icon" src="/assets/img/person.svg">
                <input type="email" id="new-email" placeholder="E-Mail" />
                <img class="icon" src="/assets/img/mail.svg">
                <input type="tel" id="new-phone" placeholder="Phone" />
                <img class="icon" src="/assets/img/call.svg">
                <div class="create-contact-btn" id="button-area">
                  <button type="button" onclick="closeOverlay()" id="cancel-add-contact" class="add-contacts-overlay-btns">
                    Cancel X
                  </button>
                  <button type="submit" id="create-contact" class="add-contacts-overlay-btns">
                    Create contact ✓
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>`;
}

/**
 * Displays the overlay for editing an existing contact.
 * Dynamically generates the HTML for the overlay and populates it with the contact's current details.
 * @param {string} key - The unique key of the contact to edit.
 * @param {Object} users - The list of all users.
 */
function editContactOverlay(key, users) {
  console.log("editContactOverlay called with key:", key); // Debug-Ausgabe
  console.log("Users object:", users); // Debug-Ausgabe

  if (!key) {
    alert("The selected contact could not be found. Please try again.");
    console.error("Key is undefined or invalid");
    return;
  }

  if (!users || Object.keys(users).length === 0) {
    console.error("Users data not loaded yet");
    alert("User data is not available. Please try again later.");
    return;
  }

  let user = users[key];
  if (!user) {
    alert("The selected contact could not be found. Please try again.");
    console.error("User not found for key:", key);
    return;
  }

  console.log("User found:", user); // Debug-Ausgabe

  let realBody = document.getElementById("body");
  realBody.style.overflow = "hidden";
  let body = document.getElementById("overlayArea");
  body.innerHTML = `
      <div onclick="closeEditOverlay()" id="outer-edit-contact-overlay">
        <div onclick="stopPropagation(event)" id="edit-contact-overlay">
          <div id="closeEditOverlay" id="left-edit-contact-column">
            <button id="closeEditOverlay" onclick="closeEditOverlay()">X</button>
            <img id="overlay-join-logo" src="/assets/img/Capa 2.svg" alt="" />
            <h1 id="edit-contact-heading">Edit contact</h1>
          </div>
          <div id="right-edit-contact-column">
            <div class="new-contact-icon">
              <img src="/assets/img/new-contact-icon.svg"/>
            </div>
            <div id="edit-contact-options">
              <form action="" class="edit-contact-form">
                <input required type="text" id="fullName" value="${user.name}" placeholder="${user.name}" />
                  <img class="icon" src="/assets/img/person.svg">
                <input type="email" id="new-email" value="${user.email}" placeholder="${user.email}" />
                  <img class="icon" src="/assets/img/mail.svg">
                <input type="tel" id="new-phone" value="${user.phone}" placeholder="${user.phone}" />
                  <img class="icon" src="/assets/img/call.svg">
              </form>
              <div id="button-area">
                <button onclick="deleteContactFromDatabase('${key}', users)" id="cancel-edit-contact" class="edit-contacts-overlay-btns">
                  Delete</button
                ><button onclick="saveEditedContact('${key}')" class="edit-contacts-overlay-btns">
                  Save ✓
                </button>
              </div>
            </div>
          </div>
        </div>`;
}

/**
 * Displays the mobile edit options overlay for a contact.
 * Dynamically generates the HTML for the overlay and appends it to the DOM.
 * @param {string} paramKey - The unique key of the contact.
 * @param {Object} users - The list of all users.
 */
function mobileEditOptions(paramKey, users) {
  console.log("mobileEditOptions called with paramKey:", paramKey); // Debug-Ausgabe
  console.log("Users object:", users); // Debug-Ausgabe

  if (!paramKey || !users || !users[paramKey]) {
    console.error("Invalid paramKey or users data");
    alert("The selected contact could not be found. Please try again.");
    return;
  }

  let buttonOverlayArea = document.getElementById("button-overlay-area");
  if (!buttonOverlayArea) {
    console.error("Button overlay area not found");
    return;
  }

  // Entferne vorherige Overlays, falls vorhanden
  let existingOverlay = document.getElementById("mobileEditOptions");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Füge das Overlay hinzu
  buttonOverlayArea.innerHTML = `
    <div onclick="closeResponsiveOverlay()" class="mobileOverlay" id="mobileEditOptions">
      <div id="small-responsive-overlay-options">
        <button class="responsiveButton" onclick="editContactOverlay('${paramKey}', users)">
          <img id="edit-icon" src="/assets/img/edit-icon.svg">Edit
        </button>
        <button id="deleteMobileButton" class="responsiveButton" onclick="deleteContactFromDatabase('${paramKey}', users)">
          <img id="trash-icon" src="/assets/img/trash-icon.svg">Delete
        </button>
      </div>
    </div>`;
}
