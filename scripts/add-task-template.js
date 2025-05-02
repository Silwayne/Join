/**
 * Initializes the HTML content for the Add Task overlay.
 * @param {string} content - The ID of the container where the HTML will be rendered.
 */
function initHTML(content) {
    document.getElementById(content).innerHTML = `
    <div class="add-task-x">
    <h1 class="add-task-h1">Add Task</h1>
    <div onclick="removeAddTask()" id="addtaskx"><img src="../assets/img/close.svg"></div>
    </div>
    <div class="display-splitter">
    <section class="left-section">
        <div class="add-task-title">
            <p>Title<span class="red title-p">*</span></p>
            <input id="add-task-title" type="text" maxlength="20" placeholder="Enter a title">
        </div>
        <div>
            <p>Description</p>
            <textarea maxlength="250" id="description-input" type="text" placeholder="Enter a Description"></textarea>
        </div>
        
        <div class="assigned-div">
            <p>Assinged to</p>
            <div id="contact-container" class="input-container" onclick="showContacts('contact-container')">
            <input oninput="filterNames('assignedContactsContainer')" type="text" id="dropdownInput" placeholder="Select contacts to assign" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Select contacts to assign'"> <span class="arrow-drop-down" id="arrow-drop-down"><img src="/assets/img/arrow_drop_down.svg"></span>
            </div>
            <div class="selectedInitials" id="assignedContactsContainer"></div>
            <div class="dropdown-menu  d_none" id="dropdownMenu">
            </div>
        </div>
    </section>
    <div class="border"></div>
    <section class="right-section">
        <div class="date-div">
            <p for="due-date">Due date<span class="red">*</span></p>
            <input type="date" id="due-date" required>
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
<div class="custom-select">
<div>
            <p>Category<span class="red">*</span></p>
        </div>
    <select id="category" name="category" required>
        <option value="">Select task category</option>
        <option value="Technical Task">Technical Task</option>
        <option value="User Story">User Story</option>
    </select>
    <span class="arrow-category-hover">
    <img src="/assets/img/arrow_drop_down.svg" id="category-arrow" alt="Dropdown Icon">
    </span>
</div>


        <div>
        <div id="subtask-container" class="input-container">
            <input type="text" id="subtaskInput" maxlength="30" placeholder="Add new subtask" oninput="updateIcons()">
            <div class="icons">
                <span id="plusIcon" class="icon"><img src="/assets/img/Subtasks icons11.svg"></span>
                <span id="checkIcon" class="icon d_none"><img onclick="clearSubTaskInput()" src="/assets/img/close.svg"></span>
                <span id="cancelIcon" class="icon d_none"><img onclick="addSubTaskInput()" src="/assets/img/check.svg"></span>

            </div>

           
    </div> <div class="d_none subtasks" id="subtasks"></div>
    </section>
    </div>

    
</span>
<section class="bottom-add-task-overlay-section">
<div class="fiel-Is-Required-Div">    
    <p><span class="red">*</span>This field is required</p>   
    </div>
    <div class="buttons-bottom-right">    
    <button class="create-clear-button" onclick="clearTaskForm()" id="clear-button">Clear <img src="/assets/img/Vector.svg"></button>
    <button class="create-clear-button" onclick="createTask()" id="createtask-button">Create Task <img src="/assets/img/check.svg"</button>
        </div>

</section>`
setupSubtaskEnterKey();

}

/**
 * Creates the HTML for a subtask item.
 * @param {string} subId - The unique ID of the subtask.
 * @param {string} value - The value or name of the subtask.
 * @param {string} taskId - The ID of the task the subtask belongs to.
 * @returns {string} - The HTML string for the subtask item.
 */
function createSubtaskHTML(subId, value, taskId) {    
    return `
    <div class="subtask-item">
        <div class="subtask-value">
            <img class="dot" src="/assets/img/Subtasks icons11.svg">
            ${value}
        </div>
        <div class="subtask-icons">
            <img id="editIcon_${subId}" class="subtask-edit-img" src="/assets/img/edit-icon.svg" onclick="editSubTask('${subId}', '${value}')">
            <img class= "subtask-trash-img"src="/assets/img/delete.svg" onclick="deleteSubTask('${subId}', ${taskId})">
        </div>
    </div>
    `;
}



function contactListHTMLTemplate(backgroundClass, idNumber, contactName, contactInitials,bgColor, fontColor, checkboxImage){

    return `
    <div class="grey-contact-list contact-list ${backgroundClass}" id="background_${idNumber}" onclick="toggleContactCheckbox(this, '${contactName}', '${idNumber}')">
        <label class="contact-list-label">
            <div class="user-icon" style="background-color: ${bgColor};">
                <span class="user-initials">${contactInitials}</span>
            </div>
            <span class="contact-name ${fontColor}">${contactName}</span>
            <div class="custom-checkbox">
                <img src="${checkboxImage}" id="contact-checkbox-img-${idNumber}" class="checkbox-img">
            </div>
        </label>
    </div>
`;
}

/**
 * Filters the contact names based on the input value.
 * @param {string} id - The ID of the container where the filtered results will be displayed.
 */
function filterNames(id) {
    let taskId = '';
    if (id !== 'assignedContactsContainer') {
        taskId = '_' + id;
    }

    let assignedContainer = document.getElementById('assignedContactsContainer' + taskId);
    if (assignedContainer) assignedContainer.classList.add('d_none');

    let inputField = document.getElementById('dropdownInput' + taskId);
    if (!inputField) return;

    let input = inputField.value.toLowerCase();
    let resultsContainer = document.getElementById('dropdownMenu' + taskId);
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    let assigned = overlayContacts;
    let filteredNames = names.filter(name => name.toLowerCase().includes(input));
    if (filteredNames.length === 0) {
        showContacts(id); 
        return;
    }
    for (let contactName of filteredNames) {
        let contactInitials = getInitials(contactName);
        let isChecked = assigned.includes(contactName) ? 'checked' : '';

        resultsContainer.innerHTML += getFilteredContactHTML(contactInitials, contactName, isChecked, id);
    }
}

/**
 * Generates the HTML template for a filtered contact list item.
 * @param {string} backgroundClass - The CSS class for the background.
 * @param {string} idNumber - The unique ID for the contact.
 * @param {string} contactName - The name of the contact.
 * @param {Object} contactColors - An object mapping contact names to their colors.
 * @param {string} contactInitials - The initials of the contact.
 * @param {string} fontColor - The font color for the contact name.
 * @param {string} checkboxImage - The URL of the checkbox image.
 * @returns {string} - The HTML string for the filtered contact list item.
 */
function contactListHTMLFilteredTemplate(backgroundClass, idNumber, contactName, contactColors, contactInitials, fontColor, checkboxImage) {
    return `
    <div class="contact-list ${backgroundClass}" id="background_${idNumber}" onclick="toggleContactCheckbox(this, '${contactName}', '${idNumber}')">
        <label class="contact-list-label">
            <div class="user-icon" style="background-color: ${contactColors[contactName]};">
                <span class="user-initials">${contactInitials}</span>
            </div>
            <span class="contact-name ${fontColor}">${contactName}</span>
            <div class="custom-checkbox">
                <img src="${checkboxImage}" id="contact-checkbox-img-${idNumber}" class="checkbox-img">
            </div>
        </label>
    </div>
`;
}

function resetValue(){
    document.getElementById('category').value = '';
    document.getElementById('subtask-container').classList.remove('input-error');
    document.getElementById('subtask-error').classList.add('d_none');
    document.getElementById('subtasks').innerHTML = '';
    resetValidation(document.getElementById('add-task-title'));
    resetValidation(document.getElementById('due-date'));
    resetValidation(document.getElementById('category'));
    swapToMedium('prio-medium')
}

/**
 * Displays a validation error message for a specific input element.
 * @param {HTMLElement} element - The input element to display the error for.
 * @param {string} message - The error message to display.
 */
function showValidationError(element, message) {
    element.classList.add('input-error');
    let errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerText = message;
    if (!element.nextElementSibling || !element.nextElementSibling.classList.contains('error-message')) {
        element.parentNode.insertBefore(errorMessage, element.nextSibling);
    }
}

/**
 * Resets the validation state for a specific input element.
 * @param {HTMLElement} element - The input element to reset the validation for.
 */
function resetValidation(element) {
    element.classList.remove('input-error');

    let nextElem = element.nextElementSibling;
    if (nextElem && nextElem.classList.contains('error-message')) {
        nextElem.remove();
    }
}

/**
 * Toggles the selection state of a contact checkbox.
 * @param {HTMLElement} element - The contact list item element.
 * @param {string} contactName - The name of the contact.
 * @param {string} idNumber - The unique ID for the contact.
 */
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

/**
 * Renders the contact list in the dropdown menu.
 * @param {Object} firebaseAnswer - The data fetched from Firebase containing contact information.
 * @param {HTMLElement} dropDownMenu - The dropdown menu container element.
 * @param {string} id - The ID of the dropdown menu.
 */
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

/**
 * Generates the HTML for a filtered contact list item.
 * @param {string} contactInitials - The initials of the contact.
 * @param {string} contactName - The name of the contact.
 * @param {string} isChecked - Indicates whether the contact is selected.
 * @param {string} id - The ID of the dropdown menu.
 * @returns {string} - The HTML string for the filtered contact list item.
 */
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

/**
 * Clears the Add Task form and resets all fields and states.
 */
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
