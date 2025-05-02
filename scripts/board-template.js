/**
 * Updates the board HTML by loading tasks and rendering them into their respective columns.
 * @async
 */
async function updateBoardHTML() {
  await loadContactColors();
  await loadTasksFromFirebase();
  const statuses = ["todo", "inprogress", "await", "done"];

  for (let i = 0; i < statuses.length; i++) {
    let status = statuses[i];
    let taskDiv = document.getElementById("drag-and-drop-" + status);
    let tasks = todos.filter((t) => t.status === status);

    if (tasks.length > 0) {
      taskDiv.innerHTML = "";
      taskDiv.classList.remove("no-tasks-container");
      taskDiv.classList.add("task-columns");

      for (let m = 0; m < tasks.length; m++) {
        let taskHTML = await generateTodosHTML(tasks[m]);
        taskDiv.innerHTML += taskHTML;
      }
    } else {
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
  }
}

/**
 * Generates the HTML for the selected contacts in a task.
 * @param {Object} task - The task object containing contact information.
 * @returns {string} - The HTML string for the selected contacts.
 */
function getSelectedContactsFromAddTask(task) {
  let html = "";
  if (task.contacts) {
    for (let i = 0; i < task.contacts.length; i++) {
      let name = task.contacts[i];
      let color = contactColors[name] || "#29abe2";
      let initials = getInitials(name);
      if (color) {
        html += `
                    <div class="user-icon user-icon-board-box" style="background-color: ${color};">
                        <p>${initials}</p>
                    </div>
                `;
      }
    }
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

/**
 * Generates the HTML for a task card in the board.
 * @param {Object} task - The task object containing task details.
 * @returns {string} - The HTML string for the task card.
 */
function generateTodosHTML(task) {
  let subtask = checkIfSubtasks(task);
  let progressBar = generateProgressBar(subtask, task);
  let contacts = getSelectedContactsFromAddTask(task);
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
 * Generates the HTML for the progress bar of a task.
 * @param {string} subtask - The subtask description.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The HTML string for the progress bar.
 */
function generateProgressBar(subtask, task) {
  if (subtask) {
    let progressBar;
    let done = 0;
    for (let i = 0; i < task.subtasks.length; i++) {
      if (task.subtasks[i].done === true) {
        done++;
      }
    }
    let progress = (done / task.subtasks.length) * 100;
    return (progressBar = `
            <div class="box-category-progress-subtasks-box">
                <div class="box-category-progress-bar">
                    <div id="progress-${task.id}" class="progress" style="width: ${progress}%;"></div>
                </div>
                <p class="subtask-description" id="subtaskcounter-${task.id}">${subtask}</p>
            </div>
        `);
  }
  return "";
}

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
    <span id="plusIcon_${id}" class="icon">
      <img src="/assets/img/Subtasks icons11.svg">
    </span>
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
function hideDropDownContacts() {
  setTimeout(() => {
    document.getElementById('outer-task-overlay')?.addEventListener('click', closeOverlay, { once: true });
  }, 0);
}

function editDate(date){
    const formatted = new Date(date).toISOString().split("T")[0];
    document.getElementById("edit-date").min = formatted;
}



function handlePriority(id) {
  let html = "" 
  if (priority === 'Urgent') {
  html =   `
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
    html =   `
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
    html =   `
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
 * Generates the HTML for a subtask item in the overlay.
 * @param {number} id - The ID of the task.
 * @param {number} i - The index of the subtask.
 * @param {string} imageSrc - The source URL of the checkbox image.
 * @param {string} title - The title of the subtask.
 * @returns {string} - The HTML string for the subtask item.
 */
function subtaskOverlayContentHTML(id, i, imageSrc, title) {
  return `
<div onclick="toggleCustomSubtask(${id}, ${i}, this)" class="subtask-item overlay-subtasks cursor-pointer">
                    <div class="custom-checkbox" >
                        <img src="${imageSrc}" class="checkbox-img" id="custom-subtask-${id}-${i}">
                    </div>
                    <label class="subtask-class">${title}</label>
                </div>
            `;
}

/**
 * Allows a drop event to occur by preventing the default behavior.
 * @param {DragEvent} ev - The drag event object.
 */
function allowDrop(ev) {
  ev.preventDefault();
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