const firebaseURL = "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users.json";

function registerUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    let name = document.getElementById("first-name").value;
    let privacyChecked = document.getElementById("checkbox").checked;

    if (!validatePasswords(password, confirmPassword, privacyChecked)) return;
    isEmailTaken(email, (exists) => {
        if (!exists) saveUser(name, email, password);
    });
}

function validatePasswords(password, confirmPassword, privacyChecked) {
    if (!privacyChecked) {
        alert("Bitte akzeptieren Sie die Datenschutzbestimmungen!");
        return false;
    }
    if (password !== confirmPassword) {
        alert("Passwörter stimmen nicht überein!");
        return false;
    }
    return true;
}

function isEmailTaken(email, callback) {
    fetch(firebaseURL)
    .then(response => response.json())
    .then(users => {
        let exists = Object.values(users || {}).some(user => user.email === email);
        if (exists) alert("Diese E-Mail-Adresse ist bereits registriert!");
        callback(exists);
    })
    .catch(console.error);
}

function saveUser(name, email, password) {
    fetch(firebaseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    })
    .then(() => {
        alert("Registrierung erfolgreich!");
        window.location.href = "./log-in.html";
    })
    .catch(console.error);
}



