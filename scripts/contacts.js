let leftContactsColumn = document.getElementById("left-contacts-page-column");
let firebaseAnswer;
let fireBase;
let users;

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
  Object.keys(users).forEach((key) => {
    let user = users[key];
    console.log(user.email);
    renderLeftColumnContactsTemplate(user);
  });
}

function renderLeftColumnContactsTemplate(user) {
  leftContactsColumn.innerHTML += `
          <div id="user">
            <div class="user-area">
              <div class="user-picture">
                <div id="user-icon-index" class="user-icon"></div>
              </div>
              <div class="user-info">
                <p class="user-name" id="user-name-index">User Name</p>
                <p class="user-email">${user.email}</p>
              </div>
            </div>
          </div>`;
}

function createContactNameInitials() {
  let userName = document.getElementById("user-name-index").innerText;
  let firstLetterOfUserName = userName.charAt(0);
  let secondLetterOfUserName = userName.split(" ")[1][0];
  let userImage = document.getElementById("user-icon-index");
  userImage.innerHTML = `${firstLetterOfUserName}${secondLetterOfUserName}`;
  userImage.classList.add("user-initials");
}
createContactNameInitials();

function createBigContactNameInitials() {
  let userName = document.getElementById("user-name-index").innerText;
  let firstLetterOfUserName = userName.charAt(0);
  let secondLetterOfUserName = userName.split(" ")[1][0];
  let bigCredentialsArea = document.getElementById("user-picture-big-index");
  bigCredentialsArea.innerHTML = `${firstLetterOfUserName}${secondLetterOfUserName}`;
}
createBigContactNameInitials();
