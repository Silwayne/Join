function createTask() {
    let isValid = checkValidations()
    if (isValid) {
        getTaskData()
        clearTaskForm()
    }
    
}
function getTaskData(){
    let title = document.getElementById('add-task-title').value
    let description = document.getElementById('description-input').value
    let date = document.getElementById('due-date').value
    let category = document.getElementById('category').value
    let subtasks = [];
    let subTaskElement2 = document.getElementById('task_2')
    let subTaskElement1 = document.getElementById('task_1')
    if (subTaskElement1) {
        let subtask1 = subTaskElement1.textContent.trim();
        subtasks.push({ title: subtask1, done: false });
    
        if (subTaskElement2) {
            let subtask2 = subTaskElement2.textContent.trim();
            subtasks.push({ title: subtask2, done: false });
        }
    }
    postToFireBase(title, description, assignedContacts, date, priority, category, subtasks)
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
      

    const response = await fetch(firebaseURL +'tasks.json', {
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    console.log('Gespeichert:', data);
}
