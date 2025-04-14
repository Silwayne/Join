function init(){
    renderHeader();
    initDropdownEvents();
    renderSidebar();
    renderSidebarResponsive();
    updateDate();
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