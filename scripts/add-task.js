/**
 * Initializes the Add Task page by rendering the sidebar, header, and main content.
 * @param {string} content - The ID of the container where the HTML will be rendered.
 */
function init(content) {
    selectContacts('dropdownMenu');
    renderSidebar();
    initHTML(content);
    renderHeader();
}

let countContactsID = 0;
let counter = 0;
let contactColors = {};
let priority = 'Medium';
let overlayContacts = [];
let names = [];

/**
 * Updates the visibility of icons (plus, check, cancel) based on the input value.
 * @param {string|number} taskId - The ID of the task or subtask.
 */
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

/**
 * Clears the input field for a subtask and resets the icons.
 * @param {string|number} taskId - The ID of the task or subtask.
 */
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

/**
 * Adds a new subtask to the task list.
 * @param {string|number} taskId - The ID of the task or subtask.
 */
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

/**
 * Formats the subtask ID by appending an underscore if necessary.
 * @param {string|number} taskId - The ID of the task or subtask.
 * @returns {string} - The formatted subtask ID.
 */
function formatSubtaskId(taskId) {
    return taskId === 0 || taskId ? '_' + taskId : '';
}

/**
 * Checks if the subtask limit has been reached.
 * @param {HTMLElement} list - The list element containing subtasks.
 * @returns {boolean} - True if the limit is reached, otherwise false.
 */
function isSubtaskLimitReached(list) {
    return list.children.length >= 2;
}

/**
 * Displays an error message when the subtask limit is reached.
 * @param {HTMLElement} container - The container element for the subtask input.
 * @param {HTMLElement} errorMsg - The error message element.
 */
function showSubtaskLimitError(container, errorMsg) {
    container.classList.add('input-error');
    errorMsg.classList.remove('d_none');
}

/**
 * Hides the subtask error message and resets the container state.
 * @param {HTMLElement} container - The container element for the subtask input.
 * @param {HTMLElement} errorMsg - The error message element.
 */
function hideSubtaskError(container, errorMsg) {
    container.classList.remove('input-error');
    errorMsg.classList.add('d_none');
    container.classList.remove('d_none');
}

/**
 * Generates a unique ID for a new subtask.
 * @returns {string} - The unique subtask ID.
 */
function generateUniqueSubtaskId() {
    let i = 0;
    while (document.getElementById('task_' + i)) {
        i++;
    }
    return 'task_' + i;
}

/**
 * Deletes a subtask from the task list.
 * @param {string} subtaskId - The ID of the subtask to delete.
 * @param {string|number} taskId - The ID of the task or subtask.
 */
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

/**
 * Edits an existing subtask by replacing its content with an input field.
 * @param {number} taskIdNumber - The ID of the subtask to edit.
 */
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

/**
 * Saves the updated content of a subtask.
 * @param {HTMLInputElement} inputField - The input field containing the updated subtask content.
 * @param {number} taskIdNumber - The ID of the subtask to save.
 */
function saveSubTask(inputField, taskIdNumber) {
    let updatedText = inputField.value.trim();
    let taskItem = document.getElementById('task_' + taskIdNumber);
    if (updatedText !== "") {
        taskItem.innerHTML = updatedText;
    } else {
        deleteSubTask(taskIdNumber);
    }
    let parentUl = taskItem.parentElement;
    parentUl.style.listStyleType = "disc";
    document.getElementById('imgID_' + taskIdNumber).src = "/assets/img/edit.svg";
    document.getElementById('imgID_' + taskIdNumber).onclick = function () { editSubTask(taskIdNumber) };
}

/**
 * Sets the priority of a task to "Urgent".
 * @param {string} elementId - The ID of the priority element.
 */
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

/**
 * Sets the priority of a task to "Medium".
 * @param {string} elementId - The ID of the priority element.
 */
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

/**
 * Sets the priority of a task to "Low".
 * @param {string} elementId - The ID of the priority element.
 */
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

/**
 * Clears the styles of a priority element.
 * @param {string} elementId - The ID of the priority element.
 */
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

/**
 * Gets the ID of a sibling priority element.
 * @param {string} currentId - The ID of the current priority element.
 * @param {string} targetPriority - The target priority ("urgent", "medium", or "low").
 * @returns {string} - The ID of the sibling priority element.
 */
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

/**
 * Formats the task ID for dropdown menus.
 * @param {string} id - The ID of the dropdown menu.
 * @returns {string} - The formatted task ID.
 */
function formatTaskId(id) {
    return id !== "dropdownMenu" ? "_" + id : "";
}

/**
 * Clears the dropdown menu content.
 * @param {HTMLElement} dropDownMenu - The dropdown menu element.
 */
function clearDropDownMenu(dropDownMenu) {
    dropDownMenu.innerHTML = '';
}

/**
 * Saves a contact's name and color locally.
 * @param {string} contactName - The name of the contact.
 * @param {string} contactColor - The color associated with the contact.
 */
function saveContactLocally(contactName, contactColor) {
    contactColors[contactName] = contactColor;
    if (!names.includes(contactName)) {
        names.push(contactName);
    }
}

/**
 * Adds a click event listener to a contact checkbox.
 * @param {string} contactName - The name of the contact.
 * @param {number} counter - The index of the contact in the list.
 * @param {string} id - The ID of the dropdown menu.
 */
function addCheckboxListener(contactName, counter, id) {
    let checkbox = document.getElementById('contactID_' + counter);
    if (checkbox) {
        checkbox.addEventListener('click', function () {
            handleContactSelection(contactName, this.checked, id);
        });
    }
}

/**
 * Handles the selection or deselection of a contact.
 * @param {string} name - The name of the contact.
 * @param {boolean} checked - Whether the contact is selected.
 * @param {string} id - The ID of the dropdown menu.
 */
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

/**
 * Generates the HTML for a contact list item.
 * @param {string} contactInitials - The initials of the contact.
 * @param {string} contactName - The name of the contact.
 * @param {number} idNumber - The ID of the contact.
 * @param {string} bgColor - The background color of the contact icon.
 * @param {string} id - The ID of the dropdown menu.
 * @param {boolean} isChecked - Whether the contact is selected.
 * @returns {string} - The HTML string for the contact list item.
 */
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

/**
 * Extracts the initials from a contact's name.
 * @param {string} name - The full name of the contact.
 * @returns {string} - The initials of the contact.
 */
function getInitials(name) {
    let nameParts = name.trim().split(" ");
    let firstInitial = nameParts[0].charAt(0).toUpperCase();
    let secondInitial = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : "";
    return firstInitial + secondInitial;
}

/**
 * Displays the contact dropdown menu.
 * @param {string} id - The ID of the dropdown menu.
 */
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

/**
 * Hides the contact dropdown menu.
 * @param {Event} event - The event object.
 * @param {string} id - The ID of the dropdown menu.
 */
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

/**
 * Renders the assigned contacts in the container.
 * @param {string} id - The ID of the container.
 */
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

/**
 * Sets up the "Enter" key functionality for the subtask input field.
 * @param {string} [taskId=''] - The ID of the task or subtask.
 */
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

/**
 * Validates the Add Task form fields.
 * @returns {boolean} - True if all fields are valid, otherwise false.
 */
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

