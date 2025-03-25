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
    let subtaks = [];
    let taskElement2 = document.getElementById('task_2')
    let taskElement1 = document.getElementById('task_1')
    if (taskElement1) {
        let subtask1 = taskElement1.textContent.trim();
        subtaks.push(subtask1);
        if (taskElement2) {
            let subtask2 = taskElement2.textContent.trim();
            subtaks.push(subtask2);
        }
    }
    pushToFireBase(title, description, assignedContacts, date, priority, category, subtaks)
}

async function pushToFireBase(title, description, contacts, date, priority, category, subtasks) {
    let task = {
        'title': title,
        'description': description,
        'contacts': contacts,
        'date': date,
        'priority': priority,
        'category': category,
        'subtasksCounter': subtasks.length, 
        'subtasks': subtasks,
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
