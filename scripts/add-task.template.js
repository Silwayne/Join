function getSubtaskHTML(subId, value, taskId) {
    return `
    <div class="subtask-item">
      <div class="subtask-value">
        <img class="dot" src="/assets/img/Subtasks icons11.svg">${value}
      </div>
      <div class="subtask-trash-img">
        <img src="/assets/img/delete.svg" onclick="deleteSubTask('${subId}', ${taskId})">
      </div>
    </div>`;
}

function getContactListHTML(contactInitials, contactName, idNumber, bgColor, id, isChecked) {
    let { checkboxImage, backgroundClass, fontColor } = getContactStyles(isChecked);
    return buildContactHTML(contactInitials, contactName, idNumber, bgColor, checkboxImage, backgroundClass, fontColor);
}
function getContactStyles(isChecked) {
    return isChecked ? {
        checkboxImage: "../assets/img/checked.svg",
        backgroundClass: "blue-background",
        fontColor: "white-font"
    } : {
        checkboxImage: "../assets/img/unchecked.svg",
        backgroundClass: "",
        fontColor: "normal-font"
    };
}
function buildContactHTML(initials, name, idNumber, bgColor, checkboxImage, backgroundClass, fontColor) {
    return `
        <div class="grey-contact-list contact-list ${backgroundClass}" id="background_${idNumber}" onclick="toggleContactCheckbox(this, '${name}', '${idNumber}')">
            <label class="contact-list-label">
                <div class="user-icon" style="background-color: ${bgColor};">
                    <span class="user-initials">${initials}</span>
                </div>
                <span class="contact-name ${fontColor}">${name}</span>
                <div class="custom-checkbox">
                    <img src="${checkboxImage}" id="contact-checkbox-img-${idNumber}" class="checkbox-img">
                </div>
            </label>
        </div>
    `;
}
function createContactIconHTML(name) {
    let initials = getInitials(name);
    let color = contactColors[name];
    return `
        <div class="user-icon" style="background-color: ${color};">
            <span class="user-initials">${initials}</span>
        </div>
    `;
}
function buildFilteredContactHTML(initials, name, idNumber, checkboxImage, backgroundClass, fontColor) {
    return `
        <div class="contact-list ${backgroundClass}" id="background_${idNumber}" onclick="toggleContactCheckbox(this, '${name}', '${idNumber}')">
            <label class="contact-list-label">
                <div class="user-icon" style="background-color: ${contactColors[name]};">
                    <span class="user-initials">${initials}</span>
                </div>
                <span class="contact-name ${fontColor}">${name}</span>
                <div class="custom-checkbox">
                    <img src="${checkboxImage}" id="contact-checkbox-img-${idNumber}" class="checkbox-img">
                </div>
            </label>
        </div>
    `;
}
function getFilteredContactStyles(isChecked) {
    return isChecked === 'checked' ? {
        checkboxImage: "../assets/img/checked.svg",
        backgroundClass: "blue-background",
        fontColor: "white-font"
    } : {
        checkboxImage: "../assets/img/unchecked.svg",
        backgroundClass: "",
        fontColor: "normal-font"
    };
}
function clearTaskForm() {
    clearTextInputs();
    resetContactSelection();
    resetSubtasks();
    resetValidationFields();
    swapToMedium('prio-medium');
}
function clearTextInputs() {
    clearInputValue('subtaskInput', true);
    clearInputValue('add-task-title');
    clearInputValue('description-input');
    clearInputValue('due-date');
    document.getElementById('category').value = '';
}
function clearInputValue(id, updateIconsFlag = false) {
    let input = document.getElementById(id);
    if (input) {
        input.value = '';
        if (updateIconsFlag) updateIcons();
    }
}
function resetContactSelection() {
    overlayContacts = [];
    let checkboxes = document.querySelectorAll('.contact-checkbox');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    renderAssignedContacts('assignedContactsContainer');
}
function resetSubtasks() {
    document.getElementById('subtask-container').classList.remove('input-error');
    document.getElementById('subtask-error').classList.add('d_none');
    document.getElementById('subtasks').innerHTML = '';
}
function resetValidationFields() {
    resetValidation(document.getElementById('add-task-title'));
    resetValidation(document.getElementById('due-date'));
    resetValidation(document.getElementById('category'));
}

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
            <input id="add-task-title" type="text" placeholder="Enter a title">
        </div>
        <div>
            <p>Description</p>
            <textarea id="description-input" type="text" placeholder="Enter a Description"></textarea>
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
        <div class="category-div">
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
    </div> <div class="d_none subtasks" id="subtasks"></div>
                          <div id="subtask-error" class="error-message d_none absolute">Max. 2 Subtasks erlaubt</div>

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
