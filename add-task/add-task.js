const firebaseURL = "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users.json";
function updateIcons() {
    let inputField = document.getElementById("subtaskInput");
    let plusIcon = document.getElementById("plusIcon");
    let checkIcon = document.getElementById("checkIcon");
    let cancelIcon = document.getElementById("cancelIcon");

    if (inputField.value.trim() !== "") {
        plusIcon.classList.add("d_none");
        checkIcon.classList.remove("d_none");
        cancelIcon.classList.remove("d_none");
    } else {
        plusIcon.classList.remove("d_none");
        checkIcon.classList.add("d_none");
        cancelIcon.classList.add("d_none");
    }
}
function clearSubTaskInput() {
    document.getElementById('subtaskInput').value = ""
    updateIcons();
}

function addSubTaskInput() {
    let input = document.getElementById('subtaskInput')
    let tableSubTask = document.getElementById('subtasks')
    let inputText = input.value.trim();

    if (inputText === "") return;

    tableSubTask.innerHTML += `
                <div class="task">
                    <li>${inputText}</li>
                    <div class="task-icons">
                        <img src="/assets/img/edit.svg" class="icon" onclick="editSubTask(this)">
                        <img src="/assets/img/delete.svg" class="icon" onclick="deleteSubtask(this)">
                    </div>
                </div>
            `;

    clearSubTaskInput();
}
function deleteSubtask(element) {
    element.parentElement.parentElement.remove();
}

function editSubTask(element) {
    // Das <li>-Element, das bearbeitet werden soll
    let taskItem = element.parentElement.previousElementSibling;

    // Der Text der Unteraufgabe
    let currentText = taskItem.textContent.trim();

    // Erstelle ein Eingabefeld (input), um den Text zu bearbeiten
    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = currentText;

    // Entferne den Punkt von der <ul>, falls das Bearbeiten beginnt
    let parentUl = taskItem.parentElement;
    parentUl.style.listStyleType = "none"; // Entfernt die Punkte vom <ul>

    // Ersetze das <li> mit dem Input-Feld
    taskItem.innerHTML = "";
    taskItem.appendChild(inputField);

    // Ändere das Bearbeiten-Icon in ein Speichern-Icon
    let icons = element.parentElement;
    icons.querySelector("img[onclick='editSubTask(this)']").src = "/assets/img/check.svg"; // Speichern-Icon
    icons.querySelector("img[onclick='editSubTask(this)']").onclick = function() { saveSubTask(element, inputField) }; // Speichern-Funktion zuweisen

    // Die Löschen-Funktion bleibt gleich
    let deleteIcon = icons.querySelector("img[onclick='deleteSubtask(this)']");
    deleteIcon.onclick = function() { deleteSubtask(element) };

    // Speichern der Änderung nach Bearbeitung
    inputField.addEventListener("blur", function() {
        saveSubTask(element, inputField);
    });

}

function saveSubTask(element, inputField) {
    // Holen des neuen Textes aus dem Eingabefeld
    let updatedText = inputField.value.trim();
    let taskItem = element.parentElement.previousElementSibling;

    // Speichern des neuen Textes
    if (updatedText !== "") {
        taskItem.innerHTML = updatedText;
    } else {
        deleteSubtask(element)    
    }

    // Setze den Punkt zurück in der Liste
    let parentUl = taskItem.parentElement;
    parentUl.style.listStyleType = "disc"; // Punkt zurücksetzen

    // Wiederherstellen des Bearbeiten-Icons und seiner Funktion
    let icons = element.parentElement;
    icons.querySelector("img[onclick='editSubTask(this)']").src = "/assets/img/edit.svg"; // Zurück zum Bearbeiten-Icon
    icons.querySelector("img[onclick='editSubTask(this)']").onclick = function() { editSubTask(element) }; // Zurück zur Editier-Funktion

    // Die Löschen-Funktion bleibt gleich
    let deleteIcon = icons.querySelector("img[onclick='deleteSubtask(this)']");
    deleteIcon.onclick = function() { deleteSubtask(element) };
}
