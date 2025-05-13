/**
 * @file contacts-overlays.js
 * @description This file contains functions for managing and closing various overlays in the contacts section, as well as displaying success notifications for actions like adding, editing, or deleting contacts.
 */

/**
 * Closes the "Add Contact" overlay.
 * Removes the overlay from the DOM and restores the page's scroll functionality.
 */
function closeOverlay() {
  let overlay = document.getElementById("outer-add-contact-overlay");
  overlay.remove();
}

/**
 * Closes the "Edit Contact" overlay.
 * Removes the overlay from the DOM and restores the page's scroll functionality.
 */
function closeEditOverlay() {
  let editOverlay = document.getElementById("outer-edit-contact-overlay");
  editOverlay.remove();
  let realBody = document.getElementById("body");
  realBody.style.overflow = "auto";
}

/**
 * Closes the "Add Contact" overlay.
 * Removes the overlay from the DOM and restores the page's scroll functionality.
 */
function closeAddContactOverlay() {
  let addContactOverlay = document.getElementById("outer-add-contact-overlay");
  addContactOverlay.remove();
  let realBody = document.getElementById("body");
  realBody.style.overflow = "auto";
}

/**
 * Displays a success notification when a contact is successfully edited.
 * Updates the contact details area with a success message and reloads the page after 2 seconds.
 */
function contactsuccessfullyEditedNotification() {
  let displayArea = document.getElementById("contact-details-area");
  displayArea.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully edited and saved.</div>`;
  hideSuccessMessage();
  setTimeout(function () {
    window.location.reload();
  }, 2000);
}

/**
 * Displays a success notification when a contact is successfully deleted.
 * Updates the contact details area with a success message.
 */
function contactsuccessfullyDeletedNotification() {
  let displayArea = document.getElementById("contact-details-area");
  displayArea.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully deleted.</div>`;
  if (window.innerWidth < 1250) {
    setTimeout(function () {
      window.location.reload();
    }, 2000);
  }
}

/**
 * Displays a success notification when a contact is successfully added.
 * Updates the UI with a success message depending on the screen size.
 * For smaller screens, the message is displayed in the left column.
 * For larger screens, the message is displayed in the contact details area.
 */
function contactsuccessfullyAddedNotification() {
  if (window.innerWidth < 1250) {
    let displayAreaMobile = document.getElementById(
      "left-contacts-page-column"
    );
    displayAreaMobile.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully created.</div>`;
  }
  if (window.innerWidth > 1250) {
    let displayArea = document.getElementById("contact-details-area");
    displayArea.style.display = "flex";
    displayArea.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully created.</div>`;
  }
  hideSuccessMessage();
}

/**
 * Hides the success notification after a delay of 2.5 seconds.
 * Removes the success message from the DOM.
 */
function hideSuccessMessage() {
  let message = document.getElementById("success-notification");
  setTimeout(() => {
    message.remove();
  }, 2500);
}

/**
 * Closes the responsive overlay and restores the mobile edit options button.
 * Removes the overlay button and area, then re-adds the button to the contact div.
 * @param {string} paramKey - The parameter key for the mobile edit options.
 * @param {Array} users - The list of users.
 */
function closeResponsiveOverlay(paramKey, users) {
  let overlayButton = document.getElementById("overlayButton");
  if (overlayButton) {
    overlayButton.remove();
  }

  let overlayArea = document.getElementById("mobileEditOptions");
  if (overlayArea) {
    overlayArea.remove();
  }

  let contactDiv = document.getElementById("contact-div");
  contactDiv.innerHTML += `
    <div id="button-overlay-area">
      <button onclick="mobileEditOptions('${paramKey}', users)" id="overlayButton">
        <img id="three-dots-options" src="/assets/img/three_dots.svg">
      </button>
    </div>`;
}

/**
 * Closes the responsive overlay for mobile view.
 * Removes the overlay button and restores the original UI state.
 * @param {string} paramKey - The unique key of the contact.
 */
function closeResponsiveOverlay(paramKey) {
  let overlayButton = document.getElementById("overlayButton");
  if (overlayButton) {
    overlayButton.remove();
  }

  let overlayArea = document.getElementById("mobileEditOptions");
  if (overlayArea) {
    overlayArea.remove();
  }

  let contactDiv = document.getElementById("contact-div");
  contactDiv.innerHTML += `<div id="button-overlay-area"><button onclick="mobileEditOptions('${paramKey}', user)" id="overlayButton"><img id="three-dots-options" src="/assets/img/three_dots.svg"></button></div>`;
}
let leftColumn = document.getElementById("left-contacts-page-column");
let buttonOverlayArea = document.getElementById("button-overlay-area");
if (leftColumn && buttonOverlayArea) {
  buttonOverlayArea.remove();
}

if (buttonOverlayArea) {
  buttonOverlayArea.remove();
}

/**
 * Handles the overlay button for mobile view.
 * Adds a button to the contact details area for additional options.
 * @param {string} paramKey - The unique key of the contact.
 * @param {Object} users - The list of all users.
 */
function handleOverlayButton(paramKey, users) {
  let contactDiv = document.getElementById("contact-div");
  if (!contactDiv) {
    console.error("Contact div not found");
    return;
  }
  let existingButton = document.getElementById("overlayButton");
  if (existingButton) {
    existingButton.remove();
  }
  contactDiv.innerHTML += `
    <div id="button-overlay-area">
      <button onclick="mobileEditOptions('${paramKey}', users)" id="overlayButton">
        <img id="three-dots-options" src="/assets/img/three_dots.svg">
      </button>
    </div>`;
}

let overlayButton = document.getElementById("overlayButton");
if (overlayButton) {
  overlayButton.remove();
}
