let todos = [];
let currentDraggedTask;

function initAddTask(content) {
  initHTML(content);
  selectContacts("dropdownMenu");
}

function addTask(event) {
  overlayContacts = [];
  event.stopPropagation();
  priority = "Medium";
  document
    .getElementById("overlay-background")
    .classList.add("overlay-background");
  document.getElementById("add-task-overlay").classList.remove("d_none");
}

function removeAddTask() {
  document.getElementById("add-task-overlay").classList.add("d_none");
  document
    .getElementById("overlay-background")
    .classList.remove("overlay-background");
}

async function loadTasksFromFirebase() {
  let response = await fetch(firebaseURL + "tasks.json");
  let firebaseData = await response.json();
  let tasksBoxContent = [];
  let index = 0;
  let validContactNames = Object.keys(contactColors);

  for (let key in firebaseData) {
    let task = firebaseData[key];
    task.id = index;
    task.firebaseID = key;
    if (task.contacts && Array.isArray(task.contacts)) {
      let originalContacts = [...task.contacts];
      task.contacts = task.contacts.filter((name) =>
        validContactNames.includes(name)
      );
      if (task.contacts.length !== originalContacts.length) {
        await updateFireBaseData(task.firebaseID, task);
      }
    }

    tasksBoxContent.push(task);
    index++;
  }

  todos = tasksBoxContent;
}

function allowDrop(ev) {
  ev.preventDefault();
}
async function loadContactColors() {
  let response = await fetch(firebaseURL + "users.json");
  let users = await response.json();
  contactColors = {};
  const validNames = [];

  for (let key in users) {
    let user = users[key];
    contactColors[user.name] = user.color;
    validNames.push(user.name);
  }
  for (let task of todos) {
    if (Array.isArray(task.contacts)) {
      let originalContacts = [...task.contacts];
      let filteredContacts = task.contacts.filter((name) =>
        validNames.includes(name)
      );

      if (filteredContacts.length !== originalContacts.length) {
        task.contacts = filteredContacts;
        await updateFireBaseData(task.firebaseID, task);
      }
    }
  }
}

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
        taskDiv.innerHTML = `<p class="no-tasks-text">No tasks to do</p>`;
      } else if (status === "inprogress") {
        taskDiv.innerHTML = `<p class="no-tasks-text">No tasks in progress</p>`;
      } else if (status === "await") {
        taskDiv.innerHTML = `<p class="no-tasks-text">No tasks to await</p>`;
      } else if (status === "done") {
        taskDiv.innerHTML = `<p class="no-tasks-text">No tasks done</p>`;
      }

      taskDiv.classList.add("no-tasks-container");
    }
  }
}

async function moveTo(status) {
  let task = todos[currentDraggedTask];
  task.status = status;
  await updateFireBaseData(task.firebaseID, task);
  updateBoardHTML();
}

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
          <div class="subtask-trash-img">
            <img src="/assets/img/delete.svg" onclick="deleteSubTask('${subId}', ${taskId})">
          </div>
        </div>
      `;
    }
  }
  return html;
}

async function getContactColorFromFirebase(contactName) {
  let response = await fetch(firebaseURL + "users.json");
  let contacts = await response.json();
  for (let key in contacts) {
    if (contacts[key].name === contactName) {
      return contacts[key].color;
    }
  }
  return "";
}
function setupSubtaskEnterKeyEdit(taskId) {
  let input = document.getElementById('subtaskInput_' + taskId);
  if (!input) return;

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSubTaskInput(taskId);
    }
  });
}


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
async function moveToStatus(id, newStatus) {
  let task = todos.find(t => t.id === id);
  if (!task) return;

  task.status = newStatus;
  await updateFireBaseData(task.firebaseID, task);
  updateBoardHTML();
}
function closeAllTooltips() {
  let tooltips = document.querySelectorAll('.tooltip-wrapper');
  for (let i = 0; i < tooltips.length; i++) {
    tooltips[i].classList.add('d_none');
  }
}





function openTaskBoxOverlay(id) {
  let task = todos.find((t) => t.id === id);
  let taskOverlay = document.getElementById("task-overlay");
  let outerTaskOverlay = document.getElementById("outer-task-overlay");
  generateTaskBoxContent(task);
  outerTaskOverlay.style.display = "flex";
  taskOverlay.classList.remove("d_none");
}

async function closeOverlay() {
  let taskOverlay = document.getElementById("task-overlay");
  taskOverlay.classList.add("d_none");
  let outerTaskOverlay = document.getElementById("outer-task-overlay");
  outerTaskOverlay.style.display = "none";
  await updateBoardHTML();
}
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
            <div><p class="due-date">Due date: ${task.date}</p></div>
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

      html += `
                <div onclick="toggleCustomSubtask(${task.id}, ${i}, this)" class="subtask-item overlay-subtasks cursor-pointer">
                    <div class="custom-checkbox" >
                        <img src="${imageSrc}" class="checkbox-img" id="custom-subtask-${task.id}-${i}">
                    </div>
                    <label class="subtask-class">${subtask.title}</label>
                </div>
            `;
    }

    html += `</div>`;
    return html;
  }
  return "";
}

function toggleCustomSubtask(taskId, subtaskIndex, element) {
  let task = todos.find((t) => t.id === taskId);
  let img = element.querySelector("img");
  if (task.subtasks[subtaskIndex].done === true) {
    task.subtasks[subtaskIndex].done = false;
    img.src = "../assets/img/unchecked.svg";
  } else {
    task.subtasks[subtaskIndex].done = true;
    img.src = "../assets/img/checked.svg";
  }
  let doneCount = 0;
  for (let i = 0; i < task.subtasks.length; i++) {
    if (task.subtasks[i].done === true) {
      doneCount++;
    }
  }
  let total = task.subtasks.length;
  let subtaskCounter = document.getElementById(`subtaskcounter-${task.id}`);
  let progressBar = document.getElementById(`progress-${taskId}`);

  if (subtaskCounter) {
    subtaskCounter.innerHTML = doneCount + "/" + total + " Subtasks";
  }
  if (progressBar) {
    let progress = (doneCount / total) * 100;
    progressBar.style.width = progress + "%";
  }

  updateFireBaseData(task.firebaseID, task);
}

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

function moveTask(id) {
  currentDraggedTask = id;
}

async function updateFireBaseData(firebaseID, taskObj) {
  const url = `${firbaseForTasks}${firebaseID}.json`;

  await fetch(url, {
    method: "PUT",
    body: JSON.stringify(taskObj),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
function checkIfSubtasks(task) {
  if (task.subtasks) {
    let total = task.subtasks.length;
    let done = 0;
    for (let i = 0; i < total; i++) {
      if (task.subtasks[i].done === true) {
        done++;
      }
    }
    return done + "/" + total + " Subtasks";
  }

  return "";
}

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
function filterPriorityImage(task) {
  let priority = task.priority.toLowerCase();

  if (priority === "low") {
    return '<img src="../assets/img/Prio-low-green.svg">';
  } else if (priority === "medium") {
    return '<img src="../assets/img/Prio-media-orange.svg">';
  }
  return '<img src="../assets/img/Prio-alta-red.svg">';
}

async function deleteOverlay(id) {
  const task = todos.find((t) => t.id === id);
  if (!task) return;

  await fetch(`${firebaseURL}tasks/${task.firebaseID}.json`, {
    method: "DELETE",
  });

  closeOverlay();
  updateBoardHTML();
}

function editOverlay(id) {
  selectContacts(id);
  let task = todos.find((t) => t.id === id);
  let { title, description, date, contacts = [], subtasks = [] } = task;
  overlayContacts = contacts;

  document.getElementById("task-content").innerHTML = `
        <div class="closeEditOverlay-x">
          <div onclick="closeOverlay()"class="closeOverlay-x"><img src="../assets/img/close.svg"></div>
          </div>
        <div>
            <p>Title</p>
            <input value="${title}" class="overlay-input-title">
        </div>

        <div>
            <p>Description</p>
            <textarea class="overlay-input-description">${description}</textarea>
        </div>

        <div>
            <p>Date</p>
            <input type="date" value="${date}" class="overlay-input-date">
        </div>

        <div>
            <p>Prio</p>
            <div class="prio-box">
                <div onclick="swapToUrgent('prio-urgent_${id}')" class="prio" id="prio-urgent_${id}">
                    <p>Urgent <img src="/assets/img/Prio-alta-red.svg"></p>
                </div>
                <div onclick="swapToMedium('prio-medium_${id}')" class="prio prio-medium bold" id="prio-medium_${id}">
                    <p>Medium <img src="/assets/img/Prio-media-white.svg"></p>
                </div>
                <div onclick="swapToLow('prio-low_${id}')" class="prio" id="prio-low_${id}">
                    <p>Low <img src="/assets/img/Prio-low-green.svg"></p>
                </div>
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
  <input type="text" id="subtaskInput_${id}" class="filterNamesInput" placeholder="Add subtask..." oninput="updateIcons(${id})">
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
  <div id="subtask-error_${id}" class="error-message d_none">Max. 2 Subtasks erlaubt</div>
<div id="subtasks_${id}" class="subtask-list">
  ${getSubtaskHTML(id, subtasks)}
</div>


        <div class="button-div"><button class="saveEditedTaskClass" onclick="saveEditedTask(${id})">Save</button></div>
    `;

  renderAssignedContacts(id);
  updateIcons(id);
  setupSubtaskEnterKeyEdit(id)
}

async function saveEditedTask(id) {
  let task = todos.find(function (t) {
    return t.id === id;
  });

  let firebaseID = task.firebaseID;

  let title = document.querySelector(".overlay-input-title").value.trim();
  let description = document
    .querySelector(".overlay-input-description")
    .value.trim();
  let date = document.querySelector(".overlay-input-date").value;
  let subtasks = [];
  let subtaskContainer = document.getElementById("subtasks_" + id);

  if (subtaskContainer) {
    let subtaskElements = subtaskContainer.children;

    for (let i = 0; i < subtaskElements.length; i++) {
      let element = subtaskElements[i];

      let valueElement = element.querySelector(".subtask-value");
      let subtaskText = "";
      if (valueElement) {
        subtaskText = valueElement.textContent.trim();
      }
      if (subtaskText !== "") {
        let foundOld = false;
        let wasDone = false;

        if (task.subtasks && task.subtasks.length > 0) {
          for (let j = 0; j < task.subtasks.length; j++) {
            if (task.subtasks[j].title.trim() === subtaskText) {
              wasDone = task.subtasks[j].done;
              foundOld = true;
              break;
            }
          }
        }

        subtasks.push({
          title: subtaskText,
          done: foundOld ? wasDone : false,
        });
      }
    }
  }
  let updatedTask = {
    title: title,
    description: description,
    date: date,
    priority: priority,
    contacts: overlayContacts,
    subtasks: subtasks,
    status: task.status,
    category: task.category,
  };
  updateFireBaseData(firebaseID, updatedTask);

  await closeOverlay();
  await updateBoardHTML();
}

function filterTasks() {
  let input = document.getElementById("searchTasks").value.toLowerCase();
  let filteredTasks = todos.filter(
    (task) =>
      task.title.toLowerCase().includes(input) ||
      task.description.toLowerCase().includes(input)
  );

  const statuses = ["todo", "inprogress", "await", "done"];
  const statusMessages = {
    todo: "No tasks to do",
    inprogress: "No tasks in progress",
    await: "No tasks to await",
    done: "No tasks done",
  };

  statuses.forEach((status) => {
    let taskDiv = document.getElementById("drag-and-drop-" + status);
    let tasks = filteredTasks.filter((t) => t.status === status);

    if (tasks.length > 0) {
      taskDiv.innerHTML = "";
      taskDiv.classList.remove("no-tasks-container");
      taskDiv.classList.add("task-columns");

      tasks.forEach((task) => {
        let taskHTML = generateTodosHTML(task); // KEIN await, wenn generateTodosHTML nicht async ist!
        taskDiv.innerHTML += taskHTML;
      });
    } else {
      taskDiv.innerHTML = `<p class="no-tasks-text">${statusMessages[status]}</p>`;
      taskDiv.classList.remove("task-columns");
      taskDiv.classList.add("no-tasks-container");
    }
  });
}
