let todos = []
let currentDraggedTask;

function allowDrop(ev){
    ev.preventDefault();
}

async function updateBoardHTML() {
    await loadTasksFromFirebase()
    const statuses = ['todo', 'inprogress', 'await', 'done'];

    for (let i = 0; i < statuses.length; i++) {
        let status = statuses[i];
        let taskDiv = document.getElementById('drag-and-drop-' + status);
        let tasks = todos.filter(t => t.status === status);
        if (tasks.length > 0) {            
            taskDiv.innerHTML = '';
            taskDiv.classList.remove('no-tasks-container');
            for (let m = 0; m < tasks.length; m++) {
                let task = tasks[m]
                console.log(task);
                
                taskDiv.innerHTML += generateTodosHTML(task);
            }
        } else {
            taskDiv.innerHTML = `<p class="no-tasks-text">No tasks for ${status}</p>`;
            taskDiv.classList.add('no-tasks-container');
        }
    }
}

async function moveTo(status) {
    let task = todos[currentDraggedTask];
    task.status = status;
    await updateFireBaseData(task.firebaseID, task);
    updateBoardHTML();
}


function generateTodosHTML(task){    

    return `
            <div draggable="true" ondragstart="moveTask(${task.id})" class="drag-and-drop-box">
                    <div> <p class="box-category-header-userstory">User Story</p></div>
                    <div class="box-category-title"><p>${task.title}</p>
                        <div class="box-category-descrition"><p>Description</p></div>
                    </div>
                    <div class="box-category-progress-subtasks-box">
                    <div class="box-category-progress-bar"></div>
                    <h5>Subtasks</h5>
                    </div>
                    <div>
                    <div class=""></div>
                    <div class="box-category-prio"><img src=""></div>                    
                    </div>
            </div>
            ` 
}

function moveTask(id){
    currentDraggedTask = id 
    console.log(id);
    
}

async function updateFireBaseData(firebaseID, taskObj) {
    const url = `https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/tasks/${firebaseID}.json`;

    await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(taskObj),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
