/**
 * Initializes the main page by rendering the header, sidebar, and updating the date and task counters.
 */
function init() {
    renderHeader();
    initDropdownEvents();
    renderSidebar();
    renderSidebarResponsive();
    updateDate();
    updateTaskCounters();
}



/**
 * Updates the task counters on the dashboard by fetching tasks from Firebase.
 * Counts tasks based on their status (e.g., "todo", "done", "urgent").
 * Updates the corresponding HTML elements with the counts.
 * @async
 */
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

/**
 * Returns a greeting text based on the current time of day.
 * @returns {string} - The greeting text ("Good Morning", "Good Afternoon", or "Good Evening").
 */
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

/**
 * Formats the current date into a readable string.
 * @returns {string} - The formatted date (e.g., "April 27, 2025").
 */
function getFormattedDate() {
    const date = new Date(); 
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options); 
}

/**
 * Updates the date displayed on the dashboard with the current formatted date.
 */
function updateDate() {
    const formattedDate = getFormattedDate(); 
    document.querySelector('.card-middle-date').textContent = formattedDate; 
}

/**
 * Displays a greeting overlay with the user's name and a greeting message.
 * The overlay is hidden after a short delay.
 */
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
