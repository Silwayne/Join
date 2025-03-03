let leftContactsColumn = document.getElementById("left-contacts-page-column");
let firebaseAnswer;
let fireBase;
let users;
let user;
let contactDetailsArea;
let key;

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
  leftContactsColumn.innerHTML += "";
  users = fireBase.users;
  Object.keys(users).forEach((keyObj, indexOfUser) => {
    user = users[keyObj];
    key = keyObj;
    renderLeftColumnContactsTemplate(user, indexOfUser, key);
    createContactNameInitials(user, indexOfUser);
  });
}

function renderLeftColumnContactsTemplate(user, indexOfUser, key) {
  leftContactsColumn.innerHTML += `
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

function renderRightContactArea(name, email, phone, key) {
  contactDetailsArea.classList.add("show");
  let user = { name, email, phone };
  let rightContactNameArea = document.getElementById("big-user-name");
  let rightEmailArea = document.getElementById("user-email");
  let rightPhoneArea = document.getElementById("user-phone-number");
  rightPhoneArea.innerText = user.phone;
  let rightDeleteButton = document.getElementById("contact-to-trash");
  rightEmailArea.innerHTML = email;
  rightEmailArea.href = `mailto:${email}`;
  rightContactNameArea.innerHTML = name;
  rightDeleteButton.onclick = () => deleteContactFromDatabase(key);
  createBigContactNameInitials(user);
}

function renderLeftColumnContactsTemplate(user, indexOfUser, key) {
  leftContactsColumn.innerHTML += `
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
          <p class="user-name" id="user-name-index">
            ${user.name}
          </p>
          <p class="user-email">${user.email}</p>
        </div>
      </div>
    </div>`;
}

async function deleteContactFromDatabase(key) {
  let deleteFirebaseUrl = `https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`;
  try {
    await fetch(deleteFirebaseUrl, {
      method: "DELETE",
    });
    alert("Contact successfully deleted!");
    location.reload();
  } catch (error) {
    console.error("Error deleting contact:", error);
    alert("Failed to delete contact. Please try again.");
  }
}

function editContact(key, user) {
  let body = document.getElementById("overlayArea");
  body.innerHTML += `
    <div onclick="closeEditOverlay()" id="outer-edit-contact-overlay">
      <div onclick="stopPropagation(event)" id="edit-contact-overlay">
        <div id="left-edit-contact-column">
          <img id="overlay-join-logo" src="/assets/img/Capa 2.svg" alt="" />
          <h1 id="edit-contact-heading">Edit contact</h1>
        </div>
        <div id="right-edit-contact-column">
          <div class="new-contact-icon">
            <img src="/assets/img/new-contact-icon.svg" alt="" />
          </div>
          <div id="edit-contact-options">
            <form action="" class="edit-contact-form">
              <input type="text" id="fullName" placeholder="${user.name}" />
              <input type="email" id="new-email" placeholder="${user.email}" required />
              <input type="tel" id="new-phone" placeholder="${user.phone}" />
            </form>
            <div id="button-area">
              <button onclick="deleteContactFromDatabase(key)" id="cancel-edit-contact" class="edit-contacts-overlay-btns">
                Delete</button
              ><button onclick="saveEditedContact(key)" class="edit-contacts-overlay-btns">
                Save ✓
              </button>
            </div>
          </div>
        </div>
      </div>`;
}

function saveEditedContact(key) {
  console.log(key);
}

function stopPropagation(event) {
  event.stopPropagation();
}

function displayPhoneNumber(user) {
  let phoneNumberArea = document.getElementById("user-phone-number");
  phoneNumberArea.innerText = user.phone;
  console.log(user.phone);
}
