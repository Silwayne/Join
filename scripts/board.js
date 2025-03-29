let todos = []
let currentDraggedTask;

function allowDrop(ev){
    ev.preventDefault();
}

async function updateBoardHTML() {
    await loadTasksFromFirebase();
    const statuses = ['todo', 'inprogress', 'await', 'done'];

    for (let i = 0; i < statuses.length; i++) {
        let status = statuses[i];
        let taskDiv = document.getElementById('drag-and-drop-' + status);
        let tasks = todos.filter(t => t.status === status);

        if (tasks.length > 0) {
            taskDiv.innerHTML = '';
            taskDiv.classList.remove('no-tasks-container');

            for (let m = 0; m < tasks.length; m++) {
                let taskHTML = await generateTodosHTML(tasks[m]);
                taskDiv.innerHTML += taskHTML;
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

async function getSelectedContactsFromAddTask(task) {
    let html = "";
    if (task.contacts) {
        for (let i = 0; i < task.contacts.length; i++) {
         
            let name = task.contacts[i];
            let color = await getContactColorFromFirebase(name);
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

async function getContactColorFromFirebase(contactName) {
    let response = await fetch(firebaseURL + 'users.json')  
    let contacts = await response.json()
    for (let key in contacts) {
        if (contacts[key].name === contactName) {
            return contacts[key].color
        }
    }
    return ''
}




async function generateTodosHTML(task) {
    let subtask = checkIfSubtasks(task);
    let progressBar = generateProgressBar(subtask, task);
    let contacts = await getSelectedContactsFromAddTask(task);
    let img = filterPriorityImage(task);

    return `
        <div draggable="true" onclick="openTaskBoxOverlay(${task.id})" ondragstart="moveTask(${task.id})" class="drag-and-drop-box">
            <div><p class="box-category-header-userstory ${task.category}">${task.category}</p></div>
            <div class="box-category-title">
                <p>${task.title}</p>
                <div class="box-category-descrition"><p>${task.description}</p></div>
            </div>
            ${progressBar}
            <div class="box-contacts-prio">
                <div class="user-icon-box">${contacts}</div>
                <div class="box-category-prio">${img}</div>                    
            </div>
        </div>
    `;
}
function openTaskBoxOverlay(id) {
    let task = todos.find(t => t.id === id);
    let taskOverlay = document.getElementById('task-overlay')
    generateTaskBoxContent(task)
    taskOverlay.classList.remove('d_none') 
    
}
function generateTaskBoxContent(task){
    let img =  filterPriorityImage(task)

    document.getElementById('task-content').innerHTML = `
      <div><p class="box-category-header-userstory ${task.category}">${task.category}</p></div>
        <div><p>${task.title}</p></div>
            <div><p>${task.description}</p></div>
            <div><p>Due date: ${task.date}</p></div>
                        <div><p>Priority:  ${task.priority}</p>${img}</div>
                                  
                                                    <div id="overlay-subtasks">${subtaskOverlayContent(task)}</div>

    `
}
//<div><p>Assignet to: ${contactsOverlayContent(task)}</p></div>
                                   // 
function subtaskOverlayContent(task) {
    if (task.subtasks) {
        let html = `<h4>Subtasks</h4><div class="subtasks-list">`;

        for (let i = 0; i < task.subtasks.length; i++) {
            let subtask = task.subtasks[i];
    
            html += `
                <div class="subtask-item">
                    <input type="checkbox" id="subtask-${i}" onchange="toggleSubtask(${task.id}, ${i})">
                    <label for="subtask-${i}">${subtask.title}</label>
                </div>
            `;
        }
    
        html += `</div>`;
        return html;
        
    }
    return ""

}
function toggleSubtask(id, index){
    document.getElementById('progress-'+id).style.width="50%"

}

function contactsOverlayContent(task){
    if (task.contacts) {
        console.log('Contakts');

    }
    
}




function moveTask(id){
    currentDraggedTask = id 
    
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

function generateProgressBar(subtask, task){
    if (subtask) {
        let progressBar;
        let done = 0;
        for (let i = 0; i < task.subtasks.length; i++) {
            if (task.subtasks[i].done === true) {
                done++;
            }
        }
        let progress = (done / 2) * 100;        
        return progressBar = `
            <div class="box-category-progress-subtasks-box">
                <div class="box-category-progress-bar">
                    <div id="progress-${task.id}" class="progress" style="width: ${progress}%;"></div>
                </div>
                <p class="subtask-description">${subtask}</p>
            </div>
        `;
    }
    return ""

}
function filterPriorityImage(task){
    let priority = task.priority.toLowerCase();

    if (priority === "low") {
        return '<img src="../assets/img/Prio-low-green.svg">';
    } else if (priority === "medium") {
        return '<img src="../assets/img/Prio-media-orange.svg">';
    }
    return '<img src="../assets/img/Prio-alta-red.svg">';
}
