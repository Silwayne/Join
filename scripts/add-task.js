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
    let id = formatTaskId(taskId);
    let input = document.getElementById('subtaskInput' + id);
    let list = document.getElementById('subtasks' + id);
    let container = document.getElementById('subtask-container' + id);
    let errorMsg = document.getElementById('subtask-error' + id);

    if (!input || !list || !errorMsg || !container) return;
    handleSubtaskInput(input, list, container, errorMsg, taskId);
}
function formatTaskId(taskId) {
    return taskId || taskId === 0 ? `_${taskId}` : '';
}
function handleSubtaskInput(input, list, container, errorMsg, taskId) {
    let value = input.value.trim();
    if (!value) return;
    if (list.children.length >= 2) {
        showSubtaskError(container, errorMsg);
        return;
    }
    addSubtask(list, container, errorMsg, value, taskId);
}
function showSubtaskError(container, errorMsg) {
    container.classList.add('input-error');
    errorMsg.classList.remove('d_none');
}
function addSubtask(list, container, errorMsg, value, taskId) {
    container.classList.remove('input-error');
    errorMsg.classList.add('d_none');
    list.classList.remove('d_none');

    let subId = generateSubTaskId();
    let li = createSubTaskElement(subId, value, taskId);
    list.appendChild(li);

    document.getElementById('subtaskInput' + formatTaskId(taskId)).value = '';
    updateIcons(taskId);
}
function generateSubTaskId() {
    let i = 0;
    while (document.getElementById('task_' + i)) {
        i++;
    }
    return 'task_' + i;
}
function createSubTaskElement(subId, value, taskId) {
    let li = document.createElement('div');
    li.id = subId;
    li.innerHTML = getSubtaskHTML(subId, value, taskId);
    return li;
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
    let response = await fetch(firebaseURL + 'users.json');
    let firebaseAnswer = await response.json();
    let taskId = id !== "dropdownMenu" ? "_" + id : "";
    let dropDownMenu = document.getElementById('dropdownMenu' + taskId);
    if (!dropDownMenu) return;
    prepareDropdown(dropDownMenu);
    renderContacts(firebaseAnswer, dropDownMenu, id);
}
function prepareDropdown(dropDownMenu) {
    dropDownMenu.innerHTML = '';
}
function renderContacts(firebaseAnswer, dropDownMenu, id) {
    let localCounter = 0;
    for (let key in firebaseAnswer) {
        let contact = firebaseAnswer[key];
        renderSingleContact(contact, dropDownMenu, id, localCounter);
        localCounter++;
    }
}
function renderSingleContact(contact, dropDownMenu, id, localCounter) {
    let contactName = contact.name;
    contactColors[contactName] = contact.color;
    if (!names.includes(contactName)) names.push(contactName);
    let isChecked = overlayContacts.includes(contactName);

    dropDownMenu.innerHTML += getContactListHTML(
        getInitials(contactName),
        contactName,
        localCounter,
        contact.color,
        id,
        isChecked
    );

    addCheckboxListener(contactName, localCounter, id);
}
function addCheckboxListener(contactName, localCounter, id) {
    let checkbox = document.getElementById('contactID_' + localCounter);
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

function toggleContactCheckbox(element, contactName, idNumber) {
    let img = element.querySelector('img');
    let nameSpan = element.querySelector('.contact-name');
    let isChecked = overlayContacts.includes(contactName);

    if (isChecked) {
        overlayContacts = overlayContacts.filter(name => name !== contactName);
        img.src = "../assets/img/unchecked.svg";
        element.classList.remove('blue-background');
        element.classList.add('grey-contact-list');
        nameSpan.classList.remove('white-font');
        nameSpan.classList.add('normal-font');

    } else {
        overlayContacts.push(contactName);
        img.src = "../assets/img/checked.svg";
        element.classList.add('blue-background');
        element.classList.remove('grey-contact-list');
        nameSpan.classList.add('white-font');
        nameSpan.classList.remove('normal-font');
    }

    renderAssignedContacts(idNumber);
}

function getInitials(name) {
    let nameParts = name.trim().split(" ");
    let firstInitial = nameParts[0].charAt(0).toUpperCase();
    let secondInitial = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : "";
    return firstInitial + secondInitial;
}

function showContacts(id) {
    let taskId = formatContactTaskId(id);
    let inputContainer = document.getElementById('contact-container' + taskId);
    let assignedContainer = document.getElementById('assignedContactsContainer' + taskId);
    let arrow = document.getElementById('arrow-drop-down' + taskId);
    let dropDownMenu = document.getElementById('dropdownMenu' + taskId);

    if (!inputContainer || !assignedContainer || !arrow || !dropDownMenu) return;
    prepareContactDropdown(inputContainer, assignedContainer, arrow, dropDownMenu, id);
}
function formatContactTaskId(id) {
    return id !== "contact-container" ? "_" + id : "";
}
function prepareContactDropdown(inputContainer, assignedContainer, arrow, dropDownMenu, id) {
    assignedContainer.classList.add('d_none');
    inputContainer.onclick = null;
    setArrowToHide(arrow, id);
    dropDownMenu.classList.remove('d_none');
}
function setArrowToHide(arrow, id) {
    arrow.innerHTML = `
        <img onclick="hideContacts(event, '${id}')" src="/assets/img/arrow_drop_downaa.svg">
    `;
}

function hideContacts(event, id) {
    event.stopPropagation();
    let taskId = formatContactTaskId(id);
    let container = document.getElementById('assignedContactsContainer' + taskId);
    let arrow = document.getElementById('arrow-drop-down' + taskId);
    let dropDownMenu = document.getElementById('dropdownMenu' + taskId);
    let inputContainer = document.getElementById('contact-container' + taskId);

    toggleContactDropdown(container, arrow, dropDownMenu, inputContainer, id);
    renderAssignedContacts(id);
}

function toggleContactDropdown(container, arrow, dropDownMenu, inputContainer, id) {
    if (container) container.classList.remove('d_none');
    if (arrow) setArrowToShow(arrow, id);
    if (dropDownMenu) dropDownMenu.classList.add('d_none');
    if (inputContainer) inputContainer.onclick = () => showContacts(id);
}
function setArrowToShow(arrow, id) {
    arrow.innerHTML = `
        <img onclick="hideContacts(event, '${id}')" src="/assets/img/arrow_drop_down.svg">
    `;
}

function renderAssignedContacts(id) {
    let taskId = formatContactTaskId(id);
    let container = document.getElementById('assignedContactsContainer' + taskId);
    if (!container) return;
    clearContainer(container);
    renderOverlayContacts(container);
}
function clearContainer(container) {
    container.innerHTML = '';
}
function renderOverlayContacts(container) {
    for (let i = 0; i < overlayContacts.length; i++) {
        let name = overlayContacts[i];
        container.innerHTML += createContactIconHTML(name);
    }
}

function filterNames(id) {
    let taskId = id !== 'assignedContactsContainer' ? '_' + id : '';
    hideAssignedContacts(taskId);
    let inputField = document.getElementById('dropdownInput' + taskId);
    if (!inputField) return;
    let input = inputField.value.toLowerCase();
    filterAndRenderNames(input, taskId, id);
}
function hideAssignedContacts(taskId) {
    let assignedContainer = document.getElementById('assignedContactsContainer' + taskId);
    if (assignedContainer) assignedContainer.classList.add('d_none');
}
function filterAndRenderNames(input, taskId, id) {
    let resultsContainer = document.getElementById('dropdownMenu' + taskId);
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '';

    let filtered = names.filter(name => name.toLowerCase().includes(input));
    if (filtered.length === 0) return showContacts(id);

    filtered.forEach(name => {
        let initials = getInitials(name);
        let isChecked = overlayContacts.includes(name) ? 'checked' : '';
        resultsContainer.innerHTML += getFilteredContactHTML(initials, name, isChecked, id);
    });
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
    let { checkboxImage, backgroundClass, fontColor } = getFilteredContactStyles(isChecked);
    let idNumber = contactName.replace(/\s+/g, '_');
    return buildFilteredContactHTML(contactInitials, contactName, idNumber, checkboxImage, backgroundClass, fontColor);
}

function checkValidations() {
    let isValid = true;
    let titleInput = document.getElementById('add-task-title');
    let dueDateInput = document.getElementById('due-date');
    let categorySelect = document.getElementById('category');

    resetValidationFields(titleInput, dueDateInput, categorySelect);
    isValid &= validateField(titleInput, 'Title is required');
    isValid &= validateField(dueDateInput, 'Due date is required');
    isValid &= validateField(categorySelect, 'Category is required');

    return !!isValid;
}
function resetValidationFields(titleInput, dueDateInput, categorySelect) {
    resetValidation(titleInput);
    resetValidation(dueDateInput);
    resetValidation(categorySelect);
}
function validateField(input, message) {
    if (input.value.trim() === '') {
        showValidationError(input, message);
        return false;
    }
    return true;
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

