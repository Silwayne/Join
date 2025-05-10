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
    renderFilteredContactsManager(resultsContainer, input, id)
}

/**
 * Renders a filtered list of contacts based on the input value for the manager dropdown.
 * Falls back to showing all contacts if no match is found.
 *
 * @param {HTMLElement} resultsContainer - The container to render the filtered contacts into.
 * @param {string} input - The current user input for filtering.
 * @param {string} id - The ID used to track the current dropdown/task context.
 */
function renderFilteredContactsManager(resultsContainer, input, id) {
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

function resetValue() {
    document.getElementById('category').value = '';
    document.getElementById('subtask-container').classList.remove('input-error');
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
        getContactCheckboxImg(img, element, nameSpan, contactName)        
    } else {
        getContactUnCheckboxImg(img, element, nameSpan, contactName)
    }
    renderAssignedContacts(idNumber);
}

function getContactCheckboxImg(img, element, nameSpan, contactName) {
    overlayContacts = overlayContacts.filter(name => name !== contactName);
    img.src = "../assets/img/unchecked.svg";
    element.classList.remove('blue-background');
    element.classList.add('grey-contact-list');
    nameSpan.classList.remove('white-font');
    nameSpan.classList.add('normal-font');
}

function getContactUnCheckboxImg(img, element, nameSpan, contactName) {
    overlayContacts.push(contactName);
    img.src = "../assets/img/checked.svg";
    element.classList.add('blue-background');
    element.classList.remove('grey-contact-list');
    nameSpan.classList.add('white-font');
    nameSpan.classList.remove('normal-font');
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
    overlayContacts = [];
    names = [];
    contactColors = {};

    let subTaskInput = document.getElementById('subtaskInput');
    let titleInput = document.getElementById('add-task-title');
    let descriptionInput = document.getElementById('description-input');
    let dueDateInput = document.getElementById('due-date');
    let dropdownMenu = document.getElementById('dropdownMenu');
    let assignedContainer = document.getElementById('assignedContactsContainer');
    let inputField = document.getElementById('dropdownInput');
    setValueToZero(subTaskInput, titleInput, descriptionInput, dueDateInput, dropdownMenu, assignedContainer, inputField)
}
/**
 * Resets the values of all task-related input fields and UI containers to default.
 * Also resets dropdown content, assigned contacts, and updates icons.
 *
 * @param {HTMLInputElement} subTaskInput - Input field for subtasks.
 * @param {HTMLInputElement} titleInput - Input field for the task title.
 * @param {HTMLTextAreaElement} descriptionInput - Textarea for the task description.
 * @param {HTMLInputElement} dueDateInput - Input field for the due date.
 * @param {HTMLElement} dropdownMenu - Container for the contact dropdown menu.
 * @param {HTMLElement} assignedContainer - Container showing assigned contacts.
 * @param {HTMLInputElement} inputField - Optional additional input to reset.
 */
function setValueToZero(subTaskInput, titleInput, descriptionInput, dueDateInput, dropdownMenu, assignedContainer, inputField) {
    if (subTaskInput) {
        subTaskInput.value = '';
        updateIcons();
    }
    if (titleInput) titleInput.value = '';
    if (descriptionInput) descriptionInput.value = '';
    if (dueDateInput) dueDateInput.value = '';
    if (dropdownMenu) dropdownMenu.innerHTML = '';
    if (assignedContainer) assignedContainer.innerHTML = '';
    if (inputField) inputField.value = '';

    resetValue();
    selectContacts('dropdownMenu');
}
