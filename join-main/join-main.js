const firebaseURL = "https://join-log-in-1761a-default-rtdb.europe-west1.firebasedatabase.app/";

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
  
    for (let key in data) {
      const task = data[key];
  
      counts.total++;
  
      if (task.status === "todo") counts.todo++;
      if (task.status === "done") counts.done++;
      if (task.status === "inprogress") counts.progress++;
      if (task.status === "await") counts.feedback++;
      if (task.priority?.toLowerCase() === "urgent") counts.urgent++;
    }
  
    document.getElementById("count-todo").textContent = counts.todo;
    document.getElementById("count-done").textContent = counts.done;
    document.getElementById("count-urgent").textContent = counts.urgent;
    document.getElementById("count-total").textContent = counts.total;
    document.getElementById("count-progress").textContent = counts.progress;
    document.getElementById("count-feedback").textContent = counts.feedback;
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
    if (window.innerWidth < 1005) {
      const overlay = document.getElementById("greeting-overlay");
      const greetingTextEl = document.getElementById("greeting-text");
      const nameEl = document.getElementById("greeting-name");
  
      const greeting = getGreetingText();
      const userName = sessionStorage.getItem("userName") || "Gast";
      const userColor = sessionStorage.getItem("userColor") || "black";
  
      greetingTextEl.textContent = greeting + ",";
      nameEl.textContent = userName;
      nameEl.style.color = userColor;
  
      greetingTextEl.classList.add("show-greeting");
      nameEl.classList.add("show-name");
  
      setTimeout(() => {
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.style.display = "none";
        }, 1000); 
      }, 3000);
    } else {
     
      const overlay = document.getElementById("greeting-overlay");
      overlay.style.display = "none";
    }
  });