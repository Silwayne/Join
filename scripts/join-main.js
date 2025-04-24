// const firebaseURL = "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/";

function init(){
    renderHeader();
    initDropdownEvents();
    renderSidebar();
    renderSidebarResponsive();
    updateDate();
    updateTaskCounters();
  }

  async function updateTaskCounters() {
    const response = await fetch(firebaseURL + "tasks.json");
    const data = await response.json();
    const counts = {todo: 0, done: 0, urgent: 0, total: 0, progress: 0, feedback: 0};
  
    for (let tasks of Object.values(data)) {
      counts.total++;
      if (tasks.status === "todo") counts.todo++;
      if (tasks.status === "done") counts.done++;
      if (tasks.status === "inprogress") counts.progress++;
      if (tasks.status === "await") counts.feedback++;
      if (tasks.priority?.toLowerCase() === "urgent") counts.urgent++;
    }
  
    ["todo","done","urgent","total","progress","feedback"]
      .forEach(key => document.getElementById(`count-${key}`).textContent = counts[key]);
  }
  
  function getGreetingText() {
    let hours = new Date().getHours();
    let greetingText;
    if (hours >= 5 && hours < 12)  {
        greetingText = 'Good Morning';
    } else if (hours >= 12 && hours < 18) {
        greetingText = 'Good Afternoon';
    } else {
        greetingText = 'Good Evening';
    }
    return greetingText;
  }

  function getFormattedDate() {
    const date = new Date(); 
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options); 
}

function updateDate() {
    const formattedDate = getFormattedDate(); 
    document.querySelector('.card-middle-date').textContent = formattedDate; 
}

window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("greeting-overlay");
  if (window.innerWidth >= 1005) return overlay.style.display = "none";

  const greetEl = document.getElementById("greeting-text");
  const nameEl = document.getElementById("greeting-name");
  const name = sessionStorage.getItem("userName") || "Gast";
  const color = sessionStorage.getItem("userColor") || "black";

  greetEl.textContent = getGreetingText() + ",";
  nameEl.textContent = name;
  nameEl.style.color = color;
  greetEl.classList.add("show-greeting");
  nameEl.classList.add("show-name");

  setTimeout(() => {overlay.style.opacity = "0"; setTimeout(() => overlay.style.display = "none", 1000);}, 3000);

});
