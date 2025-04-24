function renderRight() {
    renderRightSidebar();
}

function renderRightSidebar() {
    let greetingText = getGreetingText();
    let userName = sessionStorage.getItem("userName") || "Gast";
    let userColor = sessionStorage.getItem("userColor") || "black";
    document.getElementById("right-sidebar").innerHTML = `
          <h2 id="greeting" class="dynamic-text">${greetingText},</h2>
          <p class="dynamic-name" style="color: ${userColor};">${userName}</p>
      `;
  }