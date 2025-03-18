function init(){
    renderHeader('header')
    renderSidebar()
    renderRightSidebar()
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
    const date = new Date(); // Aktuelles Datum
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options); // Datum im amerikanischen Format
}

// Funktion zum Aktualisieren des Datums im HTML
function updateDate() {
    const formattedDate = getFormattedDate(); // Formatiertes Datum holen
    document.querySelector('.card-middle-date').textContent = formattedDate; // Datum einfügen
}



  