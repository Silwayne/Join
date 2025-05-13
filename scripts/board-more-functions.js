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
      await noBoxHTMLGenerator(status, taskDiv);
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
 * Allows a drop event to occur by preventing the default behavior.
 * @param {DragEvent} ev - The drag event object.
 */
function allowDrop(ev) {
  ev.preventDefault();
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
 * Filters the tasks based on the search input.
 * @param {string} input - The search input value.
 * @returns {Array<Object>} - The filtered tasks.
 */
function filterTodos(input) {
  return todos.filter(
    (task) =>
      task.title.toLowerCase().includes(input) ||
      task.description.toLowerCase().includes(input)
  );
}
/**
 * Sets a one-time click event listener on the task overlay
 * to trigger the overlay close function.
 */
function hideDropDownContacts() {
  setTimeout(() => {
    document
      .getElementById("outer-task-overlay")
      ?.addEventListener("click", closeOverlay, { once: true });
  }, 0);
}

/**
 * Sets the minimum and maximum selectable dates on the date input.
 * Min is today, max is 3 years from today.
 */
function editDate() {
  let today = new Date();
  let futureLimit = new Date();
  futureLimit.setFullYear(today.getFullYear() + 3);
  let formattedMin = today.toISOString().split("T")[0];
  let formattedMax = futureLimit.toISOString().split("T")[0];
  let input = document.getElementById("edit-date");
  input.min = formattedMin;
  input.max = formattedMax;
}

/**
 * Extracts the text content of a subtask from its HTML element.
 * @param {HTMLElement} valueElement - The HTML element containing the subtask text.
 * @returns {string} - The text content of the subtask.
 */
function extractSubtaskText(valueElement) {
  if (!valueElement) return "";
  return Array.from(valueElement.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join("");
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
    (t) => t.title.trim() === subtaskText
  );
  return matchingSubtask ? matchingSubtask.done : false;
}
