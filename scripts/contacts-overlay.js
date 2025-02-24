function displayAddContactOverlay() {
  let body = document.getElementById("overlayArea");
  body.innerHTML += `
    <div id="outer-add-contact-overlay">
      <div id="add-contact-overlay">
        <div id="left-add-contact-column">
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
  let newFullName = document.getElementById("fullName").value;
  let newEmail = document.getElementById("new-email").value;
  let newPhone = document.getElementById("new-phone").value;
  await fetch(firebaseURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newFullName, newEmail, newPhone }),
  });
  contactSucessfullyAddedNotification();
}

function contactSucessfullyAddedNotification() {
  let displayArea = document.getElementById("right-contacts-page-column");
  displayArea.innerHTML += `<div id="success-notification">Contact was sucessfully added to database.</div>`;
}

function closeOverlay() {
  let overlay = document.getElementById("outer-add-contact-overlay");
  overlay.remove();
}
