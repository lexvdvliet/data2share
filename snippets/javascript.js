<script>
let firstWebhookData = null; // Declare a global variable to store first webhook data
let secondWebhookData = null; // Declare a global variable to store second webhook data

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the first Make webhook
    fetch('https://hook.eu2.make.com/5hbungik9p14284ilulge2ahahggor7f', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // Empty body since itemId is removed
    })
    .then(response => {
        console.log('Full response (first webhook):', response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the response into JSON
    })
    .then(data => {
        console.log('Received data (first webhook):', data);
        firstWebhookData = data; // Store the first webhook data globally

        // Fetch data from the second Make webhook
        return fetch('https://hook.eu2.make.com/ok0bwbmkw85xgrbkhydraikw4pq5v4ut', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // Empty body since itemId is removed
        });
    })
    .then(secondResponse => {
        console.log('Full response (second webhook):', secondResponse);
        if (!secondResponse.ok) {
            throw new Error(`HTTP error! Status: ${secondResponse.status}`);
        }
        return secondResponse.json(); // Parse the second response into JSON
    })
    .then(secondData => {
        console.log('Received data (second webhook):', secondData); // Log the second webhook data to the console
        secondWebhookData = secondData; // Store the second webhook data globally
    })
    .catch(error => console.error('Error fetching data:', error));
});
</script>

<script>
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

            // Get the button name from the <div>
            const buttonName = this.querySelector('div').innerText.trim();

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
</script>

<script>
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
</script>