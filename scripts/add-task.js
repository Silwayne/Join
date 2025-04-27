function init(content) {
    selectContacts('dropdownMenu');
    renderSidebar();
    initHTML(content);
    renderHeader()

}
let countContactsID = 0
let counter = 0
let contactColors = {};
let priority = 'Medium'
let overlayContacts = [];
let names = []

function updateIcons(taskId) {
    let id = '';
    if (taskId === 0 || taskId) {
        id = '_' + taskId;
    }
    let input = document.getElementById('subtaskInput' + id);
    let plus = document.getElementById('plusIcon' + id);
    let check = document.getElementById('checkIcon' + id);
    let cancel = document.getElementById('cancelIcon' + id);

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
    let id = '';
    if (taskId !== undefined && taskId !== '') {
        id = '_' + taskId;
    }
    let input = document.getElementById('subtaskInput' + id);
    if (!input) return;

    input.value = '';
    updateIcons(taskId);
}

function addSubTaskInput(taskId) {
    let id = formatSubtaskId(taskId);
    let input = document.getElementById('subtaskInput' + id);
    let list = document.getElementById('subtasks' + id);
    let errorMsg = document.getElementById('subtask-error' + id);
    let container = document.getElementById('subtask-container' + id);

    if (!input || !list || !errorMsg || !container) return;

    let value = input.value.trim();
    if (!value) return;

    if (isSubtaskLimitReached(list)) {
        showSubtaskLimitError(container, errorMsg);
        return;
    }

    hideSubtaskError(container, errorMsg);
    let subtaskId = generateUniqueSubtaskId();
    let subtaskHTML = createSubtaskHTML(subtaskId, value, taskId);

    let li = document.createElement('div');
    li.id = subtaskId;
    li.innerHTML = subtaskHTML;
    list.appendChild(li);

    input.value = '';
    updateIcons(taskId);
}

function formatSubtaskId(taskId) {
    return taskId === 0 || taskId ? '_' + taskId : '';
}

function isSubtaskLimitReached(list) {
    return list.children.length >= 2;
}

function showSubtaskLimitError(container, errorMsg) {
    container.classList.add('input-error');
    errorMsg.classList.remove('d_none');
}

function hideSubtaskError(container, errorMsg) {
    container.classList.remove('input-error');
    errorMsg.classList.add('d_none');
    container.classList.remove('d_none');
}

function generateUniqueSubtaskId() {
    let i = 0;
    while (document.getElementById('task_' + i)) {
        i++;
    }
    return 'task_' + i;
}

function deleteSubTask(subtaskId, taskId) {
    let item = document.getElementById(subtaskId);
    if (item) item.remove();
    let id = '';
    if (taskId === 0 || taskId) {
        id = '_' + taskId;
    }
    let list = document.getElementById('subtasks' + id);
    let container = document.getElementById('subtask-container' + id);
    let errorMsg = document.getElementById('subtask-error' + id);

    if (list && list.children.length < 2) {
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
        deleteSubTask(taskIdNumber)
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

async function selectContacts(id) {
    let firebaseAnswer = await fetchContactsFromFirebase();
    let taskId = formatTaskId(id);
    let dropDownMenu = document.getElementById('dropdownMenu' + taskId);
    if (!dropDownMenu) return;
    clearDropDownMenu(dropDownMenu);
    renderContacts(firebaseAnswer, dropDownMenu, id);
}

async function fetchContactsFromFirebase() {
    let response = await fetch(firebaseURL + 'users.json');
    return await response.json();
}

function formatTaskId(id) {
    return id !== "dropdownMenu" ? "_" + id : "";
}

function clearDropDownMenu(dropDownMenu) {
    dropDownMenu.innerHTML = '';
}

function renderContacts(firebaseAnswer, dropDownMenu, id) {
    let localCounter = 0;
    for (let key in firebaseAnswer) {
        let contact = firebaseAnswer[key];
        let contactName = contact.name;
        let contactColor = contact.color;
        let contactInitials = getInitials(contactName);
        
        saveContactLocally(contactName, contactColor);
        let isChecked = overlayContacts.includes(contactName);
        dropDownMenu.innerHTML += getContactListHTML(contactInitials, contactName, localCounter, contactColor, id, isChecked);
        
        addCheckboxListener(contactName, localCounter, id);
        localCounter++;
    }
}

function saveContactLocally(contactName, contactColor) {
    contactColors[contactName] = contactColor;
    if (!names.includes(contactName)) {
        names.push(contactName);
    }
}

function addCheckboxListener(contactName, counter, id) {
    let checkbox = document.getElementById('contactID_' + counter);
    if (checkbox) {
        checkbox.addEventListener('click', function () {
            handleContactSelection(contactName, this.checked, id);
        });
    }
}


function handleContactSelection(name, checked, id) {
    if (checked) {
        if (!overlayContacts.includes(name)) {
            overlayContacts.push(name);
        }
    } else {
        overlayContacts = overlayContacts.filter(n => n !== name);
    }
    renderAssignedContacts(id); 
}

function getContactListHTML(contactInitials, contactName, idNumber, bgColor, id, isChecked) {
    let fontColor = "";
    let checkboxImage;
    let backgroundClass = "";

    if (isChecked === true) {
        checkboxImage = "../assets/img/checked.svg";
        backgroundClass = "blue-background";
        fontColor = "white-font";
    } else {
        checkboxImage = "../assets/img/unchecked.svg";
        fontColor = "normal-font";
    }
    return contactListHTMLTemplate(backgroundClass, idNumber, contactName, contactInitials, bgColor, fontColor, checkboxImage);
}


function getInitials(name) {
    let nameParts = name.trim().split(" ");
    let firstInitial = nameParts[0].charAt(0).toUpperCase();
    let secondInitial = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : "";
    return firstInitial + secondInitial;
}

function showContacts(id) {
    let taskId = "";
    if (id !== "contact-container") {
        taskId = "_" + id;
    }   
    let inputContainer = document.getElementById('contact-container' + taskId);
    let assignedContainer = document.getElementById('assignedContactsContainer' + taskId);
    let arrow = document.getElementById('arrow-drop-down' + taskId);
    let dropDownMenu = document.getElementById('dropdownMenu' + taskId);

    if (!inputContainer || !assignedContainer || !arrow || !dropDownMenu) {
        return;
    }
    assignedContainer.classList.add('d_none');
    inputContainer.onclick = null;    
    arrow.innerHTML = `
        <img onclick="hideContacts(event, '${id}')" src="/assets/img/arrow_drop_downaa.svg">
    `;

    dropDownMenu.classList.remove('d_none');
}

function hideContacts(event, id) {    
    event.stopPropagation();
    let taskId = '';
    if (id !== 'contact-container') {
        taskId = "_"+id;
    }

    let container = document.getElementById('assignedContactsContainer' +taskId);
    let arrow = document.getElementById('arrow-drop-down' +taskId);
    let dropDownMenu = document.getElementById('dropdownMenu' +taskId);
    let inputContainer = document.getElementById('contact-container' +taskId);

    if (container) container.classList.remove('d_none');
    if (arrow) {
        arrow.innerHTML = `
            <img onclick="hideContacts(event, '${id}')" src="/assets/img/arrow_drop_down.svg">
        `;
    }
    if (dropDownMenu) dropDownMenu.classList.add('d_none');
    if (inputContainer) inputContainer.onclick = () => showContacts(id); 
        renderAssignedContacts(id);
}


function renderAssignedContacts(id) {        
    let taskId = '';
    if (id !== "contact-container") {
        taskId = '_'+ id;
    }

    let container = document.getElementById('assignedContactsContainer' + taskId);
    if (!container) return;
    container.innerHTML = '';    

    for (let i = 0; i < overlayContacts.length; i++) {
        let name = overlayContacts[i];
        let initials = getInitials(name);
        let color = contactColors[name];

        container.innerHTML += `
            <div class="user-icon" style="background-color: ${color};">
                <span class="user-initials">${initials}</span>
            </div>
        `;
    }
}

function setupSubtaskEnterKey(taskId = '') {
    let input = document.getElementById('subtaskInput' + taskId);
    if (!input) return;

    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSubTaskInput(taskId);
        }
    });
}

function getFilteredContactHTML(contactInitials, contactName, isChecked, id) {
    let fontColor = "";
    let checkboxImage = "../assets/img/unchecked.svg";
    let backgroundClass = "";

    if (isChecked === 'checked') {
        checkboxImage = "../assets/img/checked.svg";
        backgroundClass = "blue-background";
        fontColor = "white-font";
    } else {
        fontColor = "normal-font";
    }

    let idNumber = contactName.replace(/\s+/g, '_');

    return contactListHTMLFilteredTemplate(backgroundClass, idNumber, contactName, contactColors, contactInitials, fontColor, checkboxImage)

}

function clearTaskForm() {
    overlayContacts= [];
    let subTaskInput = document.getElementById('subtaskInput');
    let titleInput = document.getElementById('add-task-title');
    let descriptionInput = document.getElementById('description-input');
    let checkboxes = document.querySelectorAll('.contact-checkbox');
    let dueDateInput = document.getElementById('due-date');

        subTaskInput.value = '';
        updateIcons()
        titleInput.value = '';
        descriptionInput.value = '';
    for (let checkbox of checkboxes) {
        checkbox.checked = false;
    }
    renderAssignedContacts('assignedContactsContainer', []);
    
    if (dueDateInput) {
        dueDateInput.value = '';
    }
    resetValue();
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

