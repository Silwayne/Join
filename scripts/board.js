/**
 * Array to store all tasks.
 * @type {Array<Object>}
 */
let todos = [];

/**
 * Stores the ID of the currently dragged task.
 * @type {number}
 */
let currentDraggedTask;
/**
 * Initializes the Add Task overlay by rendering the HTML and selecting contacts.
 * @param {string} content - The ID of the container where the HTML will be rendered.
 */
function initAddTask(content) {
  initHTML(content);
  selectContacts("dropdownMenu");
  minDateOfToday()

}

/**
 * Opens the Add Task overlay and resets the priority and selected contacts.
 * @param {Event} event - The event object.
 */
function addTask(event, id) {
  taskProgress = id
  overlayContacts = [];
  event.stopPropagation();
  priority = "Medium";
  document
    .getElementById("overlay-background")
    .classList.add("overlay-background");
  document.getElementById("add-task-overlay").classList.remove("d_none");
}

/**
 * Closes the Add Task overlay and removes the background overlay.
 */
function removeAddTask() {
  document.getElementById("add-task-overlay").classList.add("d_none");
  document.getElementById("overlay-background").classList.remove("overlay-background");
}

/**
 * Loads tasks from Firebase and filters invalid contacts.
 * Updates the global `todos` array with the loaded tasks.
 * @async
 */
async function loadTasksFromFirebase() {
  let response = await fetch(firebaseURL + "tasks.json");
  let firebaseData = await response.json();
  let tasksBoxContent = [];
  let index = 0;
  let validContactNames = Object.keys(contactColors);
  await loadFireBaseData(firebaseData, tasksBoxContent, index, validContactNames)
  todos = tasksBoxContent;
}

async function loadFireBaseData(firebaseData, tasksBoxContent, index, validContactNames){
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
  return tasksBoxContent

}

/**
 * Loads contact colors from Firebase and updates the `contactColors` object.
 * Filters invalid contacts from tasks.
 * @async
 */
async function loadContactColors() {
  let response = await fetch(firebaseURL + "users.json");
  let users = await response.json();
  contactColors = {};
  let validNames = [];
  await loadFromUserFirebase(users, validNames)

}
async function loadFromUserFirebase(users, validNames) {
  for (let key in users) {
    let user = users[key];
    contactColors[user.name] = user.color;
    validNames.push(user.name);
  }
  await loadTaskFromFirebase(validNames)
}
async function loadTaskFromFirebase(validNames) {
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


/**
 * Moves a task to a new status and updates it in Firebase.
 * @param {string} status - The new status of the task (e.g., "todo", "done").
 * @async
 */
async function moveTo(status) {
  let task = todos[currentDraggedTask];
  task.status = status;
  await updateFireBaseData(task.firebaseID, task);
  updateBoardHTML();
}

/**
 * Retrieves the color of a contact from Firebase.
 * @param {string} contactName - The name of the contact.
 * @returns {Promise<string>} - The color of the contact.
 * @async
 */
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

/**
 * Sets up the "Enter" key functionality for editing subtasks.
 * @param {number} taskId - The ID of the task or subtask.
 */
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

/**
 * Moves a task to a new status and updates it in Firebase.
 * @param {number} id - The ID of the task.
 * @param {string} newStatus - The new status of the task.
 * @async
 */
async function moveToStatus(id, newStatus) {
  let task = todos.find(t => t.id === id);
  if (!task) return;

  task.status = newStatus;
  await updateFireBaseData(task.firebaseID, task);
  updateBoardHTML();
}

/**
 * Closes all open tooltips on the board.
 */
function closeAllTooltips() {
  let tooltips = document.querySelectorAll('.tooltip-wrapper');
  for (let i = 0; i < tooltips.length; i++) {
    tooltips[i].classList.add('d_none');
  }
}

/**
 * Opens the task box overlay for a specific task.
 * @param {number} id - The ID of the task to display.
 */
function openTaskBoxOverlay(id) {
  let task = todos.find((t) => t.id === id);
  let taskOverlay = document.getElementById("task-overlay");
  let outerTaskOverlay = document.getElementById("outer-task-overlay");
  generateTaskBoxContent(task);
  outerTaskOverlay.style.display = "flex";
  taskOverlay.classList.remove("d_none");
}

/**
 * Closes the task overlay and updates the board HTML.
 * @async
 */
async function closeOverlay() {
  let taskOverlay = document.getElementById("task-overlay");
  taskOverlay.classList.add("d_none");
  let outerTaskOverlay = document.getElementById("outer-task-overlay");
  outerTaskOverlay.style.display = "none";
  await updateBoardHTML();
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
 * Toggles the completion status of a subtask and updates its progress.
 * @param {number} taskId - The ID of the task.
 * @param {number} subtaskIndex - The index of the subtask.
 * @param {HTMLElement} element - The HTML element representing the subtask.
 */
function toggleCustomSubtask(taskId, subtaskIndex, element) {
  let task = todos.find(t => t.id === taskId);
  if (!task) return;

  toggleSubtaskDone(task, subtaskIndex, element);
  updateSubtaskProgress(task);
  updateFireBaseData(task.firebaseID, task);
}

/**
 * Toggles the "done" status of a subtask and updates its checkbox image.
 * @param {Object} task - The task object containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask.
 * @param {HTMLElement} element - The HTML element representing the subtask.
 */
function toggleSubtaskDone(task, subtaskIndex, element) {
  let img = element.querySelector("img");
  let subtask = task.subtasks[subtaskIndex];

  subtask.done = !subtask.done;
  img.src = subtask.done ? "../assets/img/checked.svg" : "../assets/img/unchecked.svg";
}

/**
 * Updates the progress bar and counter for a task's subtasks.
 * @param {Object} task - The task object containing subtasks.
 */
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
 * Sets the ID of the currently dragged task.
 * @param {number} id - The ID of the task being dragged.
 */
function moveTask(id) {
  currentDraggedTask = id;
}

/**
 * Updates a task in Firebase with new data.
 * @param {string} firebaseID - The Firebase ID of the task.
 * @param {Object} taskObj - The updated task object.
 * @async
 */
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

/**
 * Checks if a task has subtasks and returns the progress as a string.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The progress of the subtasks (e.g., "2/3 Subtasks").
 */
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

/**
 * Filters the priority image based on the task's priority.
 * @param {Object} task - The task object containing the priority.
 * @returns {string} - The HTML string for the priority image.
 */
function filterPriorityImage(task) {
  let priority = task.priority.toLowerCase();

  if (priority === "low") {
    return '<img src="../assets/img/Prio-low-green.svg">';
  } else if (priority === "medium") {
    return '<img src="../assets/img/Prio-media-orange.svg">';
  }
  return '<img src="../assets/img/Prio-alta-red.svg">';
}

/**
 * Deletes a task from Firebase and updates the board.
 * @param {number} id - The ID of the task to delete.
 * @async
 */
async function deleteOverlay(id) {
  let task = todos.find((t) => t.id === id);
  if (!task) return;

  await fetch(`${firebaseURL}tasks/${task.firebaseID}.json`, {
    method: "DELETE",
  });

  closeOverlay();
  updateBoardHTML();
}

/**
 * Saves the edited task to Firebase and updates the board.
 * @param {number} id - The ID of the task to save.
 * @async
 */
async function saveEditedTask(id) {
  let task = todos.find(t => t.id === id);
  if (!task) return;
  let firebaseID = task.firebaseID;
  let updatedTask = buildUpdatedTask(id, task);
  await updateFireBaseData(firebaseID, updatedTask);
  await closeOverlay();
  await updateBoardHTML();
}

/**
 * Builds the updated task object with new values from the overlay.
 * @param {number} id - The ID of the task.
 * @param {Object} oldTask - The original task object.
 * @returns {Object} - The updated task object.
 */
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

/**
 * Retrieves the value of an input field based on its selector.
 * @param {string} selector - The CSS selector of the input field.
 * @returns {string} - The trimmed value of the input field.
 */
function getInputValue(selector) {
  let input = document.querySelector(selector);
  return input ? input.value.trim() : '';
}

/**
 * Collects the edited subtasks from the overlay.
 * @param {number} id - The ID of the task.
 * @param {Object} oldTask - The original task object.
 * @returns {Array<Object>} - The array of updated subtasks.
 */
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

/**
 * Extracts the text content of a subtask from its HTML element.
 * @param {HTMLElement} valueElement - The HTML element containing the subtask text.
 * @returns {string} - The text content of the subtask.
 */
function extractSubtaskText(valueElement) {
  if (!valueElement) return '';
  return Array.from(valueElement.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent.trim())
    .join('');
}

/**
 * Finds the "done" status of a subtask in the original task object.
 * @param {Object} oldTask - The original task object.
 * @param {string} subtaskText - The text of the subtask.
 * @returns {boolean} - The "done" status of the subtask.
 */
function findSubtaskDoneStatus(oldTask, subtaskText) {
  if (!oldTask.subtasks) return false;

  let matchingSubtask = oldTask.subtasks.find(
    t => t.title.trim() === subtaskText
  );
  return matchingSubtask ? matchingSubtask.done : false;
}

/**
 * Filters tasks based on the search input and updates the board.
 */
function filterTasks() {
  let input = getSearchInputValue();
  let filteredTasks = filterTodos(input);
  let statuses = ["todo", "inprogress", "await", "done"];

  statuses.forEach(status => {
    updateTaskColumn(status, filteredTasks);
  });
}

/**
 * Retrieves the value of the search input field.
 * @returns {string} - The lowercase value of the search input.
 */
function getSearchInputValue() {
  let input = document.getElementById("searchTasks");
  return input ? input.value.toLowerCase() : '';
}

/**
 * Filters the tasks based on the search input.
 * @param {string} input - The search input value.
 * @returns {Array<Object>} - The filtered tasks.
 */
function filterTodos(input) {
  return todos.filter(task =>
    task.title.toLowerCase().includes(input) ||
    task.description.toLowerCase().includes(input)
  );
}

/**
 * Updates a task column with filtered tasks or an empty message.
 * @param {string} status - The status of the task column (e.g., "todo", "done").
 * @param {Array<Object>} filteredTasks - The filtered tasks to display.
 */
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

/**
 * Renders tasks in a specific column.
 * @param {HTMLElement} taskDiv - The HTML element of the task column.
 * @param {Array<Object>} tasks - The tasks to render.
 */
function renderTasksInColumn(taskDiv, tasks) {
  taskDiv.innerHTML = "";
  taskDiv.classList.remove("no-tasks-container");
  taskDiv.classList.add("task-columns");

  tasks.forEach(task => {
    let taskHTML = generateTodosHTML(task);
    taskDiv.innerHTML += taskHTML;
  });
}

/**
 * Renders an empty message for a task column.
 * @param {HTMLElement} taskDiv - The HTML element of the task column.
 * @param {string} status - The status of the task column.
 */
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
