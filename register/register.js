
const firebaseURL = "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users.json";

function registerUser() {
    fetch(firebaseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        })
    })
    .then(() => (alert("Registrierung erfolgreich!"), window.location.href = "./log-in.html"))
    .catch(console.error);
}


