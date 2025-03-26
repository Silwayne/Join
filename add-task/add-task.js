const firebaseURL = "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/";

function init(content) {
    renderSidebar();
    initHTML(content);
    renderHeader()
    selectContacts();

}
let assignedContacts = [];
let countContactsID = 0
let counter = 0
let names = []
let contactColors = {};
let priority = 'Medium'

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
    let input = document.getElementById('subtaskInput');
    let tableSubTask = document.getElementById('subtasks');
    let errorMsg = document.getElementById('subtask-error');
    let container = document.getElementById('subtask-container');
    let existingTasks = tableSubTask.querySelectorAll('li').length;

    if (existingTasks >= 2) {
        container.classList.add('input-error');
        errorMsg.classList.remove('d_none');
        return;
    }

    container.classList.remove('input-error');
    errorMsg.classList.add('d_none');

    let inputText = input.value.trim();
    if (inputText === "") return;

    counter++;
    tableSubTask.classList.remove('d_none');

    tableSubTask.innerHTML += `
        <div class="task">
            <li id="task_${counter}">${inputText}</li>
            <div class="task-icons">
                <img id="imgID_${counter}" src="/assets/img/edit-icon.svg" class="icon" onclick="editSubTask(${counter})">
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
    if (counter < 2) {
        document.getElementById('subtask-container').classList.remove('input-error');
        document.getElementById('subtask-error').classList.add('d_none');
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
    priority = 'Urgent'
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
    priority = 'Medium'
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
    priority = 'Low'
}
function removeLow() {
    let low = document.getElementById('prio-low')
    low.classList.remove('bold')
    low.classList.remove('prio-low')
    low.innerHTML = `<p>Low <img src="/assets/img/Prio-low-green.svg"></p>`
}
function getRandomColor() {
    const colors = ["#29abe2", "#ff8190", "#7ae229", "#ffa800", "#ff3d00", "#9055a2"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  async function selectContacts() {
    let response = await fetch(firebaseURL+'users.json');
    let firebaseAnswer = await response.json();
    let dropDownMenu = document.getElementById('dropdownMenu');

    let localCounter = 0;

    for (let key in firebaseAnswer) {
        let contact = firebaseAnswer[key];
        let contactName = contact.name;
        let contactInitials = getInitials(contactName);

        names.push(contactName);
        if (!contactColors[contactName]) {
            contactColors[contactName] = getRandomColor();
        }

        dropDownMenu.innerHTML += getContactListHTML(contactInitials, contactName, localCounter, contactColors[contactName]);

        let checkbox = document.getElementById('contactID_' + localCounter);
        
        checkbox.addEventListener('click', function() {
            handleContactSelection(contactName, this.checked);
        });

        localCounter++;
    }
}

function handleContactSelection(contactName, isChecked) {
    if (isChecked) {
        if (!assignedContacts.includes(contactName)) {
            assignedContacts.push(contactName);
        }
    } else {
        assignedContacts = assignedContacts.filter(function(name) {
            return name !== contactName;
        });
    }

    console.log("Aktuell zugewiesen:", assignedContacts);
}

function getContactListHTML(contactInitials, contactName, idNumber, bgColor) {
    return `
        <div>      
            <label class="contact-list" for="contactID_${idNumber}">
                <div class="user-icon" style="background-color: ${bgColor};">
                    <span class="user-initials">${contactInitials}</span>
                </div>
                <span class="contact-name">${contactName}</span>
                <input 
                    class="contact-checkbox" 
                    type="checkbox" 
                    id="contactID_${idNumber}" 
                    name="${contactName}" 
                    onclick="handleContactSelection('${contactName}', this.checked)">
            </label>
        </div>
    `;
}




function getInitials(name) {
    let nameParts = name.trim().split(" ");
    let firstInitial = nameParts[0].charAt(0).toUpperCase();
    let secondInitial = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : "";
    return firstInitial + secondInitial;
}

function showContacts() {
    let inputContainer = document.getElementById('contact-container');
    document.getElementById('assignedContactsContainer').classList.add('d_none')
    inputContainer.onclick = null;
    document.getElementById('arrow-drop-down').innerHTML = `<img onclick="hideContacts(event)" src="/assets/img/arrow_drop_downaa.svg">`
    let dropDownMenu = document.getElementById('dropdownMenu')
    dropDownMenu.classList.remove('d_none')

}

function hideContacts(event) {
    event.stopPropagation();
    document.getElementById('assignedContactsContainer').classList.remove('d_none')


    document.getElementById('arrow-drop-down').innerHTML = `<img onclick="hideContacts(event)" src="/assets/img/arrow_drop_down.svg">`;

    let dropDownMenu = document.getElementById('dropdownMenu');
    dropDownMenu.classList.add('d_none');

    let inputContainer = document.getElementById('contact-container');
    inputContainer.onclick = showContacts;

    renderAssignedContacts();
}
function renderAssignedContacts() {
    let container = document.getElementById('assignedContactsContainer');
    container.innerHTML = '';

    for (let contactName of assignedContacts) {
        let initials = getInitials(contactName);
        let color = contactColors[contactName];

        container.innerHTML += `
            <div class="user-icon" style="background-color: ${color};">
                <span class="selectedInitials user-initials selected-User-Initials">${initials}</span>
            </div>
        `;
    }
}

function filterNames() {
    let assignedContainer = document.getElementById('assignedContactsContainer');
    assignedContainer.classList.add('d_none');

    let input = document.getElementById("dropdownInput").value.toLowerCase();
    let resultsContainer = document.getElementById("dropdownMenu");
    resultsContainer.innerHTML = "";

    let filteredNames = names.filter(name => name.toLowerCase().includes(input));

    if (filteredNames.length === 0) {
        showContacts(); 
        return;
    }

    for (let contactName of filteredNames) {
        let contactInitials = getInitials(contactName);
        let isChecked = assignedContacts.includes(contactName) ? "checked" : "";

        resultsContainer.innerHTML += getFilteredContactHTML(contactInitials, contactName, isChecked);
    }
}


function getFilteredContactHTML(contactInitials, contactName, isChecked) {
    return `
        <div>      
            <label class="contact-list">
                <div class="user-icon" style="background-color: ${contactColors[contactName]};">
                    <span class="user-initials">${contactInitials}</span>
                </div>
                <span class="contact-name">${contactName}</span>
                <input 
                    class="contact-checkbox" 
                    type="checkbox"
                    ${isChecked}
                    onclick="handleContactSelection('${contactName}', this.checked)">
            </label>
        </div>`;
}

function clearTaskForm() {
    let subTaskInput = document.getElementById('subtaskInput');
    if (subTaskInput) {
        subTaskInput.value = '';
        updateIcons()
    }
    let titleInput = document.getElementById('add-task-title');
    if (titleInput) {
        titleInput.value = '';
    }
    let descriptionInput = document.getElementById('description-input');
    if (descriptionInput) {
        descriptionInput.value = '';
    }
    assignedContacts = [];
    let checkboxes = document.querySelectorAll('.contact-checkbox');
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
    renderAssignedContacts();
    let dueDateInput = document.getElementById('due-date');
    if (dueDateInput) {
        dueDateInput.value = '';
    }
    document.getElementById('category').value = '';
    document.getElementById('subtask-container').classList.remove('input-error');
    document.getElementById('subtask-error').classList.add('d_none');
    document.getElementById('subtasks').innerHTML = '';
    resetValidation(document.getElementById('add-task-title'));
    resetValidation(document.getElementById('due-date'));
    resetValidation(document.getElementById('category'));
    swapToMedium()
}

/* Function Createtask() IN create-task.js*/
function checkValidations() {
    let isValid = true;

    let titleInput = document.getElementById('add-task-title');
    let dueDateInput = document.getElementById('due-date');
    let categorySelect = document.getElementById('category');

    resetValidation(titleInput);
    resetValidation(dueDateInput);
    resetValidation(categorySelect);

    if (titleInput.value.trim() === '') {
        showValidationError(titleInput, 'Title is required');
        isValid = false;
    }

    if (dueDateInput.value.trim() === '') {
        showValidationError(dueDateInput, 'Due date is required');
        isValid = false;
    }

    if (categorySelect.value.trim() === '') {
        showValidationError(categorySelect, 'Category is required');
        isValid = false;
    }

    return isValid;
}



function showValidationError(element, message) {
    element.classList.add('input-error');
    let errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerText = message;
    if (!element.nextElementSibling || !element.nextElementSibling.classList.contains('error-message')) {
        element.parentNode.insertBefore(errorMessage, element.nextSibling);
    }
}

function resetValidation(element) {
    element.classList.remove('input-error');

    let nextElem = element.nextElementSibling;
    if (nextElem && nextElem.classList.contains('error-message')) {
        nextElem.remove();
    }
}

function initHTML(content) {
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
            <input oninput="filterNames()" type="text" id="dropdownInput" placeholder="Select contacts to assign" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Select contacts to assign'"> <span class="arrow-drop-down" id="arrow-drop-down"><img src="/assets/img/arrow_drop_down.svg"></span>
            </div>
            <div class="selectedInitials" id="assignedContactsContainer"></div>
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
                <option value="Technical Task">Technical Task</option>
                <option value="User Story">User Story</option>
            </select>
        </div>

        <div>
        <div id="subtask-container" class="input-container">
            <input type="text" id="subtaskInput" placeholder="Add new subtask" oninput="updateIcons()">
            <div class="icons">
                <span id="plusIcon" class="icon"><img src="/assets/img/Subtasks icons11.svg"></span>
                <span id="checkIcon" class="icon d_none"><img onclick="clearSubTaskInput()"
                        src="/assets/img/close.svg"></span>
                <span id="cancelIcon" class="icon d_none"><img onclick="addSubTaskInput()"
                        src="/assets/img/check.svg"></span>
            </div>

           
    </div> <ul class="d_none subtasks" id="subtasks"></ul>
                          <div id="subtask-error" class="error-message d_none absolute">Max. 2 Subtasks erlaubt</div>

    </section>
    </div>

    
</span>
<footer>
<div class="fiel-Is-Required-Div">    
    <p><span class="red">*</span>This field is required</p>   
    </div>
    <div class="buttons-bottom-right">    
    <button class="create-clear-button" onclick="clearTaskForm()" id="clear-button">Clear <img src="/assets/img/Vector.svg"></button>
    <button class="create-clear-button" onclick="createTask()" id="createtask-button">Create Task <img src="/assets/img/check.svg"</button>
        </div>

</footer>`
}

                                                         /*--------- BoardHTML-ADD-TASK-OVERLAY---------*/
function initAddTask(content){
    initHTML(content);
    selectContacts();
}

function addTask(event) {
    event.stopPropagation();
    document.getElementById('overlay-background').classList.add('overlay-background');
    document.getElementById('add-task-overlay').classList.remove('d_none');
}

function removeAddTask() {
    document.getElementById('add-task-overlay').classList.add('d_none');
    document.getElementById('overlay-background').classList.remove('overlay-background');
}

async function loadTasksFromFirebase() {
    let response = await fetch(firebaseURL +'tasks.json')
    let firebaseData  = await response.json()
    let tasksBoxContent = [];
    let index = 0;
    
    for (let key in firebaseData) {
        let task = firebaseData[key];
        task.id = index;
        task.firebaseID = key; 
        tasksBoxContent.push(task);
        index++;
    }
    

    todos = tasksBoxContent;

    
    
}