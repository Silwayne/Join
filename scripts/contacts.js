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
  users = fireBase.users;
  renderLeftColumnContacts();
}

contactFirebase();

function renderLeftColumnContacts() {
  leftContactsList.innerHTML = "";
  users = fireBase.users;
  let lastInitial = "";
  let sortedUserKeys = Object.keys(users).sort((a, b) =>
    users[a].name.localeCompare(users[b].name)
  );
  sortedUserKeys.forEach((keyObj, indexOfUser) => {
    let user = users[keyObj];
    let initial = user.name.charAt(0).toUpperCase();
    if (initial !== lastInitial) {
      leftContactsList.innerHTML +=
        renderLeftColumnContactsInitalsTemplate(initial);
      lastInitial = initial;
    }
    renderLeftColumnPartTwo(user, indexOfUser, keyObj);
  });
}

function renderLeftColumnContactsInitalsTemplate(initial) {
  return `
        <div class="contact-separator">
          <span class="contact-initial">${initial}</span>
          <div class="contact-divider"></div>
        </div>`;
}

function renderLeftColumnPartTwo(user, indexOfUser, keyObj) {
  renderLeftColumnContactsTemplate(user, indexOfUser, keyObj);
  createContactNameInitials(user, indexOfUser);
  1;
  let userImage = document.getElementById(`user-icon${indexOfUser}`);
  if (userImage) {
    userImage.style.backgroundColor = user.color;
  }
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

function hideContactDetails(users) {
  let rightColumn = document.getElementById("right-contacts-page-column");
  let leftColumn = document.getElementById("left-contacts-page-column");
  rightColumn.style.display = "none";
  leftColumn.style.display = "block";
  let overlayButton = document.getElementById("overlayButton");
  overlayButton.style.display = "none";
}

function renderRightContactArea(name, email, phone, paramKey, users) {
  handleResponsiveView(paramKey, users);
  updateContactDetails(name, email, phone, paramKey, users);
  updateUserDetails(paramKey, users);
}

function handleResponsiveView(paramKey, users) {
  if (window.innerWidth < 1440) {
    let rightColumn = document.getElementById("right-contacts-page-column");
    let leftColumn = document.getElementById("left-contacts-page-column");
    let userContactHeader = document.getElementById("user-contact-header");
    rightColumn.style.display = "flex";
    userContactHeader.innerHTML = `<button class="go-back-arrow" onclick="hideContactDetails(users)">
                                    <img src="/assets/img/back-arrow.svg">
                                   </button>`;
    leftColumn.style.display = "none";
    rightColumn.style.display = "block";
    handleOverlayButton(paramKey, users);
  }
}

function handleOverlayButton(paramKey, users) {
  let contactDiv = document.getElementById("contact-div");
  if (!document.getElementById("overlayButton")) {
    contactDiv.innerHTML += `<div id="button-overlay-area">
       <button onclick="mobileEditOptions('${paramKey}', users)" id="overlayButton">
          <img id="three-dots-options" src="/assets/img/three_dots.svg">
       </button>
    </div>`;
  }
}

function updateContactDetails(name, email, phone, paramKey, users) {
  contactDetailsAreaTemplate();
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
    deleteContactFromDatabase(paramKey, users);
  };
  rightEditButton.onclick = function () {
    editContact(paramKey, users);
  };
}

function updateUserDetails(paramKey, users) {
  let user = users[paramKey];
  createBigContactNameInitials(user);
  bigRandomColour(user);
}

async function deleteContactFromDatabase(key, users) {
  let deleteFirebaseUrl = `https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`;
  try {
    await fetch(deleteFirebaseUrl, { method: "DELETE" });
    contactsuccessfullyDeletedNotification();
    delete users[key];
    renderLeftColumnContacts();
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}

function editContact(key, users) {
  let user = users[key];
  editContactOverlay(key, users);
}

function stopPropagation(event) {
  event.stopPropagation();
}

function displayPhoneNumber(user) {
  let phoneNumberArea = document.getElementById("user-phone-number");
  phoneNumberArea.innerText = user.phone;
}

function applyRandomColors() {
  let userPictures = document.getElementsByClassName("user-initials user-icon");
  Array.from(userPictures).forEach((element, index) => {
    let userKeys = Object.keys(users);
    let userKey = userKeys[index];
    element.style.backgroundColor = users[userKey].color;
  });
}

function bigRandomColour(user) {
  let bigInitialsArea = document.getElementById("user-picture-big-index");
  if (bigInitialsArea && user.color) {
    bigInitialsArea.style.backgroundColor = user.color;
  }
}

function hideContactOptionsForMobile() {
  let userNameOptions = document.getElementById("user-name-options");
  if (window.innerWidth < 1440) {
    userNameOptions.style.display = "none";
  }
}

function closeResponsiveOverlay() {
  let overlayButton = document.getElementById("overlayButton");
  if (overlayButton) {
    overlayButton.remove();
  }

  let overlayArea = document.getElementById("mobileEditOptions");
  if (overlayArea) {
    overlayArea.remove();
  }
  let contactDiv = document.getElementById("contact-div");
  contactDiv.innerHTML += `<div id="button-overlay-area"><button onclick="mobileEditOptions(key, user)" id="overlayButton"><img id="three-dots-options" src="/assets/img/three_dots.svg"></button></div>`;
}
let leftColumn = document.getElementById("left-contacts-page-column");
let buttonOverlayArea = document.getElementById("button-overlay-area");
if (leftColumn && buttonOverlayArea) {
  buttonOverlayArea.remove();
}

if (buttonOverlayArea) {
  buttonOverlayArea.remove();
}

function addContactToDatabase(event) {
  // Verhindert das Standard-Submit-Verhalten
  event.preventDefault();

  // Überprüft, ob das Formular gültig ist
  const form = document.getElementById("addContactForm");
  if (!form.checkValidity()) {
    return false; // Verhindert das Abschicken des Formulars
  }

  // Wenn das Formular gültig ist, führe die Funktion aus
  let firebaseURL =
    "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users.json";
  let name = document.getElementById("fullName").value;
  let email = document.getElementById("new-email").value;
  let phone = document.getElementById("new-phone").value;
  let color = colours[Math.floor(Math.random() * colours.length)];

  fetch(firebaseURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, color }),
  })
    .then(() => {
      closeAddContactOverlay();
      contactsuccessfullyAddedNotification();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch((error) => {
      console.error("Fehler beim Hinzufügen des Kontakts:", error);
    });

  return false; // Verhindert das Standard-Submit-Verhalten
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

async function saveEditedContact(key) {
  // Werte aus den Eingabefeldern abrufen
  let name = document.getElementById("fullName").value;
  let email = document.getElementById("new-email").value;
  let phone = document.getElementById("new-phone").value;

  // URL für das spezifische Benutzerobjekt in der Firebase-Datenbank
  let firebaseURL = `https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`;

  // Aktualisierte Daten an die Firebase-Datenbank senden
  try {
    await fetch(firebaseURL, {
      method: "PATCH", // PATCH wird verwendet, um nur die angegebenen Felder zu aktualisieren
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });

    // Overlay schließen
    closeEditOverlay();

    // Erfolgsbenachrichtigung anzeigen
    contactsuccessfullyEditedNotification();

    // Kontaktliste neu rendern
    contactFirebase();
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kontakts:", error);
    alert("Beim Speichern des Kontakts ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
  }
}
