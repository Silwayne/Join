/**
 * Creates a new task by validating the form, collecting task data, and posting it to Firebase.
 * Clears the form, updates the board, and closes the Add Task overlay upon success.
 * @async
 */
async function createTask() {
  let isValid = checkValidations();
  if (isValid) {
    getTaskData();
    clearTaskForm();
    const success = document.getElementById('success');
    success.style.display = 'block';
    setTimeout(() => success.style.opacity = '1', 10);
    setTimeout(() => {
      success.style.opacity = '0';
      setTimeout(() => {
        success.style.display = 'none';
        removeAddTask(); // <-- Jetzt erst nach dem Ausblenden!
      }, 500);
    }, 1000);
    if (typeof updateBoardHTML === "function") {
      await updateBoardHTML();

    }      
  }
}

  
/**
 * Collects task data from the form, including title, description, due date, category, and subtasks.
 * Posts the collected data to Firebase.
 */
function getTaskData() {
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

  postToFireBase(title, description, overlayContacts, date, priority, category, subtasks);
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
async function postToFireBase(title, description, contacts, date, priority, category, subtasks) {
  let task = {
      'title': title,
      'description': description,
      'contacts': contacts,
      'date': date,
      'priority': priority,
      'category': category,
      'subtasks' :subtasks,
      'status': 'todo'
    };
    

  let response = await fetch(firebaseURL +'tasks.json', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
          'Content-Type': 'application/json'
      }
  });

  let data = await response.json();
}