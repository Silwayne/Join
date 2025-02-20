
const firebaseURL = "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users.json";

function registerUser() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwörter stimmen nicht überein!");
        return;
    }
    fetch(firebaseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("first-name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        })
    })
    .then(() => (alert("Registrierung erfolgreich!"), window.location.href = "./log-in.html"))
    .catch(console.error);
}


