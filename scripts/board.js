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

async function loadContactColors() {
  let response = await fetch(firebaseURL + "users.json");
  let users = await response.json();
  contactColors = {};
  let validNames = [];

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

async function moveTo(status) {
  let task = todos[currentDraggedTask];
  task.status = status;
  await updateFireBaseData(task.firebaseID, task);
  updateBoardHTML();
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

function toggleCustomSubtask(taskId, subtaskIndex, element) {
    let task = todos.find(t => t.id === taskId);
    if (!task) return;

    toggleSubtaskDone(task, subtaskIndex, element);
    updateSubtaskProgress(task);
    updateFireBaseData(task.firebaseID, task);
}

function toggleSubtaskDone(task, subtaskIndex, element) {
    let img = element.querySelector("img");
    let subtask = task.subtasks[subtaskIndex];

    subtask.done = !subtask.done;
    img.src = subtask.done ? "../assets/img/checked.svg" : "../assets/img/unchecked.svg";
}

function updateSubtaskProgress(task) {
    let doneCount = task.subtasks.filter(subtask => subtask.done).length;
    let total = task.subtasks.length;
    let subtaskCounter = document.getElementById(`subtaskcounter-${task.id}`);
    let progressBar = document.getElementById(`progress-${task.id}`);

    if (subtaskCounter) {
        subtaskCounter.innerHTML = `${doneCount}/${total} Subtasks`;
    }
    if (progressBar) {
        let progress = (doneCount / total) * 100;
        progressBar.style.width = `${progress}%`;
    }
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
  let task = todos.find((t) => t.id === id);
  if (!task) return;

  await fetch(`${firebaseURL}tasks/${task.firebaseID}.json`, {
    method: "DELETE",
  });

  closeOverlay();
  updateBoardHTML();
}

async function saveEditedTask(id) {
    let task = todos.find(t => t.id === id);
    if (!task) return;

    let firebaseID = task.firebaseID;
    let updatedTask = buildUpdatedTask(id, task);

    await updateFireBaseData(firebaseID, updatedTask);
    await closeOverlay();
    await updateBoardHTML();
}

function buildUpdatedTask(id, oldTask) {
    return {
        title: getInputValue(".overlay-input-title"),
        description: getInputValue(".overlay-input-description"),
        date: getInputValue(".overlay-input-date"),
        priority: priority,
        contacts: overlayContacts,
        subtasks: collectEditedSubtasks(id, oldTask),
        status: oldTask.status,
        category: oldTask.category,
    };
}

function getInputValue(selector) {
    let input = document.querySelector(selector);
    return input ? input.value.trim() : '';
}

function collectEditedSubtasks(id, oldTask) {
    let subtasks = [];
    let subtaskContainer = document.getElementById("subtasks_" + id);

    if (!subtaskContainer) return subtasks;

    let subtaskElements = subtaskContainer.children;
    for (let element of subtaskElements) {
        let valueElement = element.querySelector(".subtask-value");
        let subtaskText = extractSubtaskText(valueElement);

        if (subtaskText) {
            let wasDone = findSubtaskDoneStatus(oldTask, subtaskText);
            subtasks.push({ title: subtaskText, done: wasDone });
        }
    }
    return subtasks;
}

function extractSubtaskText(valueElement) {
    if (!valueElement) return '';
    return Array.from(valueElement.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .join('');
}

function findSubtaskDoneStatus(oldTask, subtaskText) {
    if (!oldTask.subtasks) return false;

    let matchingSubtask = oldTask.subtasks.find(
        t => t.title.trim() === subtaskText
    );
    return matchingSubtask ? matchingSubtask.done : false;
}


function filterTasks() {
    let input = getSearchInputValue();
    let filteredTasks = filterTodos(input);
    let statuses = ["todo", "inprogress", "await", "done"];

    statuses.forEach(status => {
        updateTaskColumn(status, filteredTasks);
    });
}

function getSearchInputValue() {
    let input = document.getElementById("searchTasks");
    return input ? input.value.toLowerCase() : '';
}

function filterTodos(input) {
    return todos.filter(task =>
        task.title.toLowerCase().includes(input) ||
        task.description.toLowerCase().includes(input)
    );
}

function updateTaskColumn(status, filteredTasks) {
    let taskDiv = document.getElementById("drag-and-drop-" + status);
    let tasks = filteredTasks.filter(t => t.status === status);

    if (!taskDiv) return;

    if (tasks.length > 0) {
        renderTasksInColumn(taskDiv, tasks);
    } else {
        renderEmptyStatusMessage(taskDiv, status);
    }
}

function renderTasksInColumn(taskDiv, tasks) {
    taskDiv.innerHTML = "";
    taskDiv.classList.remove("no-tasks-container");
    taskDiv.classList.add("task-columns");

    tasks.forEach(task => {
        let taskHTML = generateTodosHTML(task);
        taskDiv.innerHTML += taskHTML;
    });
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
