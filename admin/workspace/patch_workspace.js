document.addEventListener('DOMContentLoaded', () => {
    // Ensure utility.js is loaded and accessible
    const button = document.querySelector('.workspace-save-button'); 

    if (button) {
        button.addEventListener('click', function () {
            // Show loading overlay
            showLoadingOverlay();

            if (!firstWebhookData) {
                showFailureModal('First webhook data not available.');
                hideLoadingOverlay(); 
                return;
            }

            const matchingItemIndex = firstWebhookData.items.findIndex(item => item.fieldData.name === buttonName);

            if (matchingItemIndex === -1) {
                showFailureModal(`No matching item found for button name: ${buttonName}`);
                hideLoadingOverlay();
                return;
            }

            const itemId = firstWebhookData.items[matchingItemIndex].id;

            // Use checkElementValue from utility.js
            const workspaceName = checkElementValue('.workspace-name', 'Error: Workspace name cannot be empty.');
            if (workspaceName === null) return; 

            const workspaceImage = document.getElementById('WorkspacesimageUrl').textContent;

            const workspaceSlug = checkElementValue('.workspace-slug', 'Error: Workspace slug cannot be empty.');
            if (workspaceSlug === null) return;

            const workspaceDescription = checkElementValue('.workspace-description', 'Error: Workspace description cannot be empty.');
            if (workspaceDescription === null) return;

            const workspaceRole = checkElementValue('.workspace-role', 'Error: Workspace role cannot be empty.');
            if (workspaceRole === null) return;

            const dashboardTableRows = document.querySelectorAll('.admin-table tr');
            const dashboards = [];
            dashboardTableRows.forEach((row, index) => {
                if (index === 0) return;
                const idCell = row.querySelector('td:first-child');
                if (idCell) {
                    dashboards.push(idCell.textContent.trim());
                }
            });

            const payload = {
                WorkspaceId: wsCmsId,
                id: itemId,
                isArchived: false,
                isDraft: false,
                fieldData: {
                    name: workspaceName, 
                    image: workspaceImage,
                    slug: workspaceSlug, 
                    "workspace-omschrijving": workspaceDescription, 
                    rol: workspaceRole,
                    dashboards: dashboards
                }
            };

            fetch('https://hook.eu2.make.com/e83jdmhxtvhk5hhlpw1e7vx3nogbtvw8', {
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
        const errorMessage = 'Button with class "workspace-save-button" not found.';
        showFailureModal(errorMessage);
        hideLoadingOverlay();
    }
});