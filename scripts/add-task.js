function init(content) {
  selectContacts("dropdownMenu");
  renderSidebar();
  initHTML(content);
  renderHeader();
}

let countContactsID = 0;
let counter = 0;
let contactColors = {};
let priority = "Medium";
let overlayContacts = [];
let names = [];

function updateIcons(taskId) {
<<<<<<< HEAD
    let id = '';
    if (taskId === 0 || taskId) {
        id = '_' + taskId;
    }

    let input = document.getElementById('subtaskInput' + id);
    let plus = document.getElementById('plusIcon' + id);
    let check = document.getElementById('checkIcon' + id);
    let cancel = document.getElementById('cancelIcon' + id);

    if (!input || !plus || !check || !cancel) return;

    if (input.value.trim() !== '') {
        plus.classList.add('d_none');
        check.classList.remove('d_none');
        cancel.classList.remove('d_none');
    } else {
        plus.classList.remove('d_none');
        check.classList.add('d_none');
        cancel.classList.add('d_none');
    }
=======
  let id = "";
  if (taskId === 0 || taskId) {
    id = "_" + taskId;
  }
  let input = document.getElementById("subtaskInput" + id);
  let plus = document.getElementById("plusIcon" + id);
  let check = document.getElementById("checkIcon" + id);
  let cancel = document.getElementById("cancelIcon" + id);
  if (!input || !plus || !check || !cancel) return;
  if (input.value.trim() !== "") {
    plus.classList.add("d_none");
    check.classList.remove("d_none");
    cancel.classList.remove("d_none");
  } else {
    plus.classList.remove("d_none");
    check.classList.add("d_none");
    cancel.classList.add("d_none");
  }
>>>>>>> 8a6110b87a3153487d3c5d3dce32538c69b6dd5b
}

function clearSubTaskInput(taskId) {
<<<<<<< HEAD
    let id = '';
    if (taskId !== undefined && taskId !== '') {
        id = '_' + taskId;
    }

    let input = document.getElementById('subtaskInput' + id);
    if (!input) return;

    input.value = '';
    updateIcons(taskId);
=======
  let id = "";
  if (taskId !== undefined && taskId !== "") {
    id = "_" + taskId;
  }
  let input = document.getElementById("subtaskInput" + id);
  if (!input) return;
  input.value = "";
  updateIcons(taskId);
>>>>>>> 8a6110b87a3153487d3c5d3dce32538c69b6dd5b
}

function addSubTaskInput(taskId) {
<<<<<<< HEAD
    let id = '';
    if (taskId === 0 || taskId) {
        id = '_' + taskId;
    }

    let input = document.getElementById('subtaskInput' + id);
    let list = document.getElementById('subtasks' + id);
    let errorMsg = document.getElementById('subtask-error' + id);
    let container = document.getElementById('subtask-container' + id);

    if (!input || !list || !errorMsg || !container) return;

    let value = input.value.trim();
    if (value === '') return;

    if (list.children.length >= 2) {
        container.classList.add('input-error');
        errorMsg.classList.remove('d_none');
        return;
    }

    container.classList.remove('input-error');
    errorMsg.classList.add('d_none');
    list.classList.remove('d_none');

    let length = 0;
    while (document.getElementById('task_' + length)) {
        length++;
    }

    let li = document.createElement('div');
    let subId = 'task_' + length;
    li.id = subId;
    li.innerHTML = li.innerHTML = `
    <div class="subtask-item">
      <div class="subtask-value">
        <img class="dot" src="/assets/img/Subtasks icons11.svg">
        ${value}
      </div>
      <div class="subtask-trash-img">
        <img src="/assets/img/delete.svg" onclick="deleteSubTask('${subId}', ${taskId})">
      </div>
    </div>
  `;


    list.appendChild(li);
    input.value = '';
    updateIcons(taskId);
}

function deleteSubTask(subtaskId, taskId) {
    let item = document.getElementById(subtaskId);
    if (item) item.remove();
    let id = '';
    if (taskId === 0 || taskId) {
        id = '_' + taskId;
    }
    let list = document.getElementById('subtasks' + id);
    let container = document.getElementById('subtask-container' + id);
    let errorMsg = document.getElementById('subtask-error' + id);
=======
  let id = formatTaskId(taskId);
  let input = document.getElementById("subtaskInput" + id);
  let list = document.getElementById("subtasks" + id);
  let container = document.getElementById("subtask-container" + id);
  let errorMsg = document.getElementById("subtask-error" + id);

  if (!input || !list || !errorMsg || !container) return;
  handleSubtaskInput(input, list, container, errorMsg, taskId);
}

function formatTaskId(taskId) {
  return taskId || taskId === 0 ? `_${taskId}` : "";
}

function handleSubtaskInput(input, list, container, errorMsg, taskId) {
  let value = input.value.trim();
  if (!value) return;
  if (list.children.length >= 2) {
    showSubtaskError(container, errorMsg);
    return;
  }
  addSubtask(list, container, errorMsg, value, taskId);
}

function showSubtaskError(container, errorMsg) {
  container.classList.add("input-error");
  errorMsg.classList.remove("d_none");
}

function addSubtask(list, container, errorMsg, value, taskId) {
  container.classList.remove("input-error");
  errorMsg.classList.add("d_none");
  list.classList.remove("d_none");

  let subId = generateSubTaskId();
  let li = createSubTaskElement(subId, value, taskId);
  list.appendChild(li);

  document.getElementById("subtaskInput" + formatTaskId(taskId)).value = "";
  updateIcons(taskId);
}

function generateSubTaskId() {
  let i = 0;
  while (document.getElementById("task_" + i)) {
    i++;
  }
  return "task_" + i;
}
>>>>>>> 8a6110b87a3153487d3c5d3dce32538c69b6dd5b

function createSubTaskElement(subId, value, taskId) {
  let li = document.createElement("div");
  li.id = subId;
  li.innerHTML = getSubtaskHTML(subId, value, taskId);
  return li;
}

function deleteSubTask(subtaskId, taskId) {
  let item = document.getElementById(subtaskId);
  if (item) item.remove();
  let id = "";
  if (taskId === 0 || taskId) {
    id = "_" + taskId;
  }
  let list = document.getElementById("subtasks" + id);
  let container = document.getElementById("subtask-container" + id);
  let errorMsg = document.getElementById("subtask-error" + id);

  if (list && list.children.length < 2) {
    container.classList.remove("input-error");
    errorMsg.classList.add("d_none");
  }
}



function editSubTask(taskIdNumber) {
<<<<<<< HEAD
    let taskItem = document.getElementById('task_' + taskIdNumber);
    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = taskItem.textContent.trim();
    let parentUl = taskItem.parentElement;
    parentUl.style.listStyleType = "none";
    taskItem.innerHTML = "";
    taskItem.appendChild(inputField);
    document.getElementById('imgID_' + taskIdNumber).src = "/assets/img/check.svg";
    document.getElementById('imgID_' + taskIdNumber).onclick = function () { saveSubTask(inputField, taskIdNumber) };
    inputField.addEventListener("blur", function () {
        saveSubTask(inputField, taskIdNumber);
    });

}

function saveSubTask(inputField, taskIdNumber) {
    let updatedText = inputField.value.trim();
    let taskItem = document.getElementById('task_' + taskIdNumber);
    if (updatedText !== "") {
        taskItem.innerHTML = updatedText;
    } else {
        deleteSubtask(taskIdNumber)
    }
    let parentUl = taskItem.parentElement;
    parentUl.style.listStyleType = "disc";
    document.getElementById('imgID_' + taskIdNumber).src = "/assets/img/edit.svg";
    document.getElementById('imgID_' + taskIdNumber).onclick = function () { editSubTask(taskIdNumber) };
=======
  let taskItem = document.getElementById("task_" + taskIdNumber);
  let inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = taskItem.textContent.trim();
  let parentUl = taskItem.parentElement;
  parentUl.style.listStyleType = "none";
  taskItem.innerHTML = "";
  taskItem.appendChild(inputField);
  document.getElementById("imgID_" + taskIdNumber).src =
    "/assets/img/check.svg";
  document.getElementById("imgID_" + taskIdNumber).onclick = function () {
    saveSubTask(inputField, taskIdNumber);
  };
  inputField.addEventListener("blur", function () {
    saveSubTask(inputField, taskIdNumber);
  });
}

function saveSubTask(inputField, taskIdNumber) {
  let updatedText = inputField.value.trim();
  let taskItem = document.getElementById("task_" + taskIdNumber);
  if (updatedText !== "") {
    taskItem.innerHTML = updatedText;
  } else {
    deleteSubTask(taskIdNumber);
  }
  let parentUl = taskItem.parentElement;
  parentUl.style.listStyleType = "disc";
  document.getElementById("imgID_" + taskIdNumber).src = "/assets/img/edit.svg";
  document.getElementById("imgID_" + taskIdNumber).onclick = function () {
    editSubTask(taskIdNumber);
  };
>>>>>>> 8a6110b87a3153487d3c5d3dce32538c69b6dd5b
}

function swapToUrgent(elementId) {
  let element = document.getElementById(elementId);
  element.classList.add("prio-urgent");
  element.classList.remove("prio-medium", "prio-low");
  element.classList.add("bold");

  clearPriorityStyles(getSiblingId(elementId, "medium"));
  clearPriorityStyles(getSiblingId(elementId, "low"));

  element.innerHTML = `<p>Urgent <img src="/assets/img/Prio-alta-white.svg"></p>`;
  priority = "Urgent";
}

function swapToMedium(elementId) {
  let element = document.getElementById(elementId);
  element.classList.add("prio-medium");
  element.classList.remove("prio-urgent", "prio-low");
  element.classList.add("bold");

  clearPriorityStyles(getSiblingId(elementId, "urgent"));
  clearPriorityStyles(getSiblingId(elementId, "low"));

  element.innerHTML = `<p>Medium <img src="/assets/img/Prio-media-white.svg"></p>`;
  priority = "Medium";
}

function swapToLow(elementId) {
  let element = document.getElementById(elementId);
  element.classList.add("prio-low");
  element.classList.remove("prio-urgent", "prio-medium");
  element.classList.add("bold");

  clearPriorityStyles(getSiblingId(elementId, "urgent"));
  clearPriorityStyles(getSiblingId(elementId, "medium"));

  element.innerHTML = `<p>Low <img src="/assets/img/Prio-low-white.svg"></p>`;
  priority = "Low";
}

function clearPriorityStyles(elementId) {
  let element = document.getElementById(elementId);
  element.classList.remove("prio-urgent", "prio-medium", "prio-low", "bold");

  if (elementId.includes("urgent")) {
    element.innerHTML = `<p>Urgent <img src="/assets/img/Prio-alta-red.svg"></p>`;
  } else if (elementId.includes("medium")) {
    element.innerHTML = `<p>Medium <img src="/assets/img/Prio-media-orange.svg"></p>`;
  } else if (elementId.includes("low")) {
    element.innerHTML = `<p>Low <img src="/assets/img/Prio-low-green.svg"></p>`;
  }
}

function getSiblingId(currentId, targetPriority) {
  let parts = currentId.split("_");

  if (parts.length === 2) {
    let suffix = parts[1];
    return `prio-${targetPriority}_${suffix}`;
  } else {
    return `prio-${targetPriority}`;
  }
}




async function selectContacts(id) {
<<<<<<< HEAD

    let response = await fetch(firebaseURL + 'users.json');
    let firebaseAnswer = await response.json();
    let taskId = ""
    if (id !== "dropdownMenu") {
        taskId = "_"+ id
    }

    let dropDownMenu = document.getElementById('dropdownMenu' + taskId);

    if (!dropDownMenu) return;

    dropDownMenu.innerHTML = '';
    let localCounter = 0;
    for (let key in firebaseAnswer) {
        let contact = firebaseAnswer[key];
        let contactName = contact.name;
        let contactInitials = getInitials(contactName);
        let contactColor = contact.color;
        contactColors[contactName] = contactColor;
        if (!names.includes(contactName)) {
            names.push(contactName);
        }

        let isChecked = overlayContacts.includes(contactName);
        dropDownMenu.innerHTML += getContactListHTML(
            contactInitials,
            contactName,
            localCounter,
            contactColor,
            id,
            isChecked
        );


        let checkbox = document.getElementById('contactID_' + localCounter);
        if (checkbox) {
            checkbox.addEventListener('click', function () {
                handleContactSelection(contactName, this.checked, id);
            });
        }

        localCounter++;
    }
}

=======
  let response = await fetch(firebaseURL + "users.json");
  let firebaseAnswer = await response.json();
  let taskId = id !== "dropdownMenu" ? "_" + id : "";
  let dropDownMenu = document.getElementById("dropdownMenu" + taskId);
  if (!dropDownMenu) return;
  prepareDropdown(dropDownMenu);
  renderContacts(firebaseAnswer, dropDownMenu, id);
}

function prepareDropdown(dropDownMenu) {
  dropDownMenu.innerHTML = "";
}

function renderContacts(firebaseAnswer, dropDownMenu, id) {
  let localCounter = 0;
  for (let key in firebaseAnswer) {
    let contact = firebaseAnswer[key];
    renderSingleContact(contact, dropDownMenu, id, localCounter);
    localCounter++;
  }
}

function renderSingleContact(contact, dropDownMenu, id, localCounter) {
  let contactName = contact.name;
  contactColors[contactName] = contact.color;
  if (!names.includes(contactName)) names.push(contactName);
  let isChecked = overlayContacts.includes(contactName);

  dropDownMenu.innerHTML += getContactListHTML(
    getInitials(contactName),
    contactName,
    localCounter,
    contact.color,
    id,
    isChecked
  );
  addCheckboxListener(contactName, localCounter, id);
}

function addCheckboxListener(contactName, localCounter, id) {
  let checkbox = document.getElementById("contactID_" + localCounter);
  if (checkbox) {
    checkbox.addEventListener("click", function () {
      handleContactSelection(contactName, this.checked, id);
    });
  }
}
>>>>>>> 8a6110b87a3153487d3c5d3dce32538c69b6dd5b

function handleContactSelection(name, checked, id) {
  if (checked) {
    if (!overlayContacts.includes(name)) {
      overlayContacts.push(name);
    }
  } else {
    overlayContacts = overlayContacts.filter((n) => n !== name);
  }
  renderAssignedContacts(id);
}




function getContactListHTML(contactInitials, contactName, idNumber, bgColor, id, isChecked) {
    let fontColor = ""
    let checkboxImage;
    let backgroundClass = "";

    if (isChecked === true) {
        checkboxImage = "../assets/img/checked.svg";
        backgroundClass = "blue-background";
        fontColor = "white-font";

    } else {
        checkboxImage = "../assets/img/unchecked.svg";
        fontColor = "normal-font";

    }

    return `
        <div class="grey-contact-list contact-list ${backgroundClass}" id="background_${idNumber}" onclick="toggleContactCheckbox(this, '${contactName}', '${idNumber}')">
            <label class="contact-list-label">
                <div class="user-icon" style="background-color: ${bgColor};">
                    <span class="user-initials">${contactInitials}</span>
                </div>
                <span class="contact-name ${fontColor}">${contactName}</span>
                <div class="custom-checkbox">
                    <img src="${checkboxImage}" id="contact-checkbox-img-${idNumber}" class="checkbox-img">
                </div>
            </label>
        </div>
    `;
}

function toggleContactCheckbox(element, contactName, idNumber) {
  let img = element.querySelector("img");
  let nameSpan = element.querySelector(".contact-name");
  let isChecked = overlayContacts.includes(contactName);

  if (isChecked) {
    overlayContacts = overlayContacts.filter((name) => name !== contactName);
    img.src = "../assets/img/unchecked.svg";
    element.classList.remove("blue-background");
    element.classList.add("grey-contact-list");
    nameSpan.classList.remove("white-font");
    nameSpan.classList.add("normal-font");
  } else {
    overlayContacts.push(contactName);
    img.src = "../assets/img/checked.svg";
    element.classList.add("blue-background");
    element.classList.remove("grey-contact-list");
    nameSpan.classList.add("white-font");
    nameSpan.classList.remove("normal-font");
  }
  renderAssignedContacts(idNumber);
}





function getInitials(name) {
  let nameParts = name.trim().split(" ");
  let firstInitial = nameParts[0].charAt(0).toUpperCase();
  let secondInitial =
    nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : "";
  return firstInitial + secondInitial;
}

function showContacts(id) {
<<<<<<< HEAD

    let taskId = "";
    if (id !== "contact-container") {
        taskId = "_" + id;
    }

    let inputContainer = document.getElementById('contact-container' + taskId);
    let assignedContainer = document.getElementById('assignedContactsContainer' + taskId);
    let arrow = document.getElementById('arrow-drop-down' + taskId);
    let dropDownMenu = document.getElementById('dropdownMenu' + taskId);

    if (!inputContainer || !assignedContainer || !arrow || !dropDownMenu) {
        return;
    }

    assignedContainer.classList.add('d_none');
    inputContainer.onclick = null;    
    arrow.innerHTML = `
=======
  let taskId = formatContactTaskId(id);
  let inputContainer = document.getElementById("contact-container" + taskId);
  let assignedContainer = document.getElementById(
    "assignedContactsContainer" + taskId
  );
  let arrow = document.getElementById("arrow-drop-down" + taskId);
  let dropDownMenu = document.getElementById("dropdownMenu" + taskId);

  if (!inputContainer || !assignedContainer || !arrow || !dropDownMenu) return;
  prepareContactDropdown(inputContainer, assignedContainer, arrow, dropDownMenu, id
  );
}

function formatContactTaskId(id) {
  return id !== "contact-container" ? "_" + id : "";
}

function prepareContactDropdown(inputContainer, assignedContainer, arrow, dropDownMenu, id) {
  assignedContainer.classList.add("d_none");
  inputContainer.onclick = null;
  setArrowToHide(arrow, id);
  dropDownMenu.classList.remove("d_none");
}

function setArrowToHide(arrow, id) {
  arrow.innerHTML = `
>>>>>>> 8a6110b87a3153487d3c5d3dce32538c69b6dd5b
        <img onclick="hideContacts(event, '${id}')" src="/assets/img/arrow_drop_downaa.svg">
    `;

    dropDownMenu.classList.remove('d_none');
}

<<<<<<< HEAD


function hideContacts(event, id) {    
    event.stopPropagation();
    let taskId = '';
    if (id !== 'contact-container') {
        taskId = "_"+id;
    }

    let container = document.getElementById('assignedContactsContainer' +taskId);
    let arrow = document.getElementById('arrow-drop-down' +taskId);
    let dropDownMenu = document.getElementById('dropdownMenu' +taskId);
    let inputContainer = document.getElementById('contact-container' +taskId);

    if (container) container.classList.remove('d_none');
    if (arrow) {
        arrow.innerHTML = `
            <img onclick="hideContacts(event, '${id}')" src="/assets/img/arrow_drop_down.svg">
        `;
    }
    if (dropDownMenu) dropDownMenu.classList.add('d_none');
    if (inputContainer) inputContainer.onclick = () => showContacts(id); 
        renderAssignedContacts(id);
}


function renderAssignedContacts(id) {        
    let taskId = '';
    if (id !== "contact-container") {
        taskId = '_'+ id;
    }

    let container = document.getElementById('assignedContactsContainer' + taskId);
    if (!container) return;
    container.innerHTML = '';    

    for (let i = 0; i < overlayContacts.length; i++) {
        let name = overlayContacts[i];
        let initials = getInitials(name);
        let color = contactColors[name];

        container.innerHTML += `
            <div class="user-icon" style="background-color: ${color};">
                <span class="user-initials">${initials}</span>
            </div>
        `;
    }
=======
function hideContacts(event, id) {
  event.stopPropagation();
  let taskId = formatContactTaskId(id);
  let container = document.getElementById("assignedContactsContainer" + taskId);
  let arrow = document.getElementById("arrow-drop-down" + taskId);
  let dropDownMenu = document.getElementById("dropdownMenu" + taskId);
  let inputContainer = document.getElementById("contact-container" + taskId);

  toggleContactDropdown(container, arrow, dropDownMenu, inputContainer, id);
  renderAssignedContacts(id);
}

function toggleContactDropdown(container, arrow, dropDownMenu, inputContainer, id) {
  if (container) container.classList.remove("d_none");
  if (arrow) setArrowToShow(arrow, id);
  if (dropDownMenu) dropDownMenu.classList.add("d_none");
  if (inputContainer) inputContainer.onclick = () => showContacts(id);
}

function setArrowToShow(arrow, id) {
  arrow.innerHTML = `
        <img onclick="hideContacts(event, '${id}')" src="/assets/img/arrow_drop_down.svg">
    `;
}

function renderAssignedContacts(id) {
  let taskId = formatContactTaskId(id);
  let container = document.getElementById("assignedContactsContainer" + taskId);
  if (!container) return;
  clearContainer(container);
  renderOverlayContacts(container);
}

function clearContainer(container) {
  container.innerHTML = "";
}

function renderOverlayContacts(container) {
  for (let i = 0; i < overlayContacts.length; i++) {
    let name = overlayContacts[i];
    container.innerHTML += createContactIconHTML(name);
  }
>>>>>>> 8a6110b87a3153487d3c5d3dce32538c69b6dd5b
}


function filterNames(id) {
<<<<<<< HEAD
    let taskId = '';
    if (id !== 'assignedContactsContainer') {
        taskId = '_' + id;
    }

    let assignedContainer = document.getElementById('assignedContactsContainer' + taskId);
    if (assignedContainer) assignedContainer.classList.add('d_none');

    let inputField = document.getElementById('dropdownInput' + taskId);
    if (!inputField) return;

    let input = inputField.value.toLowerCase();
    let resultsContainer = document.getElementById('dropdownMenu' + taskId);
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    let assigned = overlayContacts;
    let filteredNames = names.filter(name => name.toLowerCase().includes(input));
    if (filteredNames.length === 0) {
        showContacts(id); 
        return;
    }


    for (let contactName of filteredNames) {
        let contactInitials = getInitials(contactName);
        let isChecked = assigned.includes(contactName) ? 'checked' : '';

        resultsContainer.innerHTML += getFilteredContactHTML(contactInitials, contactName, isChecked, id);
    }
}
function setupSubtaskEnterKey(taskId = '') {
    let input = document.getElementById('subtaskInput' + taskId);
    if (!input) return;
=======
  let taskId = id !== "assignedContactsContainer" ? "_" + id : "";
  hideAssignedContacts(taskId);
  let inputField = document.getElementById("dropdownInput" + taskId);
  if (!inputField) return;
  let input = inputField.value.toLowerCase();
  filterAndRenderNames(input, taskId, id);
}

function hideAssignedContacts(taskId) {
  let assignedContainer = document.getElementById(
    "assignedContactsContainer" + taskId
  );
  if (assignedContainer) assignedContainer.classList.add("d_none");
}

function filterAndRenderNames(input, taskId, id) {
  let resultsContainer = document.getElementById("dropdownMenu" + taskId);
  if (!resultsContainer) return;
  resultsContainer.innerHTML = "";

  let filtered = names.filter((name) => name.toLowerCase().includes(input));
  if (filtered.length === 0) return showContacts(id);

  filtered.forEach((name) => {
    let initials = getInitials(name);
    let isChecked = overlayContacts.includes(name) ? "checked" : "";
    resultsContainer.innerHTML += getFilteredContactHTML(initials, name, isChecked, id);
  });
}

function setupSubtaskEnterKey(taskId = "") {
  let input = document.getElementById("subtaskInput" + taskId);
  if (!input) return;
>>>>>>> 8a6110b87a3153487d3c5d3dce32538c69b6dd5b

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubTaskInput(taskId);
    }
  });
}




function getFilteredContactHTML(contactInitials, contactName, isChecked, id) {
<<<<<<< HEAD
    let fontColor = "";
    let checkboxImage = "../assets/img/unchecked.svg";
    let backgroundClass = "";

    if (isChecked === 'checked') {
        checkboxImage = "../assets/img/checked.svg";
        backgroundClass = "blue-background";
        fontColor = "white-font";
    } else {
        fontColor = "normal-font";
    }

    let idNumber = contactName.replace(/\s+/g, '_');

    return `
        <div class="contact-list ${backgroundClass}" id="background_${idNumber}" onclick="toggleContactCheckbox(this, '${contactName}', '${idNumber}')">
            <label class="contact-list-label">
                <div class="user-icon" style="background-color: ${contactColors[contactName]};">
                    <span class="user-initials">${contactInitials}</span>
                </div>
                <span class="contact-name ${fontColor}">${contactName}</span>
                <div class="custom-checkbox">
                    <img src="${checkboxImage}" id="contact-checkbox-img-${idNumber}" class="checkbox-img">
                </div>
            </label>
        </div>
    `;
}




function clearTaskForm() {
    let subTaskInput = document.getElementById('subtaskInput');
    if (subTaskInput) {
        subTaskInput.value = '';
        updateIcons()
    }
    let titleInput = document.getElementById('add-task-title');
    if (titleInput) {
        titleInput.value = '';
    }
    let descriptionInput = document.getElementById('description-input');
    if (descriptionInput) {
        descriptionInput.value = '';
    }

    overlayContacts= [];
    let checkboxes = document.querySelectorAll('.contact-checkbox');
    for (let checkbox of checkboxes) {
        checkbox.checked = false;
    }
    renderAssignedContacts('assignedContactsContainer', []);

    let dueDateInput = document.getElementById('due-date');
    if (dueDateInput) {
        dueDateInput.value = '';
    }
    document.getElementById('category').value = '';
    document.getElementById('subtask-container').classList.remove('input-error');
    document.getElementById('subtask-error').classList.add('d_none');
    document.getElementById('subtasks').innerHTML = '';
    resetValidation(document.getElementById('add-task-title'));
    resetValidation(document.getElementById('due-date'));
    resetValidation(document.getElementById('category'));
    swapToMedium('prio-medium')
}

function checkValidations() {
    let isValid = true;

    let titleInput = document.getElementById('add-task-title');
    let dueDateInput = document.getElementById('due-date');
    let categorySelect = document.getElementById('category');

    resetValidation(titleInput);
    resetValidation(dueDateInput);
    resetValidation(categorySelect);

    if (titleInput.value.trim() === '') {
        showValidationError(titleInput, 'Title is required');
        isValid = false;
    }

    if (dueDateInput.value.trim() === '') {
        showValidationError(dueDateInput, 'Due date is required');
        isValid = false;
    }

    if (categorySelect.value.trim() === '') {
        showValidationError(categorySelect, 'Category is required');
        isValid = false;
    }
    return isValid;
=======
  let { checkboxImage, backgroundClass, fontColor } =
    getFilteredContactStyles(isChecked);
  let idNumber = contactName.replace(/\s+/g, "_");
  return buildFilteredContactHTML(contactInitials, contactName, idNumber, checkboxImage, backgroundClass, fontColor);
}

function checkValidations() {
  let isValid = true;
  let titleInput = document.getElementById("add-task-title");
  let dueDateInput = document.getElementById("due-date");
  let categorySelect = document.getElementById("category");

  resetValidationFields(titleInput, dueDateInput, categorySelect);
  isValid &= validateField(titleInput, "Title is required");
  isValid &= validateField(dueDateInput, "Due date is required");
  isValid &= validateField(categorySelect, "Category is required");

  return !!isValid;
}

function resetValidationFields(titleInput, dueDateInput, categorySelect) {
  resetValidation(titleInput);
  resetValidation(dueDateInput);
  resetValidation(categorySelect);
}

function validateField(input, message) {
  if (input.value.trim() === "") {
    showValidationError(input, message);
    return false;
  }
  return true;
>>>>>>> 8a6110b87a3153487d3c5d3dce32538c69b6dd5b
}

function showValidationError(element, message) {
  element.classList.add("input-error");
  let errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.innerText = message;
  if (
    !element.nextElementSibling ||
    !element.nextElementSibling.classList.contains("error-message")
  ) {
    element.parentNode.insertBefore(errorMessage, element.nextSibling);
  }
}

function resetValidation(element) {
  element.classList.remove("input-error");

  let nextElem = element.nextElementSibling;
  if (nextElem && nextElem.classList.contains("error-message")) {
    nextElem.remove();
  }
}
<<<<<<< HEAD

function initHTML(content) {
    document.getElementById(content).innerHTML = `
    <div class="add-task-x">
    <h1 class="add-task-h1">Add Task</h1>
    <div onclick="removeAddTask()" id="addtaskx"><img src="../assets/img/close.svg"></div>
    </div>
    <div class="display-splitter">
    <section class="left-section">
        <div class="add-task-title">
            <p>Title<span class="red title-p">*</span></p>
            <input id="add-task-title" type="text" placeholder="Enter a title">
        </div>
        <div>
            <p>Description</p>
            <textarea id="description-input" type="text" placeholder="Enter a Description"></textarea>
        </div>
        
        <div class="assigned-div">
            <p>Assinged to</p>
            <div id="contact-container" class="input-container" onclick="showContacts('contact-container')">
            <input oninput="filterNames('assignedContactsContainer')" type="text" id="dropdownInput" placeholder="Select contacts to assign" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Select contacts to assign'"> <span class="arrow-drop-down" id="arrow-drop-down"><img src="/assets/img/arrow_drop_down.svg"></span>
            </div>
            <div class="selectedInitials" id="assignedContactsContainer"></div>
            <div class="dropdown-menu  d_none" id="dropdownMenu">
            </div>
        </div>
    </section>
    <div class="border"></div>
    <section class="right-section">
        <div class="date-div">
            <p for="due-date">Due date<span class="red">*</span></p>
            <input type="date" id="due-date" placeholder="Hallo" required>
        </div>
        <div>
            <p>Prio</p>
            <div class="prio-box">
                <div onclick="swapToUrgent('prio-urgent')" class="prio" id="prio-urgent">
                    <p>Urgent <img src="/assets/img/Prio-alta-red.svg"></p>
                </div>
                <div onclick="swapToMedium('prio-medium')" class="prio prio-medium bold" id="prio-medium">
                    <p>Medium <img src="/assets/img/Prio-media-white.svg"></p>
                </div>
                <div onclick="swapToLow('prio-low')" class="prio" id="prio-low">
                    <p>Low <img src="/assets/img/Prio-low-green.svg"></p>
                </div>
            </div>
        </div>
        <div class="category-div">
            <p for="category">Category<span class="red">*</span></p>
            <select id="category" name="category" required>
                <option value="">Select task category</option>
                <option value="Technical Task">Technical Task</option>
                <option value="User Story">User Story</option>
            </select>
        </div>

        <div>
        <div id="subtask-container" class="input-container">
            <input type="text" id="subtaskInput" placeholder="Add new subtask" oninput="updateIcons()">
            <div class="icons">
                <span id="plusIcon" class="icon"><img src="/assets/img/Subtasks icons11.svg"></span>
                <span id="checkIcon" class="icon d_none"><img onclick="clearSubTaskInput()" src="/assets/img/close.svg"></span>
                <span id="cancelIcon" class="icon d_none"><img onclick="addSubTaskInput()" src="/assets/img/check.svg"></span>

            </div>

           
    </div> <div class="d_none subtasks" id="subtasks"></div>
                          <div id="subtask-error" class="error-message d_none absolute">Max. 2 Subtasks erlaubt</div>

    </section>
    </div>

    
</span>
<section class="bottom-add-task-overlay-section">
<div class="fiel-Is-Required-Div">    
    <p><span class="red">*</span>This field is required</p>   
    </div>
    <div class="buttons-bottom-right">    
    <button class="create-clear-button" onclick="clearTaskForm()" id="clear-button">Clear <img src="/assets/img/Vector.svg"></button>
    <button class="create-clear-button" onclick="createTask()" id="createtask-button">Create Task <img src="/assets/img/check.svg"</button>
        </div>

</section>`
setupSubtaskEnterKey();

}
=======
>>>>>>> 8a6110b87a3153487d3c5d3dce32538c69b6dd5b
