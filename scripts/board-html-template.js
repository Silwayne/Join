/**
 * Opens the edit overlay for a task and populates it with task details.
 * @param {number} id - The ID of the task to edit.
 */

function editOverlay(id) {
    selectContacts(id);
    let task = todos.find((t) => t.id === id);
    let { title, description, date, contacts = [], subtasks = [] } = task;
    overlayContacts = contacts;
    priority = task.priority
    handlePriority()
    document.getElementById("task-content").innerHTML = `
        <div class="closeEditOverlay-x">
          <div onclick="closeOverlay()"class="closeOverlay-x"><img src="../assets/img/close.svg"></div>
          </div>
        <div>
            <p>Title</p>
            <input maxlength="20" value="${title}" class="overlay-input-title">
        </div>

        <div>
            <p>Description</p>
            <textarea maxlength="250" class="overlay-input-description">${description}</textarea>
        </div>

        <div>
            <p>Date</p>
            <input type="date" value="${date}" id="edit-date" class="overlay-input-date">
        </div>
            <div>
    <p>Prio</p>
            <div class="prio-box">  
                   ${handlePriority(id)}
                
            </div>
        </div>
        <div class="dropdown overlay-dropdown">
            <p>Assigned to</p>
            <div id="contact-container_${id}" class="input-container" onclick="showContacts(${id})">
                <input class="filterNamesInput" oninput="filterNames(${id})" type="text" id="dropdownInput_${id}" placeholder="Select contacts to assign"
                    onfocus="this.placeholder = ''" onblur="this.placeholder = 'Select contacts to assign'">
                <span class="arrow-drop-down" id="arrow-drop-down_${id}">
                    <img src="/assets/img/arrow_drop_down.svg">
                </span>
            </div>
            <div class="selectedInitials-edit" id="assignedContactsContainer_${id}"></div>
            <div class=" dropdown-menu-edit d_none" id="dropdownMenu_${id}"></div>
        </div>
     <div id="subtask-container_${id}" class="input-container subtask-container-edit">
  <input type="text" maxlength="30" id="subtaskInput_${id}" class="filterNamesInput" placeholder="Add subtask..." oninput="updateIcons(${id})">
  <div class="icons">
    <span id="checkIcon_${id}" class="icon d_none">
      <img onclick="clearSubTaskInput(${id})" src="/assets/img/close.svg">
    </span>
    <span id="cancelIcon_${id}" class="icon d_none">
      <img onclick="addSubTaskInput(${id})" src="/assets/img/check.svg">
    </span>
  </div>
  </div>
<div id="subtasks_${id}" class="subtask-list">
  ${getSubtaskHTML(id, subtasks)}
</div>

        <div class="button-div"><button class="saveEditedTaskClass" onclick="saveEditedTask(${id})">Save</button></div>
    `
    handlePriority(id)
    renderAssignedContacts(id);
    updateIcons(id);
    setupSubtaskEnterKeyEdit(id)
    editDate(date)
    hideDropDownContacts()

}
async function noBoxHTMLGenerator(status, taskDiv) {
    if (status === "todo") {
        taskDiv.innerHTML = `<div class="no-box"><p class="no-tasks-text">No tasks to do</p></div>`;
    } else if (status === "inprogress") {
        taskDiv.innerHTML = `<div class="no-box"><p class="no-tasks-text">No tasks in progress</p></div>`;
    } else if (status === "await") {
        taskDiv.innerHTML = `<div class="no-box"><p class="no-tasks-text">No tasks to await</p></div>`;
    } else if (status === "done") {
        taskDiv.innerHTML = `<div class="no-box"><p class="no-tasks-text">No tasks done</p></div>`;
    }

    taskDiv.classList.add("no-tasks-container");
}


function handlePriority(id) {
    let html = ""
    if (priority === 'Urgent') {
        html = `
              <div onclick="swapToUrgent('prio-urgent_${id}')" class="prio prio-urgent bold" id="prio-urgent_${id}">
              <div>
                    <p>Urgent <img src="/assets/img/Prio-alta-white.svg"></p></div></div>
              <div onclick="swapToMedium('prio-medium_${id}')" class="prio" id="prio-medium_${id}">
                    <p>Medium <img src="/assets/img/Prio-media-orange.svg"></p>
                </div>
                    <div onclick="swapToLow('prio-low_${id}')" class="prio" id="prio-low_${id}">
                    <p>Low <img src="/assets/img/Prio-low-green.svg"></p>
                </div>
  
  `
    }
    if (priority === 'Medium') {
        html = `
    <div onclick="swapToUrgent('prio-urgent_${id}')" class="prio" id="prio-urgent_${id}">
    <div>
          <p>Urgent <img src="/assets/img/Prio-alta-red.svg"></p></div></div>
    <div onclick="swapToMedium('prio-medium_${id}')" class="prio prio-medium bold" id="prio-medium_${id}">
          <p>Medium <img src="/assets/img/Prio-media-white.svg"></p>
      </div>
          <div onclick="swapToLow('prio-low_${id}')" class="prio" id="prio-low_${id}">
          <p>Low <img src="/assets/img/Prio-low-green.svg"></p>
      </div>

`  }
    if (priority === 'Low') {
        html = `
    <div onclick="swapToUrgent('prio-urgent_${id}')" class="prio" id="prio-urgent_${id}">
    <div>
          <p>Urgent <img src="/assets/img/Prio-alta-red.svg"></p></div></div>
    <div onclick="swapToMedium('prio-medium_${id}')" class="prio" id="prio-medium_${id}">
          <p>Medium <img src="/assets/img/Prio-media-orange.svg"></p>
      </div>
          <div onclick="swapToLow('prio-low_${id}')" class="prio prio-low bold" id="prio-low_${id}">
          <p>Low <img src="/assets/img/Prio-low-white.svg"></p>
      </div>

`  };
    return html
}
/**
 * Generates the content for the task box overlay.
 * @param {Object} task - The task object containing task details.
 */
function generateTaskBoxContent(task) {
    let img = filterPriorityImage(task);

    document.getElementById("task-content").innerHTML = `
      <div class="categorydiv"> 
      <div> <p class="box-category-header-userstory ${task.category}">${task.category
        }</p></div>
      <div onclick="closeOverlay()"class="closeOverlay-x"><img src="../assets/img/close.svg"></div>
      </div>
        <div><p class="task-title-p">${task.title}</p></div>
            <div class="description-div"><p class="description-p">${task.description
        }</p></div>
            <div class="overlay-date"><p class="due-date">Due date: ${task.date}</p></div>
                <div class="priority-div"><p class="priority">Priority:   ${task.priority
        } </p>${img}</div>
                <div><p>${contactsOverlayContent(task)}</p></div>
                <div id="overlay-subtasks">${subtaskOverlayContent(task)}</div>
                <div class="overlay-delete-edit">
                    <div onclick="deleteOverlay(${task.id
        })" class="overlay-delete"><img src="../assets/img/delete.svg"><p class="delete-p">Delete</p></div>
                        <div class="overlay-delete-edit-border"></div>
                    <div onclick="editOverlay(${task.id
        })" class="overlay-edit"><img src="../assets/img/edit-icon.svg"><p>Edit</p></div>
                </div>
    `;
}

/**
 * Generates the HTML for a task card in the board.
 * @param {Object} task - The task object containing task details.
 * @returns {string} - The HTML string for the task card.
 */
function generateTodosHTML(task) {
    let subtask = checkIfSubtasks(task);
    let progressBar = generateProgressBar(subtask, task);
    let contacts = getLimitedContactsHTML(task);
    let img = filterPriorityImage(task);

    return `
    <div draggable="true" onclick="openTaskBoxOverlay(${task.id})" ondragstart="moveTask(${task.id})" class="drag-and-drop-box">
      <div class="box-category-header">
        <p class="box-category-header-userstory ${task.category}">${task.category}</p>
        <div class="tooltip-container" onclick="editTaskPosition(event, ${task.id})">
       <img class="arrow-dropdown" src="./assets/img/dropdownarrows.svg">
      <div id="tooltip_${task.id}" class="tooltip-wrapper d_none"></div>
      </div>

      </div>
      <div class="box-category-title">
        <p>${task.title}</p>
        <div class="box-category-descrition"><p>${task.description}</p></div>
      </div>
      ${progressBar}
      <div class="box-contacts-prio">
        <div class="user-icon-box">${contacts}</div>
        <div class="box-category-prio">${img}</div>                    
      </div>
    </div>
  `;

}

function getLimitedContactsHTML(task, maxVisible = 4) {
    let html = '';
    if (!task.contacts || task.contacts.length === 0) return html;

    let visibleContacts = task.contacts.slice(0, maxVisible);
    let hiddenCount = task.contacts.length - visibleContacts.length;

    for (let name of visibleContacts) {
        let color = contactColors[name] || "#29abe2";
        let initials = getInitials(name);
        html += `
      <div class="user-icon user-icon-board-box" style="background-color: ${color};">
        <p>${initials}</p>
      </div>
    `;
    }

    if (hiddenCount > 0) {
        html += `
      <div class="user-icon user-icon-board-box more-indicator">
        <p>+${hiddenCount}</p>
      </div>
    `;
    }

    return html;
}



/**
 * Edits the position of a task by displaying a tooltip with move options.
 * @param {Event} event - The event object.
 * @param {number} id - The ID of the task to edit.
 */
function editTaskPosition(event, id) {
    event.stopPropagation();
    let tooltip = document.getElementById("tooltip_" + id);
    let task = todos.find(t => t.id === id);


    let html = `
    <div class="tooltip-box">
      <p class="tooltip-title">Move to</p>
  `;

    if (task.status === 'todo') {
        html += `
      <div class="tooltip-item" onclick="moveToStatus(${id}, 'inprogress')">
        <img src="./assets/img/arrow_downward.svg"> In Progress
      </div>
    `;
    }
    else if (task.status === 'inprogress') {
        html += `
      <div class="tooltip-item" onclick="moveToStatus(${id}, 'todo')">
        <img src="./assets/img/arrow_upward.svg"> To Do
      </div>
      <div class="tooltip-item" onclick="moveToStatus(${id}, 'await')">
        <img src="./assets/img/arrow_downward.svg"> Await feedback
      </div>
    `;
    }
    else if (task.status === 'await') {
        html += `
      <div class="tooltip-item" onclick="moveToStatus(${id}, 'inprogress')">
        <img src="./assets/img/arrow_upward.svg"> In Progress
      </div>
      <div class="tooltip-item" onclick="moveToStatus(${id}, 'done')">
        <img src="./assets/img/arrow_downward.svg"> Done
      </div>
    `;
    }
    else if (task.status === 'done') {
        html += `
      <div class="tooltip-item" onclick="moveToStatus(${id}, 'await')">
        <img src="./assets/img/arrow_upward.svg"> Await
      </div>
    `;
    }

    html += `</div>`;
    tooltip.innerHTML = html;
    tooltip.classList.toggle("d_none");
}

function renderEmptyStatusMessage(taskDiv, status) {
    let statusMessages = {
        todo: "No tasks to do",
        inprogress: "No tasks in progress",
        await: "No tasks to await",
        done: "No tasks done",
    };

    taskDiv.innerHTML = `<p class="no-tasks-text">${statusMessages[status]}</p>`;
    taskDiv.classList.remove("task-columns");
    taskDiv.classList.add("no-tasks-container");
}
/**
 * Generates the HTML content for the subtasks in the overlay.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The HTML string for the subtasks.
 */
function subtaskOverlayContent(task) {
  if (task.subtasks) {
    let html = `<h4 class="assigned-to">Subtasks</h4><div class="subtasks-list">`;
    for (let i = 0; i < task.subtasks.length; i++) {
      let subtask = task.subtasks[i];
      let imageSrc;
      if (subtask.done === true) {
        imageSrc = "../assets/img/checked.svg";
      } else {
        imageSrc = "../assets/img/unchecked.svg";
      }
      html += subtaskOverlayContentHTML(task.id, i, imageSrc, subtask.title)
    }
    html += `</div>`;
    return html;
  }
  return "";
}


/**
 * Generates the HTML content for the contacts assigned to a task.
 * @param {Object} task - The task object containing contacts.
 * @returns {string} - The HTML string for the contacts.
 */
function contactsOverlayContent(task) {
  if (task.contacts) {
    let html = `<div class="overlay-contacts-list"><h4 class="assigned-to">Assigned to:</h4></div>`;
    for (let i = 0; i < task.contacts.length; i++) {
      let contact = task.contacts[i];
      let color = contactColors[contact];
      let initials = getInitials(contact);
      html += `
                    <div class="overlay-user-icon"><p class="user-icon" style="background-color:${color};">${initials}</p><h2 class="contact-name">${contact}</h2></div>
            `;
    }
    return html;
  }
  return "";
}

/**
 * Generates the HTML for the subtasks of a task.
 * @param {number} taskId - The ID of the task.
 * @param {Array} subtasks - The array of subtasks.
 * @returns {string} - The HTML string for the subtasks.
 */
function getSubtaskHTML(taskId, subtasks) {
  let html = "";
  if (subtasks && subtasks.length > 0) {
    for (let i = 0; i < subtasks.length; i++) {
      let subId = "task_" + i;
      let subtask = subtasks[i];

      html += `
        <div class="subtask-item" id="${subId}">
          <div class="subtask-value">
            <img class="dot" src="/assets/img/Subtasks icons11.svg">
            ${subtask.title}
          </div>
                      <img id="editIcon_${subId}" class="subtask-edit-img" src="/assets/img/edit-icon.svg" onclick="editSubTask('${subId}', '${subtask.title}')">
          <div class="subtask-trash-img">
            <img src="/assets/img/delete.svg" onclick="deleteSubTask('${subId}', ${taskId})">
          </div>
        </div>
      `;
    }
  }
  return html;
}
