/**
 * Renders the right sidebar by calling the function to generate its content.
 */
function renderRight() {
  renderRightSidebar();
}

/**
 * Generates the content for the right sidebar.
 * Displays a greeting message and the user's name with a dynamic color.
 * Retrieves the user's name and color from session storage.
 */
function renderRightSidebar() {
  let greetingText = getGreetingText();
  let userName = sessionStorage.getItem("userName") || "Gast";
  let userColor = sessionStorage.getItem("userColor") || "black";
  document.getElementById("right-sidebar").innerHTML = `
          <h2 id="greeting" class="dynamic-text">${greetingText},</h2>
          <p class="dynamic-name" style="color: ${userColor};">${userName}</p>
      `;
}
