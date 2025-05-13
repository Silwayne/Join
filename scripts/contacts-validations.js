/**
 * Validates the form inputs and provides feedback for invalid fields.
 * If all inputs are valid, the form is submitted.
 * @param {Event} event - The submit event from the form.
 * @returns {boolean} - Returns false to prevent default form submission if validation fails.
 */
function validateAndSubmitForm(event) {
  event.preventDefault();

  const formId = event.target.id;
  const key = event.target.getAttribute("data-key");

  const isValid = validateFormInputs();

  if (isValid) {
    handleFormSubmission(formId, key, event);
  }

  return false;
}

/**
 * Validates the form inputs for name, email, and phone.
 * Displays error messages for invalid fields.
 * @returns {boolean} - Returns true if all inputs are valid, otherwise false.
 */
function validateFormInputs() {
  let isValid = true;

  isValid = validateNameInput() && isValid;
  isValid = validateEmailInput() && isValid;
  isValid = validatePhoneInput() && isValid;

  return isValid;
}

/**
 * Validates the name input field.
 * Checks if the name is not empty and displays an error if invalid.
 * @returns {boolean} - Returns true if the name is valid, otherwise false.
 */
function validateNameInput() {
  const fullName = document.getElementById("fullName");
  if (!fullName.value.trim()) {
    showError(fullName, "Name is required.");
    return false;
  } else {
    clearError(fullName);
    return true;
  }
}

/**
 * Validates the email input field.
 * Checks if the email is in a valid format and displays an error if invalid.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
function validateEmailInput() {
  const email = document.getElementById("new-email");
  if (!validateEmail(email.value.trim())) {
    showError(email, "Please enter a valid email address.");
    return false;
  } else {
    clearError(email);
    return true;
  }
}

/**
 * Validates the phone input field.
 * Checks if the phone number is in a valid format and displays an error if invalid.
 * @returns {boolean} - Returns true if the phone number is valid, otherwise false.
 */
function validatePhoneInput() {
  const phone = document.getElementById("new-phone");
  if (phone.value.trim() && !validatePhone(phone.value.trim())) {
    showError(phone, "Please enter a valid phone number.");
    return false;
  } else {
    clearError(phone);
    return true;
  }
}

/**
 * Handles the form submission based on the form ID.
 * Calls the appropriate function to add or edit a contact.
 * @param {string} formId - The ID of the form being submitted.
 * @param {string} key - The unique key of the contact (for editing).
 * @param {Event} event - The submit event from the form.
 */
function handleFormSubmission(formId, key, event) {
  if (formId === "addContactForm") {
    addContactToDatabase(event);
  } else if (formId === "editContactForm") {
    saveEditedContact(key);
  }
}

/**
 * Displays an error message and highlights the input field with a red border.
 * @param {HTMLElement} input - The input element to highlight.
 * @param {string} message - The error message to display.
 */
function showError(input, message) {
  const inputGroup = input.parentElement;
  const errorMessage = inputGroup.querySelector(".error-message");
  errorMessage.textContent = message;
  errorMessage.classList.add("visible");
  input.style.border = "2px solid red";
  input.addEventListener("input", () => {
    clearError(input);
  });
}

/**
 * Clears the error message and removes the red border from the input field.
 * @param {HTMLElement} input - The input element to clear.
 */
function clearError(input) {
  const inputGroup = input.parentElement;
  const errorMessage = inputGroup.querySelector(".error-message");
  errorMessage.textContent = "";
  errorMessage.classList.remove("visible");
  input.style.border = "2px solid #ccc";
}

/**
 * Validates an email address using a regular expression.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number using a regular expression.
 * Allows numbers with an optional '+' at the beginning and spaces.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - Returns true if the phone number is valid, otherwise false.
 */
function validatePhone(phone) {
  const phoneRegex = /^\+?[0-9\s]{10,15}$/;
  return phoneRegex.test(phone);
}
