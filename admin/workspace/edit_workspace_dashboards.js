// edit_workspace_dashboards.js
document.addEventListener('DOMContentLoaded', () => {
    // Select the 'update-dashboards-button' anchor tag
    const updateButton = document.querySelector('.update-dashboards-button');

    if (updateButton) {
        updateButton.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the default anchor behavior
            console.log('Update button clicked.');

            // Get the selected dashboard from the 'all-dashboards' element
            const selectedDashboardElement = document.querySelector('.all-dashboards');
            const selectedDashboard = selectedDashboardElement ? selectedDashboardElement.value : null;

            console.log('Selected dashboard:', selectedDashboard);

            if (selectedDashboard && selectedDashboard !== "Selecteer een dashboard") {
                updateDashboardTable(selectedDashboard); // Call the function to update the table
            } else {
                console.log('No dashboard selected.');
            }
        });
    } else {
        console.error('Element with class "update-dashboards-button" not found.');
    }

    // Function to update the dashboard table based on selection
    function updateDashboardTable(selectedDashboard) {
        const workspaceDashboardsElement = document.querySelector('.workspace-dashboards');

        if (!workspaceDashboardsElement) {
            console.error('Element with class "workspace-dashboards" not found.');
            return;
        }

        // Ensure secondWebhookData is available
        if (typeof secondWebhookData === 'undefined' || secondWebhookData.length === 0) {
            console.error('secondWebhookData is not defined or is empty.');
            return;
        }

        console.log('Updating dashboard table with:', selectedDashboard);

        // Find the matching dashboard object in secondWebhookData by name
        const dashboardData = secondWebhookData.find(item => item.fieldData.name === selectedDashboard);

        if (!dashboardData) {
            console.error('No matching dashboard found in secondWebhookData.');
            return;
        }

        // Find the existing table or create one if it doesn't exist
        let table = workspaceDashboardsElement.querySelector('.admin-table');

        if (!table) {
            table = document.createElement('table');
            table.classList.add('admin-table');

            const headerRow = document.createElement('tr');
            
            const idHeader = document.createElement('th');
            idHeader.innerText = 'ID';
            headerRow.appendChild(idHeader);

            const nameHeader = document.createElement('th');
            nameHeader.innerText = 'Dashboard Name';
            headerRow.appendChild(nameHeader);

            const deleteHeader = document.createElement('th');
            deleteHeader.innerText = 'Delete';
            headerRow.appendChild(deleteHeader);

            table.appendChild(headerRow);
            workspaceDashboardsElement.appendChild(table);
        }

        // Check if the dashboard already exists in the table
        const existingRows = Array.from(table.querySelectorAll('tr'));
        const exists = existingRows.some(row => {
            const nameCell = row.cells[1]; // Assuming the name is in the second cell
            return nameCell && nameCell.innerText === dashboardData.fieldData.name;
        });

        if (exists) {
            // Show a pop-up alert if the dashboard already exists
            alert('This dashboard already exists.');
            return; // Exit the function to prevent adding a duplicate
        }

        // Create a new row with the ID and dashboard name
        const row = document.createElement('tr');
        
        const idCell = document.createElement('td');
        idCell.innerText = dashboardData.id; // Use the ID from webhook data
        row.appendChild(idCell);

        const nameCell = document.createElement('td');
        nameCell.innerText = dashboardData.fieldData.name; // Use the name from webhook data
        row.appendChild(nameCell);

        // Create the "Delete" cell with a delete button
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

        // Append the new row to the table
        table.appendChild(row);

        console.log('New row added to the table.');
    }
});