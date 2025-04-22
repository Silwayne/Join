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

function contactDetailsAreaTemplate() {
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
                      onclick="editContact(key, user)"
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
                      onclick="deleteContactFromDatabase(key)"
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

function editContactOverlay(key, users) {
  let user = users[key];
  if (!user) {
    console.error("Benutzer nicht gefunden");
    return;
  }
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
                <input type="text" id="fullName" value="${user.name}" placeholder="${user.name}" required />
                  <img class="icon" src="/assets/img/person.svg">
                <input type="email" id="new-email" value="${user.email}" placeholder="${user.email}" required />
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

function mobileEditOptions(key, users) {
  let buttonOverlayArea = document.getElementById("button-overlay-area");
  buttonOverlayArea.innerHTML = `<div onclick="closeResponsiveOverlay()" class="mobileOverlay" id="mobileEditOptions">
    <div id="small-responsive-overlay-options">
      <button class="responsiveButton" onclick="editContactOverlay('${key}', users)"><img id="edit-icon" src="/assets/img/edit-icon.svg">Edit</button>
      <button id="deleteMobileButton" class="responsiveButton" onclick="deleteContactFromDatabase('${key}', users)"><img id="trash-icon" src="/assets/img/trash-icon.svg">Delete</button>
    </div>
  </div>`;
  let overlayButton = document.getElementById("overlayButton");
  if (overlayButton) {
    overlayButton.remove();
  }
}
