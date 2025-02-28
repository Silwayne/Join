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
  leftContactsColumn.innerHTML = "";
  users = fireBase.users;
  Object.keys(users).forEach((keyObj, indexOfUser) => {
    user = users[keyObj];
    key = keyObj;
    renderLeftColumnContactsTemplate(user, indexOfUser);
    createContactNameInitials(user, indexOfUser);
  });
}

function renderLeftColumnContactsTemplate(user, indexOfUser) {
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

// function renderRightContactArea(name, email, key) {
//   contactDetailsArea.classList.add("show");
//   let user = { name, email };

//   users = fireBase.users;
//   Object.keys(users).forEach((key, indexOfUser) => {
//     user = users[key];
//   });

//   let rightContactNameArea = document.getElementById("big-user-name");
//   let rightEmailArea = document.getElementById("user-email");
//   let rightDeleteButton = document.getElementById(`delete-${key}`);
//   rightEmailArea.innerHTML = `${email}`;
//   rightEmailArea.href = `mailto:${email}`;
//   rightContactNameArea.innerHTML = `${name}`;
//   createBigContactNameInitials(user);
//   let userPhoneNumber = document.getElementById("user-phone-number");
// }

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

// async function deleteContactFromDatabase(key) {
//   let deleteFirebaseUrl = await fetch(
//     `https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`,
//     { method: "DELETE" }
//   );
//   document.getElementById(`user${key}`)?.remove();
//   contactDetailsArea.classList.remove("show");
// }

function renderRightContactArea(name, email, key) {
  contactDetailsArea.classList.add("show");
  let user = { name, email };
  let rightContactNameArea = document.getElementById("big-user-name");
  let rightEmailArea = document.getElementById("user-email");
  let rightDeleteButton = document.getElementById("delete-contact-button");

  rightEmailArea.innerHTML = email;
  rightEmailArea.href = `mailto:${email}`;
  rightContactNameArea.innerHTML = name;

  // Löschbutton aktualisieren
  rightDeleteButton.innerHTML = `Delete Contact`;
  rightDeleteButton.onclick = () => deleteContactFromDatabase(key);

  createBigContactNameInitials(user);
}

function renderLeftColumnContactsTemplate(user, indexOfUser, key) {
  leftContactsColumn.innerHTML += `
    <div
      class="contact-list"
      onclick='renderRightContactArea("${user.name}", "${user.email}", "${key}")'
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

// function renderLeftColumnContacts() {
//   users = fireBase.users;
//   Object.keys(users).forEach((key, indexOfUser) => {
//     user = users[key];
//     renderLeftColumnContactsTemplate(user, indexOfUser, key);
//     createContactNameInitials(user, indexOfUser);
//   });
// }

async function deleteContactFromDatabase(key) {
  let deleteFirebaseUrl = `https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`;

  try {
    await fetch(deleteFirebaseUrl, {
      method: "DELETE",
    });
    alert("Contact successfully deleted!");
    // Seite neu laden, um die aktualisierte Kontaktliste anzuzeigen
    location.reload();
  } catch (error) {
    console.error("Error deleting contact:", error);
    alert("Failed to delete contact. Please try again.");
  }
}