let subtaskCounter = 0
let countContactsID = 0;
let counter = 0;
let contactColors = {};
let priority = 'Medium';
let overlayContacts = [];
let names = [];
let taskProgress = ""

/**
 * Initializes the Add Task page by rendering the sidebar, header, and main content.
 * @param {string} content - The ID of the container where the HTML will be rendered.
 */
function init(content) {
    selectContacts('dropdownMenu');
    renderSidebar();
    initHTML(content);
    renderHeader();
    minDateOfToday()
}

/**
 * Sets the minimum selectable date on the due date input to today's date.
 */
function minDateOfToday() {
    let today = new Date().toISOString().split("T")[0];
    document.getElementById("due-date").min = today;
}

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
    let check = document.getElementById('checkIcon' + id);
    let cancel = document.getElementById('cancelIcon' + id);

    if (!input || !check || !cancel) return;
    checkInputValue(input, check, cancel)

}
/**
 * Toggles visibility of check and cancel icons based on input field content.
 *
 * @param {HTMLInputElement} input - The input field to check.
 * @param {HTMLElement} check - The check icon element.
 * @param {HTMLElement} cancel - The cancel icon element.
 */
function checkInputValue(input, check, cancel) {
    if (input.value.trim() !== '') {
        check.classList.remove('d_none');
        cancel.classList.remove('d_none');
    } else {
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
    let container = document.getElementById('subtask-container' + id);

    if (!input || !list || !container) return;

    let value = input.value.trim();
    if (!value) return;
    let subtaskId = generateUniqueSubtaskId();
    let subtaskHTML = createSubtaskHTML(subtaskId, value, taskId);

    createList(subtaskId, subtaskHTML, list, input, taskId)
}
/**
 * Creates a subtask entry element and appends it to the list.
 * Also resets the input and updates related icons.
 *
 * @param {string} subtaskId - Unique ID for the subtask element.
 * @param {string} subtaskHTML - Inner HTML content of the subtask.
 * @param {HTMLElement} list - The container to which the subtask is added.
 * @param {HTMLInputElement} input - The input field to reset.
 * @param {string} taskId - ID of the parent task (used to update icons).
 */
function createList(subtaskId, subtaskHTML, list, input, taskId) {
    let li = document.createElement('div');
    li.id = subtaskId;
    li.className = "subtask-entry";
    li.innerHTML = subtaskHTML;
    list.appendChild(li);
    list.classList.remove('d_none');
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
 * Generates a unique ID for a new subtask.
 * @returns {string} - The unique subtask ID.
 */
function generateUniqueSubtaskId() {
    return 'task_' + (subtaskCounter++);
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

}
/**
 * Edits an existing subtask by replacing its content with an input field.
 * @param {number} taskIdNumber - The ID of the subtask to edit.
 */
function editSubTask(subId, value) {
    let taskItem = document.getElementById(subId);
    if (!taskItem) return;
    let oldText = value
    taskItem.innerHTML = "";
    taskItem.className = 'subtask-edit-wrapper';
    let input = document.createElement('input');
    input.type = 'text';
    input.maxLength = '30'
    input.className = 'subtask-edit-input';
    input.value = oldText;
    addInputevent(input, subId)
    let checkImg = checkImgOfEditSubtask(input, subId);
    let cancelImg = cancelImgOfEditSubtask(subId);
    setEditSubtaskWrapper(taskItem, input, checkImg, cancelImg)
}
/**
 * Adds an event listener to the input that saves the subtask on Enter key press.
 *
 * @param {HTMLInputElement} input - The input field to listen on.
 * @param {string} subId - The ID to use when saving the subtask.
 */
function addInputevent(input, subId) {
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            saveSubTask(input.value, subId);
        }
    });
}

/**
 * Creates a check icon for editing a subtask and assigns a click handler
 * to save the subtask when clicked.
 *
 * @param {HTMLInputElement} input - The input field containing the subtask text.
 * @param {string} subId - The ID used when saving the subtask.
 */

function checkImgOfEditSubtask(input, subId) {
    let checkImg = document.createElement('img');
    checkImg.src = "./assets/img/check.svg";
    checkImg.className = 'subtask-icon check';
    checkImg.onclick = function () {
        saveSubTask(input.value, subId);
    };
    return checkImg; // ← wichtig!
}

/**
 * Creates a cancel (delete) icon for editing a subtask and assigns a click handler
 * to delete the subtask when clicked.
*
* @param {string} subId - The ID of the subtask to delete.
*/

function cancelImgOfEditSubtask(subId) {
    let cancelImg = document.createElement('img');
    cancelImg.src = './assets/img/delete.svg';
    cancelImg.className = 'subtask-icon cancel';
    cancelImg.onclick = function () {
        deleteSubTask(subId);
    };
    return cancelImg; // ← wichtig!
}

/**
 * Wraps the subtask input and action icons into a container,
 * appends it to the task item, and focuses the input.
 *
 * @param {HTMLInputElement} input - The input element for the subtask.
 * @param {HTMLElement} checkImg - The check icon element.
 * @param {HTMLElement} cancelImg - The cancel (delete) icon element.
 */
function setEditSubtaskWrapper(taskItem, input, checkImg, cancelImg) {
    let wrapper = document.createElement('div');
    wrapper.className = 'subtask-edit-input-wrapper';
    wrapper.appendChild(input);
    wrapper.appendChild(checkImg);
    wrapper.appendChild(cancelImg);
    taskItem.appendChild(wrapper);
    input.focus();
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

/**
 * Fetches contacts from Firebase and renders them in the dropdown menu for a given task.
 *
 * @async
 * @param {string} id - The ID of the task for which to load contacts.
 */
async function selectContacts(id) {
    let firebaseAnswer = await fetchContactsFromFirebase();
    let taskId = formatTaskId(id);
    let dropDownMenu = document.getElementById('dropdownMenu' + taskId);
    if (!dropDownMenu) return;
    clearDropDownMenu(dropDownMenu);
    renderContacts(firebaseAnswer, dropDownMenu, id);
}

/**
 * Fetches all user contact data from Firebase.
 *
 * @async
 * @returns {Promise<Object>} A promise that resolves to the users object from Firebase.
 */
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
    assignedContainerClasslist(assignedContainer, arrow, id, inputContainer, dropDownMenu)
}
/**
 * Hides the assigned contacts container, resets the click handler,
 * changes the arrow icon, and shows the contact dropdown menu.
 *
 * @param {HTMLElement} assignedContainer - The element displaying assigned contacts.
 * @param {HTMLElement} arrow - The arrow icon element.
 * @param {string} id - The task ID used for dynamic references.
 * @param {HTMLElement} inputContainer - The container that was previously clickable.
 * @param {HTMLElement} dropDownMenu - The dropdown menu to show.
 */
function assignedContainerClasslist(assignedContainer, arrow, id, inputContainer, dropDownMenu) {
    assignedContainer.classList.add('d_none');
    inputContainer.onclick = null;
    arrow.innerHTML = getArrowHTMLWithHideContacts(id);
    dropDownMenu.classList.remove('d_none');
    addContactCloser(id);
}