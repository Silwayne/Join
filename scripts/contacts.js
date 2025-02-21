let leftContactsColumn = document.getElementById("left-contacts-page-column");
let firebaseAnswer;
let fireBase;
let users;
let user;
let contactDetailsArea;

async function contactFirebase() {
  let firebaseUrl = await fetch(
    "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/.json"
  );
  firebaseAnswer = await firebaseUrl.json();
  fireBase = firebaseAnswer;
  console.log(fireBase);
  renderLeftColumnContacts();
}

contactFirebase();

function renderLeftColumnContacts() {
  users = fireBase.users;
  Object.keys(users).forEach((key, indexOfUser) => {
    user = users[key];
    console.log(user.email);
    renderLeftColumnContactsTemplate(user, indexOfUser);
    createContactNameInitials(user, indexOfUser);
  });
}

function renderLeftColumnContactsTemplate(user, indexOfUser) {
  leftContactsColumn.innerHTML += `
<div class="contact-list" onclick='renderRightContactArea("${user.name}", "${
    user.email
  }")' id="user${indexOfUser}">
            <div class="user-area">
              <div class="user-picture">
                <div id="user-icon${[indexOfUser]}" class="user-icon"></div>
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
  let firstLetterOfUserName = userName.charAt(0);
  let secondLetterOfUserName = userName.split(" ")[1][0];
  let userImage = document.getElementById(`user-icon${indexOfUser}`);
  userImage.innerHTML = `${firstLetterOfUserName}${secondLetterOfUserName}`;
  userImage.classList.add("user-initials");
}

function rightContactDetailsHideOnLoad() {
  contactDetailsArea = document.getElementById("contact-details-area");
  contactDetailsArea.classList.add("hide");
}

function renderRightContactArea(name, email) {
  contactDetailsArea.classList.add("show");
  let user = { name, email };
  let rightContactNameArea = document.getElementById("big-user-name");
  let rightEmailArea = document.getElementById("user-email")
  rightEmailArea.innerHTML=`${email}`
  rightContactNameArea.innerHTML = `${name}`;
  createBigContactNameInitials(user);
}

function createBigContactNameInitials(user) {
  let userName = user.name;
  let firstLetterOfUserName = userName.charAt(0);
  let secondLetterOfUserName = userName.split(" ")[1][0];
  let bigCredentialsArea = document.getElementById("user-picture-big-index");
  bigCredentialsArea.innerHTML = `${firstLetterOfUserName}${secondLetterOfUserName}`;
}
