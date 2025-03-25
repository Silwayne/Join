let todos = [
    {
        'id' : 0,
        'title': 'todo',
        'status': 'todo',
        'p': 'No tasks to do'   
    },
    {
        'id' : 1,
        'title': 'inprogress',
        'status': 'inprogress', 
        'p': 'No tasks in progress'  
    },
    {
        'id' : 2,
        'title': 'await',
        'status': 'await',
        'p' : 'No tasks to await'
    },
    {
        'id' : 3,
        'title': 'done',
        'status': 'done',
        'p': 'No tasks done'
    },
]

    let currentDraggedTask;

function allowDrop(ev){
    ev.preventDefault();
}

function updateBoardHTML() {
    const statuses = ['todo', 'inprogress', 'await', 'done'];

    for (let i = 0; i < statuses.length; i++) {
        let status = statuses[i];
        let taskDiv = document.getElementById('drag-and-drop-' + status);
        let tasks = todos.filter(t => t.status === status);
    
        if (tasks.length > 0) {
            taskDiv.innerHTML = '';
            taskDiv.classList.remove('no-tasks-container');
            for (let j = 0; j < tasks.length; j++) {
                taskDiv.innerHTML += generateTodosHTML(tasks[j]);
            }
        } else {
            taskDiv.innerHTML = `<p class="no-tasks-text">No tasks for ${status}</p>`;
            taskDiv.classList.add('no-tasks-container');
        }
    }
}





function moveTo(status){
    todos[currentDraggedTask]['status'] = status; 
    
    updateBoardHTML()
    console.log(status);

}

function generateTodosHTML(element){    
    return `<div draggable="true" ondragstart="moveTask(${element['id']})" class="drag-and-drop-box"></div>` 
}

function moveTask(id){
    currentDraggedTask = id 
}