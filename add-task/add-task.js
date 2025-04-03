const firebaseURL = "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/";

function init(content) {
    selectContacts();
    renderSidebar();
    initHTML(content);
    renderHeader()

}
let assignedContacts = [];
let countContactsID = 0
let counter = 0
let names = []
let contactColors = {};
let priority = 'Medium'

function updateIcons(taskId = '') {
    let input = document.getElementById('subtaskInput' + (taskId ? '_' + taskId : ''));
    let plus = document.getElementById('plusIcon' + (taskId ? '_' + taskId : ''));
    let check = document.getElementById('checkIcon' + (taskId ? '_' + taskId : ''));
    let cancel = document.getElementById('cancelIcon' + (taskId ? '_' + taskId : ''));

    if (!input || !plus || !check || !cancel) return;

    if (input.value.trim() !== '') {
        plus.classList.add('d_none');
        check.classList.remove('d_none');
        cancel.classList.remove('d_none');
    } else {
        plus.classList.remove('d_none');
        check.classList.add('d_none');
        cancel.classList.add('d_none');
    }
}


function clearSubTaskInput(taskId) {
    document.getElementById('subtaskInput_' + taskId).value = "";
    updateIcons(taskId);
}

function addSubTaskInput() {
    let input = document.getElementById('subtaskInput');
    let list = document.getElementById('subtasks');
    let errorMsg = document.getElementById('subtask-error');
    let container = document.getElementById('subtask-container');
    let inputText = input.value.trim();

    if (list.children.length >= 2) {
        container.classList.add('input-error');
        errorMsg.classList.remove('d_none');
        return;
    }
    container.classList.remove('input-error');
    errorMsg.classList.add('d_none');
    if (inputText === '') return;
    list.classList.remove('d_none');

    let subtaskId = 'task_' + list.children.length;

    let newItem = document.createElement('li');
    newItem.id = subtaskId;
    newItem.innerHTML = `
        ${inputText}
        <img src="/assets/img/delete.svg" onclick="deleteSubTask('${subtaskId}')">
    `;

    list.appendChild(newItem);
    input.value = '';
    updateIcons();
}


function deleteSubTask(subtaskId) {
    let subtask = document.getElementById(subtaskId);
    subtask.remove();

    let list = document.getElementById('subtasks');
    let container = document.getElementById('subtask-container');
    let errorMsg = document.getElementById('subtask-error');

    if (list.children.length < 2) {
        container.classList.remove('input-error');
        errorMsg.classList.add('d_none');
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

function swapToUrgent(elementId) {
    let element = document.getElementById(elementId);
    element.classList.add('prio-urgent');
    element.classList.remove('prio-medium', 'prio-low');
    element.classList.add('bold');

    clearPriorityStyles(getSiblingId(elementId, 'medium'));
    clearPriorityStyles(getSiblingId(elementId, 'low'));

    element.innerHTML = `<p>Urgent <img src="/assets/img/Prio-alta-white.svg"></p>`;
    priority = 'Urgent';
}

function swapToMedium(elementId) {
    let element = document.getElementById(elementId);
    element.classList.add('prio-medium');
    element.classList.remove('prio-urgent', 'prio-low');
    element.classList.add('bold');

    clearPriorityStyles(getSiblingId(elementId, 'urgent'));
    clearPriorityStyles(getSiblingId(elementId, 'low'));

    element.innerHTML = `<p>Medium <img src="/assets/img/Prio-media-white.svg"></p>`;
    priority = 'Medium';
}

function swapToLow(elementId) {
    let element = document.getElementById(elementId);
    element.classList.add('prio-low');
    element.classList.remove('prio-urgent', 'prio-medium');
    element.classList.add('bold');

    clearPriorityStyles(getSiblingId(elementId, 'urgent'));
    clearPriorityStyles(getSiblingId(elementId, 'medium'));

    element.innerHTML = `<p>Low <img src="/assets/img/Prio-low-white.svg"></p>`;
    priority = 'Low';
}

function clearPriorityStyles(elementId) {
    let element = document.getElementById(elementId);
    element.classList.remove('prio-urgent', 'prio-medium', 'prio-low', 'bold');

    if (elementId.includes('urgent')) {
        element.innerHTML = `<p>Urgent <img src="/assets/img/Prio-alta-red.svg"></p>`;
    } else if (elementId.includes('medium')) {
        element.innerHTML = `<p>Medium <img src="/assets/img/Prio-media-orange.svg"></p>`;
    } else if (elementId.includes('low')) {
        element.innerHTML = `<p>Low <img src="/assets/img/Prio-low-green.svg"></p>`;
    }
}

function getSiblingId(currentId, targetPriority) {
    let parts = currentId.split('_');

    if (parts.length === 2) {
        let suffix = parts[1];
        return `prio-${targetPriority}_${suffix}`;
    } else {
        return `prio-${targetPriority}`;
    }
}



  
  async function selectContacts() {
    let response = await fetch(firebaseURL + 'users.json');
    let firebaseAnswer = await response.json();
    let dropDownMenu = document.getElementById('dropdownMenu');

    let localCounter = 0;

    for (let key in firebaseAnswer) {
        let contact = firebaseAnswer[key];
        let contactName = contact.name;
        let contactInitials = getInitials(contactName);
        let contactColor = contact.color

        names.push(contactName);
        contactColors[contactName] = contactColor;

        dropDownMenu.innerHTML += getContactListHTML(
            contactInitials,
            contactName,
            localCounter,
            contactColor
        );

        let checkbox = document.getElementById('contactID_' + localCounter);
        checkbox.addEventListener('click', function () {
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
function renderAssignedContacts(taskId, contactList) {
    let container = document.getElementById('assignedContactsContainer_' + taskId);
    container.innerHTML = '';

    for (let i = 0; i < contactList.length; i++) {
        let name = contactList[i];
        let initials = getInitials(name);
        let color = contactColors[name];

        container.innerHTML += `
            <div class="user-icon" style="background-color: ${color};">
                <span class="user-initials">${initials}</span>
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
    swapToMedium('prio-medium')
}

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
                <div onclick="swapToUrgent('prio-urgent')" class="prio" id="prio-urgent">
                    <p>Urgent <img src="/assets/img/Prio-alta-red.svg"></p>
                </div>
                <div onclick="swapToMedium('prio-medium')" class="prio prio-medium bold" id="prio-medium">
                    <p>Medium <img src="/assets/img/Prio-media-white.svg"></p>
                </div>
                <div onclick="swapToLow('prio-low')" class="prio" id="prio-low">
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
                <span id="checkIcon" class="icon d_none"><img onclick="clearSubTaskInput()" src="/assets/img/close.svg"></span>
                <span id="cancelIcon" class="icon d_none"><img onclick="addSubTaskInput()" src="/assets/img/check.svg"></span>

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