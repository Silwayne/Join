async function createTask() {
  let isValid = checkValidations();
  if (isValid) {
      getTaskData();
      clearTaskForm();
      if (typeof updateBoardHTML === "function") {
        await updateBoardHTML();
        removeAddTask();
      }      
    }
    const success = document.getElementById('success');

    success.style.display = 'block';
    setTimeout(() => success.style.opacity = '1', 10);
    setTimeout(() => {
      success.style.opacity = '0';
      setTimeout(() => success.style.display = 'none', 500);
    }, 1000);
    }

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