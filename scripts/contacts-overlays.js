function closeOverlay() {
  let overlay = document.getElementById("outer-add-contact-overlay");
  overlay.remove();
}

function closeEditOverlay() {
  let editOverlay = document.getElementById("outer-edit-contact-overlay");
  editOverlay.remove();
  let realBody = document.getElementById("body");
  realBody.style.overflow = "auto";
}

function closeAddContactOverlay() {
  let addContactOverlay = document.getElementById("outer-add-contact-overlay");
  addContactOverlay.remove();
  let realBody = document.getElementById("body");
  realBody.style.overflow = "auto";
}

function contactsuccessfullyEditedNotification() {
  let displayArea = document.getElementById("contact-details-area");
  displayArea.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully edited and saved.</div>`;
  hideSuccessMessage();
  setTimeout(function () {
    window.location.reload();
  }, 2000);
}

function contactsuccessfullyDeletedNotification() {
  let displayArea = document.getElementById("contact-details-area");
  displayArea.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully eliminated.</div>`;
  // setTimeout(function () {
  //   window.location.reload();
  // }, 2000);
}

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

function hideSuccessMessage() {
  let message = document.getElementById("success-notification");
  setTimeout(() => {
    message.remove();
  }, 2500);
}
