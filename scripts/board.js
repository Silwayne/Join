let todos = [];
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

/**
 * Loads tasks from Firebase data, assigns IDs, filters invalid contacts,
 * updates Firebase if necessary, and pushes tasks into the task list.
 *
 * @async
 * @param {Object} firebaseData - Raw data from Firebase.
 * @param {Array} tasksBoxContent - Array to store valid tasks.
 * @param {number} index - Starting index for task IDs.
 * @param {Array<string>} validContactNames - List of allowed contact names.
 * @returns {Promise<Array>} Updated array of tasks.
 */
async function loadFireBaseData(firebaseData, tasksBoxContent, index, validContactNames) {
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
  return tasksBoxContent;
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
/**
 * Loads user data from Firebase, stores their colors,
 * collects valid names, and loads their tasks.
 *
 * @async
 * @param {Object} users - Firebase user data.
 * @param {Array<string>} validNames - Array to store valid user names.
 */
async function loadFromUserFirebase(users, validNames) {
  for (let key in users) {
    let user = users[key];
    contactColors[user.name] = user.color;
    validNames.push(user.name);
  }
  await loadTaskFromFirebase(validNames);
}

/**
 * Filters invalid contact names from tasks and updates Firebase if needed.
 *
 * @async
 * @param {Array<string>} validNames - List of allowed contact names.
 */
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
 * Saves the edited task to Firebase and updates the board.
 * @param {number} id - The ID of the task to save.
 * @async
 */
async function saveEditedTask(id) {
  let dueDateInput = document.getElementById('edit-date');

  if (!isValidDateRange(dueDateInput.value)) {
    showValidationError(dueDateInput, 'Please select a valid date from today to 3 years ahead');
    return
  }
  let task = todos.find(t => t.id === id);
  if (!task) return;
  let firebaseID = task.firebaseID;
  let updatedTask = buildUpdatedTask(id, task);
  await updateFireBaseData(firebaseID, updatedTask);
  await closeOverlay();
  await updateBoardHTML();
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