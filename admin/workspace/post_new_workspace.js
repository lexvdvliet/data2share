// post_new_workspace.js
document.addEventListener('DOMContentLoaded', () => {
    // Part 1: Update Dashboard Table
    const updateButton = document.querySelector('.new-dashboards-button');

    if (updateButton) {
        updateButton.addEventListener('click', function () {
            const selectedDashboard = checkElementValue('.all-new-dashboards', 'No dashboard selected.');
            if (selectedDashboard && selectedDashboard !== "Selecteer een dashboard") {
                updateDashboardTable(selectedDashboard);
            } else {
                console.log('No dashboard selected.');
            }
        });
    } else {
        const errorMessage = 'Button with class "new-dashboards-button" not found.';
        showFailureModal(errorMessage);
    }

    function updateDashboardTable(selectedDashboard) {
        const workspaceDashboardsElement = document.querySelector('.new-workspace-dashboards');

        if (!workspaceDashboardsElement) {
            console.error('Element with class "new-workspace-dashboards" not found.');
            return;
        }

        if (typeof secondWebhookData === 'undefined' || secondWebhookData.length === 0) {
            console.error('secondWebhookData is not defined or is empty.');
            return;
        }

        console.log('Updating dashboard table with:', selectedDashboard);
        const dashboardData = secondWebhookData.find(item => item.fieldData.name === selectedDashboard);

        if (!dashboardData) {
            console.error('No matching dashboard found in secondWebhookData.');
            return;
        }

        let table = workspaceDashboardsElement.querySelector('table.admin-table');

        if (!table) {
            table = document.createElement('table');
            table.classList.add('admin-table');

            const headerRow = document.createElement('tr');
            ['ID', 'Dashboard Name', 'Delete'].forEach(text => {
                const th = document.createElement('th');
                th.innerText = text;
                headerRow.appendChild(th);
            });

            table.appendChild(headerRow);
            workspaceDashboardsElement.appendChild(table);
        }

        const existingRows = Array.from(table.querySelectorAll('tr'));
        const exists = existingRows.some(row => row.cells[1] && row.cells[1].innerText === dashboardData.fieldData.name);

        if (exists) {
            alert('This dashboard already exists.');
            return;
        }

        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.innerText = dashboardData.id;
        row.appendChild(idCell);

        const nameCell = document.createElement('td');
        nameCell.innerText = dashboardData.fieldData.name;
        row.appendChild(nameCell);

        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'x';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => row.remove());
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        table.appendChild(row);
        console.log('New row added to the table.');
    }

    // Part 2: Create Workspace Button
    const createWorkspaceButton = document.querySelector('.create-workspace-button');

    if (createWorkspaceButton) {
        createWorkspaceButton.addEventListener('click', function () {
            showLoadingOverlay();

            if (!firstWebhookData) {
                const errorMessage = 'First webhook data not available.';
                showFailureModal(errorMessage);
                hideLoadingOverlay();
                return;
            }

            const workspaceName = checkElementValue('.new-workspace-name', 'Error: Workspace name cannot be empty.');
            if (workspaceName === null) return;

            const workspaceImage = document.getElementById('Workspace toevoegenimageUrl').textContent;

            const workspaceSlug = checkElementValue('.new-workspace-slug', 'Error: Workspace slug cannot be empty.');
            if (workspaceSlug === null) return;

            const workspaceDescription = checkElementValue('.new-workspace-description', 'Error: Workspace description cannot be empty.');
            if (workspaceDescription === null) return;

            const workspaceRole = checkElementValue('.new-workspace-role', 'Error: Workspace role cannot be empty.');
            if (workspaceRole === null) return;

            const activeTab = document.querySelector('.w-tab-pane.w--tab-active');
            const dashboardTableRows = activeTab.querySelectorAll('.admin-table tr');
            const dashboards = Array.from(dashboardTableRows).slice(1).map(row => row.querySelector('td:first-child').textContent.trim());

            const payload = {
                isArchived: false,
                isDraft: false,
                fieldData: {
                    WorkspaceId: wsCmsId,
                    name: workspaceName,
                    image: workspaceImage,
                    slug: workspaceSlug,
                    "workspace-omschrijving": workspaceDescription,
                    rol: workspaceRole,
                    dashboards: dashboards
                }
            };

            fetch('https://hook.eu2.make.com/of2ey622p259nvhlrp1x8kjfz8376y4i', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) {
                    const errorMessage = `HTTP error! Status: ${response.status}`;
                    showFailureModal(errorMessage);
                    hideLoadingOverlay(); 
                    throw new Error(errorMessage);
                }
                return response.json();
            })
            .then(data => {
                console.log('Response from webhook:', data);
                showSuccessModal();
                hideLoadingOverlay();
            })
            .catch(error => {
                const errorMessage = `Error sending data to the webhook: ${error}`;
                showFailureModal(errorMessage);
                hideLoadingOverlay();
            });
        });
    } else {
        const errorMessage = 'Button with class "create-workspace-button" not found.';
        showFailureModal(errorMessage);
        hideLoadingOverlay();
    }
});