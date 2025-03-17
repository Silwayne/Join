let leftContactsList = document.getElementById("left-contact-list");
let firebaseAnswer;
let fireBase;
let users;
let user;
let contactDetailsArea;
let key;
let colours = [
  "#FF7A00",
  "#9327FF",
  "#6E52FF",
  "#FC71FF",
  "#FFBB2B",
  "#1FD7C1",
  "#462F8A",
  "#FF4646",
  "#00BEE8",
  "#FF7A00",
];

async function contactFirebase() {
  let firebaseUrl = await fetch(
    "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/.json"
  );
  firebaseAnswer = await firebaseUrl.json();
  fireBase = firebaseAnswer;
  renderLeftColumnContacts();
}

contactFirebase();

function renderLeftColumnContacts() {
  leftContactsList.innerHTML = "";
  users = fireBase.users;
  let lastInitial = "";
  Object.keys(users)
    .sort((a, b) => users[a].name.localeCompare(users[b].name))
    .forEach((keyObj, indexOfUser) => {
      user = users[keyObj];
      key = keyObj;
      let initial = user.name.charAt(0).toUpperCase();
      if (initial !== lastInitial) {
        leftContactsList.innerHTML += `
          <div class="contact-separator">
            <span class="contact-initial">${initial}</span>
            <div class="contact-divider"></div>
          </div>`;
        lastInitial = initial;
      }
      renderLeftColumnContactsTemplate(user, indexOfUser, key);
      createContactNameInitials(user, indexOfUser);
    });

  applyRandomColors();
}

function renderLeftColumnContactsTemplate(user, indexOfUser, key) {
  leftContactsList.innerHTML += `
<div class="contact-list" onclick='renderRightContactArea("${user.name}", "${
    user.email
  }", "${key}")' id="user${indexOfUser}">
            <div class="user-area">
              <div class="user-picture">
                <div id="user-icon${[
                  indexOfUser,
                ]}" class="user-initials user-icon"></div>
              </div>
              <div class="user-info">
                <p class="user-name" id="user-name-index">${user.name}</p>
                <p class="user-email">${user.email}</p>
              </div>
            </div>
          </div>`;
}

function createContactNameInitials(user, indexOfUser) {
  let userName = user.name;
  let userImage = document.getElementById(`user-icon${indexOfUser}`);
  if (!userName) {
    return;
  }
  let firstLetterOfUserName = userName.charAt(0);
  if (userName.split(" ")[1] === undefined) {
    userImage.innerHTML = `${firstLetterOfUserName}`;
    return;
  }
  let secondLetterOfUserName = userName.split(" ")[1][0];
  if (secondLetterOfUserName != undefined) {
    userImage.innerHTML = `${firstLetterOfUserName}${secondLetterOfUserName}`;
  }
  userImage.classList.add("user-initials");
}

function rightContactDetailsHideOnLoad() {
  contactDetailsArea = document.getElementById("contact-details-area");
  contactDetailsArea.classList.add("hide");
}

function createBigContactNameInitials(user) {
  let userName = user.name;
  let firstLetterOfUserName = userName.charAt(0);
  let bigCredentialsArea = document.getElementById("user-picture-big-index");
  if (userName.split(" ")[1] === undefined) {
    bigCredentialsArea.innerHTML = `${firstLetterOfUserName}`;
  }
  if (userName.split(" ")[1] != undefined) {
    let secondLetterOfUserName = userName.split(" ")[1][0];
    if (secondLetterOfUserName) {
      bigCredentialsArea.innerHTML = `${firstLetterOfUserName}${secondLetterOfUserName}`;
    }
  }
}

function hideContactDetails() {
  let rightColumn = document.getElementById("right-contacts-page-column");
  let leftColumn = document.getElementById("left-contacts-page-column");
  rightColumn.style.display = "none";
  leftColumn.style.display = "block";
}

function renderRightContactArea(name, email, phone, key) {
  if (window.innerWidth < 1440) {
    let rightColumn = document.getElementById("right-contacts-page-column");
    let leftColumn = document.getElementById("left-contacts-page-column");
    let userContactHeader = document.getElementById("user-contact-header");
    userContactHeader.innerHTML = `<button class="go-back-arrow" onclick="hideContactDetails()">
                                  <img src="/assets/img/back-arrow.svg">
                                 </button>`;
    leftColumn.style.display = "none";
    rightColumn.style.display = "block";
    let contactDiv = document.getElementById("contact-div");
    contactDiv.innerHTML += `<div id="button-overlay-area"><button onclick="mobileEditOptions(${key})" id="overlayButton"><img id="three-dots-options" src="/assets/img/three_dots.svg"></button></div>`;
  }
  if (window.innerWidth > 1440) {
    let overlayButton = document.getElementById("overlayButton");
    if (overlayButton) {
      overlayButton.style.display = "none";
    }
  }

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
  hideContactOptionsForMobile();
  let rightContactNameArea = document.getElementById("big-user-name");
  let rightEmailArea = document.getElementById("user-email");
  let rightPhoneArea = document.getElementById("user-phone-number");
  let rightDeleteButton = document.getElementById("contact-to-trash");
  let rightEditButton = document.getElementById("contact-edit");
  rightPhoneArea.innerText = phone;
  rightEmailArea.innerHTML = `${email}<br>`;
  rightEmailArea.href = `mailto:${email}`;
  rightContactNameArea.innerText = name;
  rightDeleteButton.onclick = function () {
    deleteContactFromDatabase(key);
  };
  rightEditButton.onclick = function () {
    editContact(key, { name, email, phone });
  };
  createBigContactNameInitials({ name, email, phone });
  bigRandomColour();
}

function renderLeftColumnContactsTemplate(user, indexOfUser, key) {
  leftContactsList.innerHTML += `
    <div
      class="contact-list"
      onclick='renderRightContactArea("${user.name}", "${user.email}", "${user.phone}", "${key}")'
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

async function deleteContactFromDatabase(key) {
  let deleteFirebaseUrl = `https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`;
  try {
    await fetch(deleteFirebaseUrl, { method: "DELETE" });
    contactsuccessfullyDeletedNotification();
    delete users[key];
    renderLeftColumnContacts();
  } catch (error) {
    console.error("Error deleting contact:", error);
    alert("Failed to delete contact. Please try again.");
  }
  if (editContactOverlay) {
    closeEditOverlay();
  }
}

function editContact(key) {
  let user = users[key];
  editContactOverlay(key, user);
}

function editContactOverlay(key, user) {
  let body = document.getElementById("overlayArea");
  let realBody = document.getElementById("body");
  realBody.style.overflow = "hidden";
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
              <button onclick="deleteContactFromDatabase('${key}')" id="cancel-edit-contact" class="edit-contacts-overlay-btns">
                Delete</button
              ><button onclick="saveEditedContact('${key}')" class="edit-contacts-overlay-btns">
                Save ✓
              </button>
            </div>
          </div>
        </div>
      </div>`;
}

async function saveEditedContact(key) {
  console.log(key);
  let name = document.getElementById("fullName").value;
  let email = document.getElementById("new-email").value;
  let phone = document.getElementById("new-phone").value;
  let editFirebaseUrl = `https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`;
  await fetch(editFirebaseUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone }),
  });
  closeEditOverlay();
  contactsuccessfullyEditedNotification();
}

function stopPropagation(event) {
  event.stopPropagation();
}

function displayPhoneNumber(user) {
  let phoneNumberArea = document.getElementById("user-phone-number");
  phoneNumberArea.innerText = user.phone;
  console.log(user.phone);
}

function getRandomColor() {
  return colours[Math.floor(Math.random() * colours.length)];
}

function applyRandomColors() {
  let userPictures = document.getElementsByClassName("user-initials user-icon");
  Array.from(userPictures).forEach((element) => {
    element.style.backgroundColor = getRandomColor();
  });
}

function bigRandomColour() {
  let bigInitialsArea = document.getElementById("user-picture-big-index");
  if (bigInitialsArea) {
    bigInitialsArea.style.backgroundColor = getRandomColor();
  }
}

function hideContactOptionsForMobile() {
  let userNameOptions = document.getElementById("user-name-options");
  if (window.innerWidth < 1440) {
    userNameOptions.style.display = "none";
  }
}

function mobileEditOptions(key) {
  let buttonOverlayArea = document.getElementById("button-overlay-area");
  buttonOverlayArea.innerHTML = `<div onclick="closeResponsiveOverlay(${key})" class="mobileOverlay" id="mobileEditOptions(${key})">
                                  <div id="small-responsive-overlay-options">
                                    <button class="responsiveButton" onclick="editContactOverlay(key, user)"><img id="edit-icon" src="/assets/img/edit-icon.svg">Edit</button>
                                    <button class="responsiveButton" onclick="deleteContactFromDatabase(key)"><img id="trash-icon" src="/assets/img/trash-icon.svg">Delete</button>
                                   </div>
                                 </div>`;
}

function closeResponsiveOverlay(key) {
  let overlayArea = document.getElementById(`mobileEditOptions(${key})`);
  overlayArea.remove();
  mobileEditOptions(key);
}

if (window.innerWidth < 1440) {
  let editOptionsBtn = document.getElementById("edit-options-button");
  editOptionsBtn.style.display = "none";
}