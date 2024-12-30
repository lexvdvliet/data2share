// utility.js
function checkElementValue(selector, errorMessage) {
    const element = document.querySelector(selector);
    if (!element || !element.value.trim()) {
        showFailureModal(errorMessage);
        hideLoadingOverlay(); // Hide loading overlay
        return null; // Indicate failure
    }
    return element.value.trim(); // Return trimmed value if valid
};

function checkElementValueById(id, errorMessage) {
    const element = document.getElementById(id);
    if (!element || !element.value.trim()) {
        showFailureModal(errorMessage);
        hideLoadingOverlay(); // Hide loading overlay
        return null; // Indicate failure
    }
    return element.value.trim(); // Return trimmed value if valid
};

function checkElementValueByIdNotEmpty(id, errorMessage) {
    const element = document.getElementById(id);
    if (!element) {
        showFailureModal(errorMessage);
        hideLoadingOverlay(); // Hide loading overlay
        return null; // Indicate failure
    }
    return element.value.trim(); // Return trimmed value
}