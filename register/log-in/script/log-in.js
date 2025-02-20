const firebaseURL = "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users.json";

window.onload = function () {
    const loader = document.getElementById('loader');
    const logo = document.getElementById('logo');
    const content = document.getElementById('content');
  
    setTimeout(() => {
      logo.style.width = '100px'; 
      logo.style.height = '122px';
      logo.style.top = '80px'; 
      logo.style.left = '70px';
      logo.style.transform = 'translate(0, 0)'; 
      loader.style.opacity = '0';
      
      setTimeout(() => {
        loader.style.display = 'none';
      }, 1000); 
    }, 500); 
  };

function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    fetchUsers(email, password);
}

function fetchUsers(email, password) {
    fetch(firebaseURL)
        .then(response => response.json())
        .then(users => checkLogin(users, email, password))
        .catch(console.error);
}

function checkLogin(users, email, password) {
    let errorMsg = document.getElementById("login-error");
    errorMsg.classList.add("d-none");

    let userList = Object.values(users || {});
    let userFound = userList.find(user => user.email === email && user.password === password);

    userFound ? window.location.href = "./join-main/join-main.html" : errorMsg.classList.remove("d-none");
}


function guestLogin() {
    let guestEmail = "guest@join.de";
    let guestPassword = "guest123";
    
    sessionStorage.setItem("email", guestEmail);
    sessionStorage.setItem("password", guestPassword);
    
    alert("Du bist als Gast eingeloggt!");
    window.location.href = "./join-main/join-main.html";
}






