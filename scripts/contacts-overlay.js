function displayAddContactOverlay() {
  let body = document.getElementById("overlayArea");
  let realBody = document.getElementById("body");
  realBody.style.overflow = "hidden";
  body.innerHTML += `
    <div onclick="closeAddContactOverlay()" id="outer-add-contact-overlay">
      <div onclick="stopPropagation(event)" id="add-contact-overlay">
        <div id="left-add-contact-column">
          <button id="closeOverlayButton" onclick="closeOverlay()" onclick="closeOverlay()">X</button>
          <img id="overlay-join-logo" src="/assets/img/Capa 2.svg" alt="" />
          <h1 id="add-contact-heading">Add contact</h1>
          <h2>Tasks are better with a team!</h2>
        </div>
        <div id="right-add-contact-column">
          <div class="new-contact-icon">
            <img src="/assets/img/new-contact-icon.svg" alt="" />
          </div>
          <div id="add-contact-options">
            <form action="" class="add-contact-form">
              <input type="text" id="fullName" placeholder="First and second name" />
              <input type="email" id="new-email" placeholder="E-Mail" required />
              <input type="tel" id="new-phone" placeholder="Phone" />
            </form>
            <div id="button-area">
              <button onclick="closeOverlay()" id="cancel-add-contact" class="add-contacts-overlay-btns">
                Cancel X</button
              ><button onclick="addContactToDatabase()" class="add-contacts-overlay-btns">
                Create contact ✓
              </button>
            </div>
          </div>
        </div>
      </div>`;
}

async function addContactToDatabase() {
  let firebaseURL =
    "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users.json";
  let name = document.getElementById("fullName").value;
  let email = document.getElementById("new-email").value;
  let phone = document.getElementById("new-phone").value;
  await fetch(firebaseURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone }),
  });
  contactsuccessfullyAddedNotification();
  closeAddContactOverlay();
}

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

function contactsuccessfullyAddedNotification() {
  let displayArea = document.getElementById("contact-details-area");
  displayArea.innerHTML += `<div class="success-notifications" id="success-notification">Contact was successfully added to database.</div>`;
  hideSuccessMessage();
}

function contactsuccessfullyEditedNotification() {
  let displayArea = document.getElementById("contact-details-area");
  displayArea.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully edited and saved.</div>`;
  hideSuccessMessage();
}

function contactsuccessfullyDeletedNotification() {
  let displayArea = document.getElementById("contact-details-area");
  displayArea.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully eliminated.</div>`;
  hideSuccessMessage();
}

function hideSuccessMessage() {
  let message = document.getElementById("success-notification");
  setTimeout(() => {
    message.remove();
  }, 2500);
}
