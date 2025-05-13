/**
 * Creates a new task by validating the form, collecting task data, and posting it to Firebase.
 * Clears the form, updates the board, and closes the Add Task overlay upon success.
 * @async
 */
async function createTask() {

  let isValid = checkValidations();  
  if (isValid) {
    await getTaskData();
    if (typeof updateBoardHTML === "function") {
      let successBoard = document.getElementById('success-board');
      generateSuccessBoardTask(successBoard)
      clearTaskForm()
      await updateBoardHTML();
      removeAddTask();
    }
    else {
      window.location.href = "board.html";
    }

  }
}

/**
 * Briefly shows a success animation on the board and fades it out.
 *
 * @param {HTMLElement} successBoard - The success element to animate.
 */
function generateSuccessBoardTask(successBoard) {
  successBoard.style.display = 'block';
  setTimeout(() => successBoard.style.opacity = '1', 10);
  setTimeout(() => {
    successBoard.style.opacity = '0';
    setTimeout(() => {
      successBoard.style.display = 'none';
    }, 500);
  }, 1000);
}

/**
 * Collects task data from the form, including title, description, due date, category, and subtasks.
 * Posts the collected data to Firebase.
 */
async function getTaskData() {
  let title = document.getElementById('add-task-title').value.trim();
  let description = document.getElementById('description-input').value.trim();
  let date = document.getElementById('due-date').value;
  let category = document.getElementById('category').value;
  let subtasks = [];
  let list = document.getElementById('subtasks');
  if (list) {
    let subtaskItems = list.querySelectorAll('.subtask-item');
    subtaskItems.forEach(item => {
      let value = item.querySelector('.subtask-value')?.innerText.trim();
      if (value && value !== '') {
        subtasks.push({ title: value, done: false });
      }
    });
  }

  if (taskProgress == '') {
    taskProgress = "todo"
  }

  await postToFireBase(title, description, overlayContacts, date, priority, category, subtasks, taskProgress);
}

/**
 * Posts a new task to Firebase.
 * @async
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {Array<string>} contacts - The list of contacts assigned to the task.
 * @param {string} date - The due date of the task in YYYY-MM-DD format.
 * @param {string} priority - The priority level of the task (e.g., "High", "Medium", "Low").
 * @param {string} category - The category of the task.
 * @param {Array<Object>} subtasks - The list of subtasks, each containing a title and a "done" status.
 */
async function postToFireBase(title, description, contacts, date, priority, category, subtasks, taskProgress) {

  let task = {
    'title': title,
    'description': description,
    'contacts': contacts,
    'date': date,
    'priority': priority,
    'category': category,
    'subtasks': subtasks,
    'status': taskProgress
  };
  let response = await fetch(firebaseURL + 'tasks.json', {
    method: 'POST',
    body: JSON.stringify(task),
    headers: {
      'Content-Type': 'application/json'
    }
  });

}

/**
 * Validates the Add Task form fields.
 * @returns {boolean} - True if all fields are valid, otherwise false.
 */
function checkValidations() {
    let titleInput = document.getElementById('add-task-title');
    let dueDateInput = document.getElementById('due-date');
    let categorySelect = document.getElementById('category');

    resetValidation(titleInput);
    resetValidation(dueDateInput);
    resetValidation(categorySelect);
    return checkallValidationInputs(titleInput, dueDateInput, categorySelect);
}
/**
 * Validates required form inputs for title, due date, and category.
 * Displays error messages if fields are empty.
 *
 * @param {HTMLInputElement} titleInput - The input field for the task title.
 * @param {HTMLInputElement} dueDateInput - The input field for the due date.
 * @param {HTMLSelectElement} categorySelect - The select field for the category.
 * @returns {boolean} True if all inputs are valid, otherwise false.
 */
function checkallValidationInputs(titleInput, dueDateInput, categorySelect) {
    let isValid = true;

    if (titleInput.value.trim() === '') {
        showValidationError(titleInput, 'Title is required');
        isValid = false;
    }
    if (dueDateInput.value.trim() === '') {
        showValidationError(dueDateInput, 'Due date is required');
        isValid = false;
    }
       if (!isValidDateRange(dueDateInput.value)) {
        showValidationError(dueDateInput, 'Please select a valid date from today to 3 years ahead');
        isValid = false;
    }
    if (categorySelect.value.trim() === '') {
        showValidationError(categorySelect, 'Category is required');
        isValid = false;
    }

    return isValid;
}
/**
 * Validates whether a given date string falls within the allowed range:
 * from today (inclusive) up to 3 years in the future.
 *
 * @param {string} dateString - The date input string in 'YYYY-MM-DD' format.
 * @returns {boolean} Returns true if the date is valid and within the range, otherwise false.
 */
function isValidDateRange(dateString) {
    if (!dateString) return false;

    let inputDate = new Date(dateString);
    if (isNaN(inputDate)) return false;

    let today = new Date();
    let maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 3);

    today.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate >= today && inputDate <= maxDate;
}


/**
 * Sets the priority of a task to "Urgent".
 * @param {string} elementId - The ID of the priority element.
 */
function swapToUrgent(elementId) {
    let element = document.getElementById(elementId);
    element.classList.add('prio-urgent');
    element.classList.remove('prio-medium', 'prio-low');
    element.classList.add('bold');

    clearPriorityStyles(getSiblingId(elementId, 'medium'));
    clearPriorityStyles(getSiblingId(elementId, 'low'));

    element.innerHTML = `<p>Urgent <img src="/assets/img/Prio-alta-white.svg"></p>`;
    priority = 'Urgent';
}

/**
 * Sets the priority of a task to "Medium".
 * @param {string} elementId - The ID of the priority element.
 */
function swapToMedium(elementId) {
    let element = document.getElementById(elementId);
    element.classList.add('prio-medium');
    element.classList.remove('prio-urgent', 'prio-low');
    element.classList.add('bold');

    clearPriorityStyles(getSiblingId(elementId, 'urgent'));
    clearPriorityStyles(getSiblingId(elementId, 'low'));

    element.innerHTML = `<p>Medium <img src="/assets/img/Prio-media-white.svg"></p>`;
    priority = 'Medium';
}

/**
 * Sets the priority of a task to "Low".
 * @param {string} elementId - The ID of the priority element.
 */
function swapToLow(elementId) {
    let element = document.getElementById(elementId);
    element.classList.add('prio-low');
    element.classList.remove('prio-urgent', 'prio-medium');
    element.classList.add('bold');

    clearPriorityStyles(getSiblingId(elementId, 'urgent'));
    clearPriorityStyles(getSiblingId(elementId, 'medium'));

    element.innerHTML = `<p>Low <img src="/assets/img/Prio-low-white.svg"></p>`;
    priority = 'Low';
}

/**
 * Adds a one-time global event listener that closes the contact dropdown
 * when clicking outside of it.
 *
 * @param {string} id - The task or container ID used to resolve related elements.
 */
function addContactCloser(id) {
    setTimeout(() => {
        let taskId = id !== 'contact-container' ? '_' + id : '';
        let dropDownMenu = document.getElementById('dropdownMenu' + taskId);
        let arrow = document.getElementById('arrow-drop-down' + taskId);
        let inputContainer = document.getElementById('contact-container' + taskId);

        let clickOutsideHandler = function (e) {
            if (
                dropDownMenu && !dropDownMenu.contains(e.target) &&
                arrow && !arrow.contains(e.target) &&
                inputContainer && !inputContainer.contains(e.target)
            ) {
                hideContacts(e, id);
                document.removeEventListener('pointerdown', clickOutsideHandler);
            }
        };

        document.addEventListener('pointerdown', clickOutsideHandler);
    }, 0);
}


/**
 * Hides the contact dropdown menu.
 * @param {Event} event - The event object.
 * @param {string} id - The ID of the dropdown menu.
 */
function hideContacts(event, id) {
    event.stopPropagation();
    let taskId = '';
    if (id !== 'contact-container') {
        taskId = "_" + id;
    }
    let container = document.getElementById('assignedContactsContainer' + taskId);
    let arrow = document.getElementById('arrow-drop-down' + taskId);
    let dropDownMenu = document.getElementById('dropdownMenu' + taskId);
    let inputContainer = document.getElementById('contact-container' + taskId);

    if (container) container.classList.remove('d_none');
    if (arrow) {
        getArrowHTMLWithShowContacts(arrow, id, dropDownMenu, inputContainer)

    }
}

/**
 * Renders the assigned contacts in the container.
 * @param {string} id - The ID of the container.
 */
function renderAssignedContacts(id) {
    let taskId = '';
    if (id !== "contact-container") {
        taskId = '_' + id;
    }
    let container = document.getElementById('assignedContactsContainer' + taskId);
    
    if (!container) return;
    container.innerHTML = '';
    let maxVisible = 4;
    let visibleContacts = overlayContacts.slice(0, maxVisible);
    let hiddenCount = overlayContacts.length - visibleContacts.length;
    generateVisibleContactsHTML(visibleContacts, container, contactColors, maxVisible, hiddenCount)
}

/**
 * Sets up the "Enter" key functionality for the subtask input field.
 * @param {string} [taskId=''] - The ID of the task or subtask.
 */
function setupSubtaskEnterKey(taskId = '') {
    let input = document.getElementById('subtaskInput' + taskId);
    if (!input) return;

    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSubTaskInput(taskId);
        }
    });
}

