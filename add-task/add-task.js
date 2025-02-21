const firebaseURL = "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users.json";

function init() {
    selectContacts();
}
let counter = 0
let names = []
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
    counter++;
    let input = document.getElementById('subtaskInput')
    let tableSubTask = document.getElementById('subtasks')
    tableSubTask.classList.remove('d_none')
    let inputText = input.value.trim();

    if (inputText === "") return;

    tableSubTask.innerHTML += `
                <div class="task">
                    <li id="task_${counter}">${inputText}</li>
                    <div class="task-icons">
                        <img id="imgID_${counter}" src="/assets/img/edit.svg" class="icon" onclick="editSubTask(this, ${counter})">
                        <img src="/assets/img/delete.svg" class="icon" onclick="deleteSubtask(this, ${counter})">
                    </div>
                </div>
            `;

    clearSubTaskInput();
}
function deleteSubtask(element, taskIdNumber) {
    document.getElementById('task_' + taskIdNumber).remove();
    counter--;
}

function editSubTask(element, taskIdNumber) {
    let taskItem = document.getElementById('task_' + taskIdNumber);
    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = taskItem.textContent.trim();
    let parentUl = taskItem.parentElement;
    parentUl.style.listStyleType = "none";
    taskItem.innerHTML = "";
    taskItem.appendChild(inputField);
    document.getElementById('imgID_' + taskIdNumber).src = "/assets/img/check.svg";
    document.getElementById('imgID_' + taskIdNumber).onclick = function () { saveSubTask(element, inputField) };
    inputField.addEventListener("blur", function () {
        saveSubTask(element, inputField, taskIdNumber);
    });

}

function saveSubTask(element, inputField, taskIdNumber) {
    let updatedText = inputField.value.trim();
    let taskItem = document.getElementById('task_' + taskIdNumber);
    if (updatedText !== "") {
        taskItem.innerHTML = updatedText;
    } else {
        deleteSubtask(element, taskIdNumber)
    }
    let parentUl = taskItem.parentElement;
    parentUl.style.listStyleType = "disc";
    document.getElementById('imgID_' + taskIdNumber).src = "/assets/img/edit.svg";
    document.getElementById('imgID_' + taskIdNumber).onclick = function () { editSubTask(element) };
}

function swapToUrgent() {
    let urgent = document.getElementById('prio-urgent')
    urgent.classList.add('prio-urgent')
    urgent.innerHTML = `<p>Urgent <img src="/assets/img/Prio-alta-white.svg"></p>`
    removeMedium();
    removeLow();
}
function removeUrgent() {
    let urgent = document.getElementById('prio-urgent')
    urgent.classList.remove('prio-urgent')
    urgent.innerHTML = ` <p>Urgent <img src="/assets/img/Prio-alta-red.svg"></p>`
}
function swapToMedium() {
    let medium = document.getElementById('prio-medium')
    medium.classList.add('prio-medium')
    medium.innerHTML = `<p>Medium <img src="/assets/img/Prio-media-white.svg"></p>`
    removeUrgent();
    removeLow();
}
function removeMedium() {
    let medium = document.getElementById('prio-medium')
    medium.classList.remove('prio-medium')
    medium.innerHTML = `<p>Medium <img src="/assets/img/Prio-media-orange.svg"></p>`
}
function swapToLow() {
    let low = document.getElementById('prio-low')
    low.classList.add('prio-low')
    low.innerHTML = `<p>Low <img src="/assets/img/Prio-low-white.svg"></p>`
    removeUrgent();
    removeMedium();
}
function removeLow() {
    let low = document.getElementById('prio-low')
    low.classList.remove('prio-low')
    low.innerHTML = `<p>Low <img src="/assets/img/Prio-low-green.svg"></p>`
}
async function selectContacts() {
    let response = await fetch(firebaseURL);
    firebaseAnswer = await response.json();
    fireBase = firebaseAnswer;
    let dropDownMenu = document.getElementById('dropdownMenu')
    for (let key in firebaseAnswer) {
        let email = firebaseAnswer[key].email
        names.push(email)

        dropDownMenu.innerHTML += `
                    <div>${email} Name</div>
    `
    }
}

function showContacts() {
    let inputContainer = document.getElementById('contact-container');
    inputContainer.onclick = null;
    document.getElementById('arrow-drop-down').innerHTML = `<img onclick="hideContacts(event)" src="/assets/img/arrow_drop_downaa.svg">`
    let dropDownMenu = document.getElementById('dropdownMenu')
    dropDownMenu.classList.remove('d_none')
    
}

function hideContacts(event) {
    event.stopPropagation()
    document.getElementById('arrow-drop-down').innerHTML = `<img onclick="hideContacts(event)" src="/assets/img/arrow_drop_down.svg">`
    let dropDownMenu = document.getElementById('dropdownMenu')
    dropDownMenu.classList.add('d_none')
    let inputContainer = document.getElementById('contact-container');
    inputContainer.onclick = showContacts;

}    
function filterNames() {
   
    let input = document.getElementById("dropdownInput").value.toLowerCase();
    let resultsContainer = document.getElementById("dropdownMenu");
    resultsContainer.innerHTML = "";
    let filteredNames = names.filter(name => name.toLowerCase().includes(input));    
    if (filteredNames.value == filteredNames.length) {
        showContacts
        return
    } 
    for (let index = 0; index < filteredNames.length; index++) {        
        resultsContainer.innerHTML += `  <div>${filteredNames[index]} Name</div>`;       
}
}
function hallöle(){
    alert('Hallöle')
}
