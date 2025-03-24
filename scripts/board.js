let todos = [
    {
        'id' : 0,
        'title': 'todo',
        'status': 'todo'   
    },
    {
        'id' : 1,
        'title': 'inprogress',
        'status': 'inprogress'   
    },
    {
        'id' : 2,
        'title': 'await',
        'status': 'await'   
    },
    {
        'id' : 3,
        'title': 'done',
        'status': 'done'   
    },
]

    let currentDraggedTask;

function allowDrop(ev){
    ev.preventDefault();
}

function updateBoardHTML() {

    let todoDiv = document.getElementById('drag-and-drop-todo');
    let inprogressDiv = document.getElementById('drag-and-drop-inprogress');
    let awaitDiv = document.getElementById('drag-and-drop-await');
    let doneDiv = document.getElementById('drag-and-drop-done');

    // --------- TODO ---------
    let todo = todos.filter(t => t['status'] === 'todo');
    if (todo.length > 0) {
        todoDiv.innerHTML = '';
        todoDiv.classList.remove('no-tasks-container');
        for (let index = 0; index < todo.length; index++) {
            const element = todo[index];
            todoDiv.innerHTML += generateTodoHTML(element);
        }
    } else {
        todoDiv.innerHTML = `<p class="no-tasks-text">No tasks to do</p>`;
        todoDiv.classList.add('no-tasks-container');
    }

    // --------- IN PROGRESS ---------
    let inprogress = todos.filter(t => t['status'] === 'inprogress');
    if (inprogress.length > 0) {
        inprogressDiv.innerHTML = '';
        inprogressDiv.classList.remove('no-tasks-container');
        for (let index = 0; index < inprogress.length; index++) {
            const element = inprogress[index];
            inprogressDiv.innerHTML += generateTodoHTML(element);
        }
    } else {
        inprogressDiv.innerHTML = `<p class="no-tasks-text">No tasks in progress</p>`;
        inprogressDiv.classList.add('no-tasks-container');
    }

    // --------- AWAIT ---------
    let awaitTasks = todos.filter(t => t['status'] === 'await');
    if (awaitTasks.length > 0) {
        awaitDiv.innerHTML = '';
        awaitDiv.classList.remove('no-tasks-container');
        for (let index = 0; index < awaitTasks.length; index++) {
            const element = awaitTasks[index];
            awaitDiv.innerHTML += generateTodoHTML(element);
        }
    } else {
        awaitDiv.innerHTML = `<p class="no-tasks-text">No tasks awaiting</p>`;
        awaitDiv.classList.add('no-tasks-container');
    }

    // --------- DONE ---------
    let done = todos.filter(t => t['status'] === 'done');
    if (done.length > 0) {
        doneDiv.innerHTML = '';
        doneDiv.classList.remove('no-tasks-container');
        for (let index = 0; index < done.length; index++) {
            const element = done[index];
            doneDiv.innerHTML += generateTodoHTML(element);
        }
    } else {
        doneDiv.innerHTML = `<p class="no-tasks-text">No tasks done</p>`;
        doneDiv.classList.add('no-tasks-container');
    }
}





function moveTo(status){
    todos[currentDraggedTask]['status'] = status; 
    
    updateBoardHTML()
    console.log(status);

}

function generateTodoHTML(element){    
    return `<div draggable="true" ondragstart="moveTask(${element['id']})" class="drag-and-drop-box"></div>` 
}

function moveTask(id){
    currentDraggedTask = id 
}