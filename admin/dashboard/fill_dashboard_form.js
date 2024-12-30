// fill_dashboard_form.js
let dashButtonName = ''; // Declare the variable globally

document.addEventListener('DOMContentLoaded', () => {
    // Event listener for Collection List buttons
    document.querySelectorAll('.dash_nav_link').forEach(button => {
        button.addEventListener('click', function () {
            // Remove 'active-button' class from all buttons
            document.querySelectorAll('.dash_nav_link').forEach(btn => {
                btn.classList.remove('active-button');
            });

            // Add 'active-button' class to the clicked button
            this.classList.add('active-button');

            // Get the button name from the <div> and store it in the global variable
            dashButtonName = this.querySelector('div').innerText.trim();

            // Use the stored first webhook data
            if (!firstWebhookData || !secondWebhookData) {
                console.error('First or second webhook data not available.');
                return; // Exit if data is not available
            }

            // Find the matching item index based on the name in the button
            const matchingItemIndex = secondWebhookData.findIndex(item => item.fieldData.name === dashButtonName);

            if (matchingItemIndex === -1) {
                console.error(`No matching item found for button name: ${dashButtonName}`);
                return; // Exit if no matching item is found
            }

            // Populate the form fields using the matched item from the first webhook data
            populateFormFields(secondWebhookData[matchingItemIndex]);
        });
    });

    // Function to populate the form fields from the first webhook data
    function populateFormFields(item) {
        const dashboardNameInput = document.querySelector('.dashboard-name'); 
        const dashboardDescriptionInput = document.querySelector('.dashboard-description'); 
        const dashboardToolInput = document.querySelector('.dashboard-tool'); 
        const dashboardLinkInput = document.querySelector('.dashboard-link'); 
        const dashboardSlugInput = document.querySelector('.dashboard-slug'); 
        const dashboardWorkspacesText = document.querySelector('.dashboard-workspaces'); 

        // Extract fieldData from the matched item
        const name = item.fieldData.name || 'No name available';
        const description = item.fieldData["dashboard-omschrijving"] || 'No description available';
        const tool = item.fieldData["dashboard-tool-3"] || 'No dashboard tool available';
        const link = item.fieldData["public-link"] || 'No role available';
        const slug = item.fieldData.slug || 'No slug available';
        const dashboards = item.fieldData["workspace-4"] || []; // Extract workspaces array

        // Set the value of the input fields
        if (dashboardNameInput) {
            dashboardNameInput.value = name; // Set the name input field's value
        }
        if (dashboardDescriptionInput) {
            dashboardDescriptionInput.value = description; // Set the description input field's value
        }
        if (dashboardToolInput) {
            dashboardToolInput.value = tool; // Set the tool input field's value
        }
        if (dashboardLinkInput) {
            dashboardLinkInput.value = link; // Set the link input field's value
        }
        if (dashboardSlugInput) {
            dashboardSlugInput.value = slug; // Set the slug input field's value
        }
        if (dashboardWorkspacesText) {
            dashboardWorkspacesText.value = dashboards; // Set the dashboard input field's value
        } else {
            dashboardWorkspacesText.textContent = 'No dashboards available'; // If no dashboards, show this message
            }
    }
});