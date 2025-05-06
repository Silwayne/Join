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
 * Includes JavaScript validation for form inputs with feedback messages.
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
              <form id="addContactForm" class="add-contact-form" onsubmit="return validateAndSubmitForm(event)">
                <div class="input-group">
                  <input type="text" id="fullName" placeholder="Name" />
                  <img class="icon" src="/assets/img/person.svg">
                  <small class="error-message"></small>
                </div>
                <div class="input-group">
                  <input id="new-email" placeholder="E-Mail" />
                  <img class="icon" src="/assets/img/mail.svg">
                  <small class="error-message"></small>
                </div>
                <div class="input-group">
                  <input type="tel" id="new-phone" placeholder="Phone" />
                  <img class="icon" src="/assets/img/call.svg">
                  <small class="error-message"></small>
                </div>
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
        </div>
      </div>`;
}

/**
 * Validates the form inputs and provides feedback for invalid fields.
 * If all inputs are valid, the form is submitted.
 * @param {Event} event - The submit event from the form.
 * @returns {boolean} - Returns false to prevent default form submission if validation fails.
 */
function validateAndSubmitForm(event) {
  event.preventDefault();

  const formId = event.target.id;
  const key = event.target.getAttribute("data-key"); // Schlüssel aus dem Formular holen

  let isValid = true;

  // Validierung der Eingabefelder
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("new-email");
  const phone = document.getElementById("new-phone");

  if (!fullName.value.trim()) {
    showError(fullName, "Name is required.");
    isValid = false;
  } else {
    clearError(fullName);
  }

  if (!validateEmail(email.value.trim())) {
    showError(email, "Please enter a valid email address.");
    isValid = false;
  } else {
    clearError(email);
  }

  if (phone.value.trim() && !validatePhone(phone.value.trim())) {
    showError(phone, "Please enter a valid phone number.");
    isValid = false;
  } else {
    clearError(phone);
  }

  // Wenn die Eingaben gültig sind, Aktion ausführen
  if (isValid) {
    if (formId === "addContactForm") {
      addContactToDatabase(event);
    } else if (formId === "editContactForm") {
      saveEditedContact(key); // Schlüssel an die Funktion übergeben
    }
  }

  return false;
}

/**
 * Displays an error message and highlights the input field with a red border.
 * @param {HTMLElement} input - The input element to highlight.
 * @param {string} message - The error message to display.
 */
function showError(input, message) {
  const inputGroup = input.parentElement;
  const errorMessage = inputGroup.querySelector(".error-message");
  errorMessage.textContent = message;
  errorMessage.classList.add("visible");
  input.style.border = "2px solid red";

  // Entferne die Fehlermeldung und den roten Rahmen bei Eingabe
  input.addEventListener("input", () => {
    clearError(input);
  });
}

/**
 * Clears the error message and removes the red border from the input field.
 * @param {HTMLElement} input - The input element to clear.
 */
function clearError(input) {
  const inputGroup = input.parentElement;
  const errorMessage = inputGroup.querySelector(".error-message");
  errorMessage.textContent = "";
  errorMessage.classList.remove("visible");
  input.style.border = "2px solid #ccc";
}

/**
 * Validates an email address using a regular expression.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number using a regular expression.
 * Allows numbers with an optional '+' at the beginning and spaces.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - Returns true if the phone number is valid, otherwise false.
 */
function validatePhone(phone) {
  const phoneRegex = /^\+?[0-9\s]{10,15}$/; // Optional '+' at the start, allows digits and spaces
  return phoneRegex.test(phone);
}

/**
 * Displays the overlay for editing an existing contact.
 * Dynamically generates the HTML for the overlay and populates it with the contact's current details.
 * @param {string} key - The unique key of the contact to edit.
 * @param {Object} users - The list of all users.
 */
function editContactOverlay(key, users) {
  let user = users[key];

  let realBody = document.getElementById("body");
  realBody.style.overflow = "hidden";
  let body = document.getElementById("overlayArea");
  body.innerHTML = `
      <div onclick="closeEditOverlay()" id="outer-edit-contact-overlay">
        <div onclick="stopPropagation(event)" id="edit-contact-overlay">
          <div id="left-edit-contact-column" onclick="stopPropagation(event)">
            <button id="closeEditOverlay" onclick="closeEditOverlay()">X</button>
            <h1 id="edit-contact-heading">Edit contact</h1>
            <img id="overlay-join-logo" src="/assets/img/Capa 2.svg" alt="" />
          </div>
          <div id="right-edit-contact-column">
            <div class="new-contact-icon">
              <img src="/assets/img/new-contact-icon.svg"/>
            </div>
            <div id="edit-contact-options">
              <form id="editContactForm" data-key="${key}" class="edit-contact-form" onsubmit="return validateAndSubmitForm(event)">
                <div class="input-group">
                  <input type="text" id="fullName" value="${user.name}" placeholder="Name" />
                  <img class="icon" src="/assets/img/person.svg">
                  <small class="error-message"></small>
                </div>
                <div class="input-group">
                  <input id="new-email" value="${user.email}" placeholder="E-Mail" />
                  <img class="icon" src="/assets/img/mail.svg">
                  <small class="error-message"></small>
                </div>
                <div class="input-group">
                  <input type="tel" id="new-phone" value="${user.phone}" placeholder="Phone" />
                  <img class="icon" src="/assets/img/call.svg">
                  <small class="error-message"></small>
                </div>
                <div id="button-area">
                  <button type="button" onclick="deleteContactFromDatabase('${key}', users)" id="cancel-edit-contact" class="edit-contacts-overlay-btns">
                    Delete
                  </button>
                  <button type="submit" class="edit-contacts-overlay-btns">
                    Save ✓
                  </button>
                </div>
              </form>
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
  if (!paramKey || !users || !users[paramKey]) {
    console.error("Invalid paramKey or users data");
    return;
  }

  let buttonOverlayArea = document.getElementById("button-overlay-area");
  if (!buttonOverlayArea) {
    console.error("Button overlay area not found");
    return;
  }

  let mobileOverlayButton = document.getElementById("overlayButton");
  mobileOverlayButton.remove();

  // Entferne vorherige Overlays, falls vorhanden
  let existingOverlay = document.getElementById("mobileEditOptions");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Füge das Overlay hinzu
  buttonOverlayArea.innerHTML = `
    <div onclick="closeResponsiveOverlay('${paramKey}')" class="mobileOverlay" id="mobileEditOptions">
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
