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
        <span class ="add-task-title-input">
            <p>Title<span class="red title-p">*</span></p>
            <input id="add-task-title" type="text" maxlength="20" placeholder="Enter a title">
            <span>
        </div>
        <div class="add-task-description-div">
            <p>Description</p>
            <textarea maxlength="250" id="description-input" type="text" placeholder="Enter a Description"></textarea>
        </div>
        
        <div class="assigned-div">
            <p>Assinged to</p>
            <div id="contact-container" class="input-container" onclick="showContacts('contact-container')">
            <input oninput="filterNames('assignedContactsContainer')" type="text" id="dropdownInput" placeholder="Select contacts to assign" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Select contacts to assign'">
            <div id="arrow-drop-down">
                            <span class="arrow-drop-down">
            <img src="/assets/img/arrow_drop_down.svg">
            </span>
            </div>
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
        <div class="prio-box-div">
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
<div class="custom-select-p">
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


        <div class="subtaks-container-div">
        <p>Subtasks</p>
        <div id="subtask-container" class="input-container">
            <input type="text" id="subtaskInput" maxlength="30" placeholder="Add new subtask" oninput="updateIcons()">
            <div class="icons">
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



function contactListHTMLTemplate(backgroundClass, idNumber, contactName, contactInitials, bgColor, fontColor, checkboxImage) {

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

/**
 * Saves the updated content of a subtask.
 * @param {HTMLInputElement} inputField - The input field containing the updated subtask content.
 * @param {number} taskIdNumber - The ID of the subtask to save.
 */
function saveSubTask(value, subId) {
    let taskItem = document.getElementById(subId);
    taskItem.className = 'subtask-item';

    taskItem.innerHTML = `
        <div class="subtask-value">
            <img class="dot" src="/assets/img/Subtasks icons11.svg">
            <span class="subtask-title">${value}</span>
        </div>
        <div class="subtask-icons">
            <img id="editIcon_${subId}" class="subtask-edit-img" src="/assets/img/edit-icon.svg" onclick="editSubTask('${subId}', '${value}')">
            <img class="subtask-trash-img" src="/assets/img/delete.svg" onclick="deleteSubTask('${subId}')">
        </div>
    `;
}
function getArrowHTMLWithHideContacts(id) {
    return `
                <span class="arrow-drop-down">
        <img onclick="hideContacts(event, '${id}')" src="/assets/img/arrow_drop_downaa.svg">
        </span>
    `;

}
function getArrowHTMLWithShowContacts(arrow, id, dropDownMenu, inputContainer) {
    arrow.innerHTML = `
                          <span onclick="showContacts(event, '${id}')" class="arrow-drop-down">
                        <img src="/assets/img/arrow_drop_down.svg">
                        </span>
            `;

    if (dropDownMenu) dropDownMenu.classList.add('d_none');
    if (inputContainer) inputContainer.onclick = () => showContacts(id);
    renderAssignedContacts(id);

}
function generateHiddenNamesCounter(overlayContacts, maxVisible, hiddenCount, container){
 let hiddenNames = overlayContacts.slice(maxVisible).join(', ');
        container.innerHTML += `
            <div class="user-icon more-indicator" title="${hiddenNames}">
                <span class="user-initials">+${hiddenCount}</span>
            </div>
        `;
}

function generateVisibleContactsHTML(visibleContacts, container, contactColors, maxVisible, hiddenNames, hiddenCount) {
    for (let name of visibleContacts) {
        let initials = getInitials(name);
        let color = contactColors[name] || "#29abe2";

        container.innerHTML += `
            <div class="user-icon" style="background-color: ${color};">
                <span class="user-initials">${initials}</span>
            </div>
        `;
    }

    if (hiddenCount > 0) {
        generateHiddenNamesCounter(hiddenNames, overlayContacts, maxVisible, hiddenCount, container)

    }

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
