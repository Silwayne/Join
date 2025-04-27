/**
 * @file contacts.js
 * @description This file contains the logic for managing contacts, including rendering contact lists, adding, editing, and deleting contacts, as well as handling UI interactions for mobile and desktop views.
 */

let leftContactsList = document.getElementById("left-contact-list");
let firebaseAnswer;
let fireBase;
let users;
let user;
let contactDetailsArea;
let key;

/**
 * List of colors used for contact avatars.
 * @type {string[]}
 */
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

/**
 * Fetches contact data from Firebase and renders the left column contact list.
 * @async
 * @function contactFirebase
 */
async function contactFirebase() {
  let firebaseUrl = await fetch(firebaseApp);
  firebaseAnswer = await firebaseUrl.json();
  fireBase = firebaseAnswer;
  users = fireBase.users;
  renderLeftColumnContacts();
}

contactFirebase();

/**
 * Renders the left column contact list.
 * Groups contacts by their initials and sorts them alphabetically.
 * @function renderLeftColumnContacts
 */
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

/**
 * Generates the HTML template for contact initials in the left column.
 * @param {string} initial - The initial of the contact group.
 * @returns {string} The HTML template for the contact initials.
 */
function renderLeftColumnContactsInitalsTemplate(initial) {
  return `
        <div class="contact-separator">
          <span class="contact-initial">${initial}</span>
          <div class="contact-divider"></div>
        </div>`;
}

/**
 * Renders individual contact details in the left column.
 * @param {Object} user - The user object containing contact details.
 * @param {number} indexOfUser - The index of the user in the list.
 * @param {string} keyObj - The unique key of the user.
 */
function renderLeftColumnPartTwo(user, indexOfUser, keyObj) {
  renderLeftColumnContactsTemplate(user, indexOfUser, keyObj);
  createContactNameInitials(user, indexOfUser);
  let userImage = document.getElementById(`user-icon${indexOfUser}`);
  if (userImage) {
    userImage.style.backgroundColor = user.color;
  }
}

/**
 * Creates initials for a contact's avatar.
 * @param {Object} user - The user object containing contact details.
 * @param {number} indexOfUser - The index of the user in the list.
 */
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

/**
 * Hides the right contact details area on page load.
 * @function rightContactDetailsHideOnLoad
 */
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
  let overlayButton = document.getElementById("overlayButton");
  if (overlayButton) {
    overlayButton.style.display = "block";
  }

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
  if (!contactDiv) {
    console.error("Contact div not found");
    return;
  }

  // Entferne vorherige Buttons, falls vorhanden
  let existingButton = document.getElementById("overlayButton");
  if (existingButton) {
    existingButton.remove();
  }

  // Füge den neuen Button hinzu
  contactDiv.innerHTML += `
    <div id="button-overlay-area">
      <button onclick="mobileEditOptions('${paramKey}', users)" id="overlayButton">
        <img id="three-dots-options" src="/assets/img/three_dots.svg">
      </button>
    </div>`;
}

function updateContactDetails(name, email, phone, paramKey, users) {
  contactDetailsAreaTemplate(paramKey, users);
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
    editContact(paramKey, users); // Übergabe von paramKey
  };
}

function updateUserDetails(paramKey, users) {
  let user = users[paramKey];
  createBigContactNameInitials(user);
  bigRandomColour(user);
}

/**
 * Deletes a contact from the Firebase database.
 * @async
 * @param {string} key - The unique key of the contact to delete.
 * @param {Object} users - The list of all users.
 */
async function deleteContactFromDatabase(key, users) {
  let deleteFirebaseUrl = `${firebaseForDeletion}${key}.json`;
  try {
    await fetch(deleteFirebaseUrl, { method: "DELETE" });
    contactsuccessfullyDeletedNotification();
    delete users[key];
    renderLeftColumnContacts();
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}

function editContact(paramKey, users) {
  editContactOverlay(paramKey, users);
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
 * Adds a new contact to the Firebase database.
 * @param {Event} event - The submit event from the form.
 */
function addContactToDatabase(event) {
  event.preventDefault();

  const form = document.getElementById("addContactForm");
  if (!form.checkValidity()) {
    return false;
  }

  let firebaseURL = firebaseURLUser;
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
      console.error("Error adding contact:", error);
    });

  return false;
}

/**
 * Saves edited contact details to the Firebase database.
 * @async
 * @param {string} key - The unique key of the contact to edit.
 */
async function saveEditedContact(key) {
  let name = document.getElementById("fullName").value;
  let email = document.getElementById("new-email").value;
  let phone = document.getElementById("new-phone").value;

  let firebaseURL = `${firebaseForDeletion}${key}.json`;

  try {
    await fetch(firebaseURL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });

    closeEditOverlay();
    contactsuccessfullyEditedNotification();
    contactFirebase();
  } catch (error) {
    console.error("Error updating contact:", error);
    alert("An error occurred while saving the contact. Please try again.");
  }
}

function mobileEditOptions(paramKey, users) {
  if (!paramKey || !users || !users[paramKey]) {
    console.error("Invalid paramKey or users data");
    alert("The selected contact could not be found. Please try again.");
    return;
  }

  let buttonOverlayArea = document.getElementById("button-overlay-area");
  if (!buttonOverlayArea) {
    console.error("Button overlay area not found");
    return;
  }

  // Entferne vorherige Overlays, falls vorhanden
  let existingOverlay = document.getElementById("mobileEditOptions");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Füge das Overlay hinzu
  buttonOverlayArea.innerHTML = `
    <div onclick="closeResponsiveOverlay('${paramKey}')" class="mobileOverlay" id="mobileEditOptions">
      <div id="small-responsive-overlay-options">
        <button class="responsiveButton" onclick="editContactOverlay('${paramKey}', users)">
          <img id="edit-icon" src="/assets/img/edit-icon.svg">Edit
        </button>
        <button id="deleteMobileButton" class="responsiveButton" onclick="deleteContactFromDatabase('${paramKey}', users)">
          <img id="trash-icon" src="/assets/img/trash-icon.svg">Delete
        </button>
      </div>
    </div>`;

  // Entferne den Overlay-Button, um doppelte Klicks zu vermeiden
  let overlayButton = document.getElementById("overlayButton");
  overlayButton.remove();
}
