let leftContactsColumn = document.getElementById("left-contacts-page-column");
let userName = document.getElementById("user-name-index").innerText;

function createContactNameInitials() {
  let firstLetterOfUserName = userName.charAt(0);
  let secondLetterOfUserName = userName.split(" ")[1][0];
  let userImage = document.getElementById("user-icon-index");
  userImage.innerHTML = `${firstLetterOfUserName}${secondLetterOfUserName}`;
  userImage.classList.add("user-initials");
}
createContactNameInitials();

function createBigContactNameInitials() {
  let firstLetterOfUserName = userName.charAt(0);
  let secondLetterOfUserName = userName.split(" ")[1][0];
  let bigCredentialsArea = document.getElementById("user-picture-big-index");
  bigCredentialsArea.innerHTML = `${firstLetterOfUserName}${secondLetterOfUserName}`;
}
createBigContactNameInitials();
