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
  displayArea.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully eliminated.</div>`;
  // setTimeout(function () {
  //   window.location.reload();
  // }, 2000);
}

/**
 * Displays a success notification when a contact is successfully added.
 * Updates the UI with a success message depending on the screen size.
 * For smaller screens, the message is displayed in the left column.
 * For larger screens, the message is displayed in the contact details area.
 */
function contactsuccessfullyAddedNotification() {
  if (window.innerWidth < 1440) {
    let displayAreaMobile = document.getElementById(
      "left-contacts-page-column"
    );
    displayAreaMobile.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully born.</div>`;
  }
  if (window.innerWidth > 1440) {
    let displayArea = document.getElementById("contact-details-area");
    displayArea.style.display = "flex";
    displayArea.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully born.</div>`;
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
