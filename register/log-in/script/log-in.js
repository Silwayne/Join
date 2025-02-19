const firebaseURL = "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users.json";

function login() {
    fetch(firebaseURL)
        .then(response => response.json())
        .then(users => {
            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;

            let userFound = users.find(user => user.email === email && user.password === password);

            userFound ? (alert("Login erfolgreich!"), window.location.href = "./join-main/join-main.html") : alert("Falsche E-Mail oder Passwort!");
        })
        .catch(console.error);
}

function guestLogin() {
    let guestEmail = "guest@join.de";
    let guestPassword = "guest123";
    
    sessionStorage.setItem("email", guestEmail);
    sessionStorage.setItem("password", guestPassword);
    
    alert("Du bist als Gast eingeloggt!");
    window.location.href = "./join-main/join-main.html";
}






