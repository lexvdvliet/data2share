// Function to log the checkboxes
function logCheckboxes() {
    const planSelection = document.getElementById('plan-selection');
    if (planSelection) {
        const checkboxes = planSelection.getElementsByTagName('input');
        Array.from(checkboxes).forEach(checkbox => {
            console.log(`Checkbox ID: ${checkbox.id}, Checked: ${checkbox.checked}`);
        });
    } else {
        console.error('Element with ID "plan-selection" not found');
    }
}

// Add event listener to the "member-save-button" to log checkboxes when clicked
const saveButton = document.getElementById('member-save-button');
if (saveButton) {
    saveButton.addEventListener('click', function() {
        logCheckboxes(); // Trigger the function when the button is clicked
    });
} else {
    console.error('Element with ID "member-save-button" not found');
}