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
    makeLeftContactActive();
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

/**
 * Creates and displays the initials for a contact's avatar in the large contact details view.
 * If the contact has a first and last name, both initials are displayed.
 * @param {Object} user - The user object containing the contact's name.
 */
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

/**
 * Hides the right contact details area and displays the left contact list.
 * Adjusts the UI for desktop and mobile views by hiding the right column and showing the left column.
 * @param {Object} users - The list of all users.
 */
function hideContactDetails(users) {
  let rightColumn = document.getElementById("right-contacts-page-column");
  let leftColumn = document.getElementById("left-contacts-page-column");
  rightColumn.style.display = "none";
  leftColumn.style.display = "block";
  let overlayButton = document.getElementById("overlayButton");
  overlayButton.style.display = "none";
}

/**
 * Adds an event listener to each contact in the left contact list.
 * Highlights the selected contact by adding an "active" class and removes the class from other contacts.
 */
function makeLeftContactActive() {
  const contactListItems = document.querySelectorAll(".contact-list");
  contactListItems.forEach((item) => {
    item.addEventListener("click", () => {
      contactListItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

/**
 * Renders the right contact details area.
 * Updates the UI to display the selected contact's details and handles responsive view adjustments.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} paramKey - The unique key of the contact.
 * @param {Object} users - The list of all users.
 */
function renderRightContactArea(name, email, phone, paramKey, users) {
  let overlayButton = document.getElementById("overlayButton");
  if (overlayButton) {
    overlayButton.style.display = "block";
  }
  makeLeftContactActive();
  handleResponsiveView(paramKey, users);
  updateContactDetails(name, email, phone, paramKey, users);
  updateUserDetails(paramKey, users);
}

/**
 * Handles the responsive view for the contact details area.
 * Adjusts the layout for smaller screens and displays a back button.
 * @param {string} paramKey - The unique key of the contact.
 * @param {Object} users - The list of all users.
 */
function handleResponsiveView(paramKey, users) {
  if (window.innerWidth < 1250) {
    let rightColumn = document.getElementById("right-contacts-page-column");
    let leftColumn = document.getElementById("left-contacts-page-column");
    let userContactHeader = document.getElementById("user-contact-header");
    rightColumn.style.display = "flex";
    userContactHeader.innerHTML = `<button class="go-back-arrow" onclick="hideContactDetails(users)">
                                    <img src="./assets/img/back-arrow.svg">
                                   </button>`;
    leftColumn.style.display = "none";
    rightColumn.style.display = "block";
    handleOverlayButton(paramKey, users);
  }
}

/**
 * Updates the contact details in the right column.
 * Populates the UI with the selected contact's information and sets up event handlers for edit and delete actions.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} paramKey - The unique key of the contact.
 * @param {Object} users - The list of all users.
 */
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
    editContact(paramKey, users);
  };
}

/**
 * Updates the user details in the right column.
 * Sets the user's avatar and background color.
 * @param {string} paramKey - The unique key of the contact.
 * @param {Object} users - The list of all users.
 */
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

/**
 * Opens the edit overlay for a contact.
 * @param {string} paramKey - The unique key of the contact to edit.
 * @param {Object} users - The list of all users.
 */
function editContact(paramKey, users) {
  editContactOverlay(paramKey, users);
}

/**
 * Stops the propagation of an event.
 * Prevents the event from bubbling up to parent elements.
 * @param {Event} event - The event to stop propagation for.
 */
function stopPropagation(event) {
  event.stopPropagation();
}

/**
 * Displays the phone number of a user in the contact details area.
 * @param {Object} user - The user object containing the phone number.
 */
function displayPhoneNumber(user) {
  let phoneNumberArea = document.getElementById("user-phone-number");
  phoneNumberArea.innerText = user.phone;
}

/**
 * Applies random colors to user avatars in the contact list.
 * Uses the `color` property of each user to set the background color.
 */
function applyRandomColors() {
  let userPictures = document.getElementsByClassName("user-initials user-icon");
  Array.from(userPictures).forEach((element, index) => {
    let userKeys = Object.keys(users);
    let userKey = userKeys[index];
    element.style.backgroundColor = users[userKey].color;
  });
}

/**
 * Sets a random background color for the large contact avatar.
 * @param {Object} user - The user object containing the color property.
 */
function bigRandomColour(user) {
  let bigInitialsArea = document.getElementById("user-picture-big-index");
  if (bigInitialsArea && user.color) {
    bigInitialsArea.style.backgroundColor = user.color;
  }
}

/**
 * Hides the contact options for mobile view.
 * Adjusts the UI to hide the options dropdown for smaller screens.
 */
function hideContactOptionsForMobile() {
  let userNameOptions = document.getElementById("user-name-options");
  if (window.innerWidth < 1250) {
    userNameOptions.style.display = "none";
  }
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
  }
}