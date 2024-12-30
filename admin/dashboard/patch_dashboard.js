document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.dash-save-button'); 

    if (button) {
        button.addEventListener('click', function () {
            showLoadingOverlay();

            if (!secondWebhookData) {
                const errorMessage = 'Second webhook data not available.';
                showFailureModal(errorMessage);
                hideLoadingOverlay();
                return;
            }

            const matchingItemIndex = secondWebhookData.findIndex(item => item.fieldData.name === dashButtonName);

            if (matchingItemIndex === -1) {
                const errorMessage = `No matching item found for button name: ${dashButtonName}`;
                showFailureModal(errorMessage);
                hideLoadingOverlay();
                return;
            }

            const itemId = secondWebhookData[matchingItemIndex].id;

            // Use checkElementValue from utility.js
            const dashboardName = checkElementValue('.dashboard-name', 'Error: Dashboard name cannot be empty.');
            if (dashboardName === null) return;

            const dashboardImage = document.getElementById('DashboardsimageUrl').textContent;

            const dashboardSlug = checkElementValue('.dashboard-slug', 'Error: Dashboard slug cannot be empty.');
            if (dashboardSlug === null) return;

            const dashboardDescription = checkElementValue('.dashboard-description', 'Error: Dashboard description cannot be empty.');
            if (dashboardDescription === null) return;

            const dashboardTool = checkElementValue('.dashboard-tool', 'Error: Dashboard tool cannot be empty.');
            if (dashboardTool === null) return;

            const dashboardLink = checkElementValue('.dashboard-link', 'Error: Dashboard link cannot be empty.');
            if (dashboardLink === null) return;

            const payload = {
                DashboardId: dashCmsId,
                id: itemId,
                isArchived: false,
                isDraft: false,
                fieldData: {
                    name: dashboardName, 
                    image: dashboardImage,
                    slug: dashboardSlug, 
                    "dashboard-omschrijving": dashboardDescription, 
                    "dashboard-tool": dashboardTool,
                    "public-link": dashboardLink
                }
            };

            fetch('https://hook.eu2.make.com/vspuucb441pisya32cz3ij7h5fxtcwl6', {
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
    }
});