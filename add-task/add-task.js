const firebaseURL = "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/users.json";

function init() {
    renderSidebar();
    initHTML('content');
    renderHeader()
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
                        <img id="imgID_${counter}" src="/assets/img/edit.svg" class="icon" onclick="editSubTask(${counter})">
                        <img src="/assets/img/delete.svg" class="icon" onclick="deleteSubtask(${counter})">
                    </div>
                </div>
            `;

    clearSubTaskInput();
}
function deleteSubtask(taskIdNumber) {
    let taskElement = document.getElementById('task_' + taskIdNumber)
    taskElement.parentElement.remove()
    counter--;
    if (counter === 0) {
        document.getElementById('subtasks').classList.add('d_none')
    }
}

function editSubTask(taskIdNumber) {
    let taskItem = document.getElementById('task_' + taskIdNumber);
    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = taskItem.textContent.trim();
    let parentUl = taskItem.parentElement;
    parentUl.style.listStyleType = "none";
    taskItem.innerHTML = "";
    taskItem.appendChild(inputField);
    document.getElementById('imgID_' + taskIdNumber).src = "/assets/img/check.svg";
    document.getElementById('imgID_' + taskIdNumber).onclick = function () { saveSubTask(inputField, taskIdNumber) };
    inputField.addEventListener("blur", function () {
        saveSubTask(inputField, taskIdNumber);
    });

}

function saveSubTask(inputField, taskIdNumber) {
    let updatedText = inputField.value.trim();
    let taskItem = document.getElementById('task_' + taskIdNumber);
    if (updatedText !== "") {
        taskItem.innerHTML = updatedText;
    } else {
        deleteSubtask(taskIdNumber)
    }
    let parentUl = taskItem.parentElement;
    parentUl.style.listStyleType = "disc";
    document.getElementById('imgID_' + taskIdNumber).src = "/assets/img/edit.svg";
    document.getElementById('imgID_' + taskIdNumber).onclick = function () { editSubTask(taskIdNumber) };
}

function swapToUrgent() {
    let urgent = document.getElementById('prio-urgent')
    urgent.classList.add('prio-urgent')
    urgent.innerHTML = `<p>Urgent <img src="/assets/img/Prio-alta-white.svg"></p>`
    urgent.classList.add('bold')
    removeMedium();
    removeLow();
}
function removeUrgent() {
    let urgent = document.getElementById('prio-urgent')
    urgent.classList.remove('prio-urgent')
    urgent.classList.remove('bold')
    urgent.innerHTML = ` <p>Urgent <img src="/assets/img/Prio-alta-red.svg"></p>`
}
function swapToMedium() {
    let medium = document.getElementById('prio-medium')
    medium.classList.add('prio-medium')
    medium.innerHTML = `<p>Medium <img src="/assets/img/Prio-media-white.svg"></p>`
    medium.classList.add('bold')
    removeUrgent();
    removeLow();
}
function removeMedium() {
    let medium = document.getElementById('prio-medium')
    medium.classList.remove('bold')
    medium.classList.remove('prio-medium')
    medium.innerHTML = `<p>Medium <img src="/assets/img/Prio-media-orange.svg"></p>`
}
function swapToLow() {
    let low = document.getElementById('prio-low')
    low.classList.add('prio-low')
    low.innerHTML = `<p>Low <img src="/assets/img/Prio-low-white.svg"></p>`
    low.classList.add('bold')
    removeUrgent();
    removeMedium();
}
function removeLow() {
    let low = document.getElementById('prio-low')
    low.classList.remove('bold')
    low.classList.remove('prio-low')
    low.innerHTML = `<p>Low <img src="/assets/img/Prio-low-green.svg"></p>`
}
async function selectContacts() {
    let response = await fetch(firebaseURL);
    firebaseAnswer = await response.json();
    fireBase = firebaseAnswer;
    let dropDownMenu = document.getElementById('dropdownMenu')
    for (let key in firebaseAnswer) {
        let contactName = firebaseAnswer[key].name
        names.push(contactName)

        dropDownMenu.innerHTML += `
                    <div>${contactName}</div>
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
    if (filteredNames.length === 0) {
        showContacts
        return
    } 
    for (let index = 0; index < filteredNames.length; index++) {        
        resultsContainer.innerHTML += `  <div>${filteredNames[index]}</div>`;       
}
}
function hallöle(){
    alert('Hallöle')
}
function initHTML(content){
    document.getElementById(content).innerHTML = `
    <h1 class="add-task-h1">Add Task</h1>
    <div class="display-splitter">
    <section class="left-section">
        <div>

            <p>Title<span class="red title-p">*</span></p>
            <input id="add-task-title" type="text" placeholder="Enter a title">
        </div>
        <div>
            <p>Description</p>
            <input id="description-input" type="text" placeholder="Enter a Description">
        </div>
        
        <div class="dropdown">
            <p>Assinged to</p>
            <div id="contact-container" class="input-container" onclick="showContacts()">
            <input oninput="filterNames()" type="text" id="dropdownInput" placeholder="Select contacts to assign"> <span class="arrow-drop-down" id="arrow-drop-down"><img src="/assets/img/arrow_drop_down.svg"></span>
            </div>
            <div class="dropdown-menu d_none" id="dropdownMenu">
            </div>
        </div>
    </section>
    <div class="border"></div>
    <section class="right-section">
        <div>
            <p for="due-date">Due date<span class="red">*</span></p>
            <input type="date" id="due-date" placeholder="Hallo" required>
        </div>
        <div>
            <p>Prio</p>
            <div class="prio-box">
                <div onclick="swapToUrgent()" class="prio" id="prio-urgent">
                    <p>Urgent <img src="/assets/img/Prio-alta-red.svg"></p>
                </div>
                <div onclick="swapToMedium()" class="prio prio-medium bold" id="prio-medium">
                    <p>Medium <img src="/assets/img/Prio-media-white.svg"></p>
                </div>
                <div onclick="swapToLow()" class="prio" id="prio-low">
                    <p>Low <img src="/assets/img/Prio-low-green.svg"></p>
                </div>
            </div>
        </div>
        <div>
            <p for="category">Category<span class="red">*</span></p>
            <select id="category" name="category" required>
                <option value="">Select task category</option>
                <option value="technical">Technical Task</option>
                <option value="user-story">User Story</option>
            </select>
        </div>
        <div>
        <div class="input-container">
            <input type="text" id="subtaskInput" placeholder="Add new subtask" oninput="updateIcons()">
            <div class="icons">
                <span id="plusIcon" class="icon"><img src="/assets/img/Subtasks icons11.svg"></span>
                <span id="checkIcon" class="icon d_none"><img onclick="clearSubTaskInput()"
                        src="/assets/img/close.svg"></span>
                <span id="cancelIcon" class="icon d_none"><img onclick="addSubTaskInput()"
                        src="/assets/img/check.svg"></span>
            </div>
           
    </div> <ul class="d_none subtasks" id="subtasks"></ul>
  
    </section>
    </div>
    
</span>
<footer>
<div class="fiel-Is-Required-Div">    
    <p><span class="red">*</span>This field is required</p>   
    </div>
    <div class="buttons-bottom-right">    
    <button class="create-clear-button" id="clear-button">Clear <img src="/assets/img/Vector.svg"></button>
    <button class="create-clear-button" id="createtask-button">Create Task <img src="/assets/img/check.svg"</button>
        </div>

</footer>`
}