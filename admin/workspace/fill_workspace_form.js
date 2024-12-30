// fill_workspace_form.js
let buttonName = ''; // Declare the variable globally

document.addEventListener('DOMContentLoaded', () => {
    // Event listener for Collection List buttons
    document.querySelectorAll('.work_nav_link').forEach(button => {
        button.addEventListener('click', function () {
            // Remove 'active-button' class from all buttons
            document.querySelectorAll('.work_nav_link').forEach(btn => {
                btn.classList.remove('active-button');
            });

            // Add 'active-button' class to the clicked button
            this.classList.add('active-button');

            // Get the button name from the <div> and store it in the global variable
            buttonName = this.querySelector('div').innerText.trim();

            // Use the stored first webhook data
            if (!firstWebhookData || !secondWebhookData) {
                console.error('First or second webhook data not available.');
                return; // Exit if data is not available
            }

            // Find the matching item index based on the name in the button
            const matchingItemIndex = firstWebhookData.items.findIndex(item => item.fieldData.name === buttonName);

            if (matchingItemIndex === -1) {
                console.error(`No matching item found for button name: ${buttonName}`);
                return; // Exit if no matching item is found
            }

            // Populate the form fields using the matched item from the first webhook data
            populateFormFields(firstWebhookData.items[matchingItemIndex]);

            // Extract dashboards from the matched item
            const dashboards = firstWebhookData.items[matchingItemIndex].fieldData.dashboards || [];

            // Use the stored second webhook data
            displayDashboards(secondWebhookData, dashboards); // Call the function to display dashboard names
        });
    });

    // Function to populate the form fields from the first webhook data
    function populateFormFields(item) {
        const workspaceNameInput = document.querySelector('.workspace-name'); // Select the name input field
        const workspaceDescriptionInput = document.querySelector('.workspace-description'); // Select the description input field
        const workspaceRoleInput = document.querySelector('.workspace-role'); // Select the role input field
        const workspaceSlugInput = document.querySelector('.workspace-slug'); // Select the slug input field
        const workspaceDashboardsText = document.querySelector('.workspace-dashboards'); // Select the dashboards text block

        // Extract fieldData from the matched item
        const name = item.fieldData.name || 'No name available';
        const description = item.fieldData["workspace-omschrijving"] || 'No description available';
        const role = item.fieldData.rol || 'No role available';
        const slug = item.fieldData.slug || 'No slug available';
        const dashboards = item.fieldData.dashboards || []; // Extract dashboards array

        // Set the value of the input fields
        if (workspaceNameInput) {
            workspaceNameInput.value = name; // Set the name input field's value
        }
        if (workspaceDescriptionInput) {
            workspaceDescriptionInput.value = description; // Set the description input field's value
        }
        if (workspaceRoleInput) {
            workspaceRoleInput.value = role; // Set the role input field's value
        }
        if (workspaceSlugInput) {
            workspaceSlugInput.value = slug; // Set the slug input field's value
        } else {
                workspaceDashboardsText.textContent = 'No dashboards available'; // If no dashboards, show this message
            }
    }

    // Function to display dashboard IDs and names
    function displayDashboards(secondData, firstWebhookDashboards) {
        const workspaceDashboardsElement = document.querySelector('.workspace-dashboards');

        if (!workspaceDashboardsElement) {
            console.error('Element with class "workspace-dashboards" not found.');
            return; // Exit the function early if element is missing
        }

        workspaceDashboardsElement.innerHTML = ''; // Clear any existing content

        // Create a new table element with the 'admin-table' class
        const table = document.createElement('table');
        table.classList.add('admin-table'); // Add the admin-table class for styling

        // Create the table header row
        const headerRow = document.createElement('tr');

        // Create and append the "ID" header
        const idHeader = document.createElement('th');
        idHeader.innerText = 'ID';
        headerRow.appendChild(idHeader);

        // Create and append the "Dashboard Name" header
        const nameHeader = document.createElement('th');
        nameHeader.innerText = 'Dashboard Name';
        headerRow.appendChild(nameHeader);

        // Create and append the "Delete" header for the delete button
        const deleteHeader = document.createElement('th');
        deleteHeader.innerText = 'Delete';
        headerRow.appendChild(deleteHeader);

        // Append the header row to the table
        table.appendChild(headerRow);

        // Loop through the dashboard IDs from the first webhook and match them with the second webhook data
        firstWebhookDashboards.forEach(dashboardID => {
            // Find the corresponding dashboard in secondData using the ID
            const matchingDashboard = secondData.find(item => item.id === dashboardID);

            // Create a new row for each dashboard
            const row = document.createElement('tr');

            // Create and append the "ID" cell
            const idCell = document.createElement('td');
            idCell.innerText = dashboardID || 'ID not found'; // Ensure dashboardID exists
            row.appendChild(idCell);

            // Create and append the "Dashboard Name" cell
            const nameCell = document.createElement('td');
            nameCell.innerText = matchingDashboard ? matchingDashboard.fieldData.name : 'Unknown';
            row.appendChild(nameCell);

            // Create and append the "Delete" cell with a delete button
            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'x'; // 'x' as the delete button
            deleteButton.classList.add('delete-button'); // Optional: Add a class for styling
            deleteButton.addEventListener('click', function() {
                // Remove the row from the table when clicked
                row.remove();
            });
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            // Append the row to the table
            table.appendChild(row);
        });

        // Append the table to the workspace dashboards element
        workspaceDashboardsElement.appendChild(table);
    }
});