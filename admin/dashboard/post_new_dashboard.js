// post_new_dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    // Create Dashboard Button
    const createDashboardButton = document.querySelector('.create-dashboard-button');

    if (createDashboardButton) {
        createDashboardButton.addEventListener('click', function () {
            // Show loading overlay
            showLoadingOverlay();

            if (!firstWebhookData) {
                const errorMessage = 'First webhook data not available.';
                showFailureModal(errorMessage);
                hideLoadingOverlay();
                return;
            }

            // Use checkElementValue utility function from utility.js
            const dashboardName = checkElementValue('.new-dashboard-name', 'Error: Dashboard name cannot be empty.');
            if (dashboardName === null) return;

            const dashboardImage = document.getElementById('Dashboard toevoegenimageUrl').textContent;

            const dashboardSlug = checkElementValue('.new-dashboard-slug', 'Error: Dashboard slug cannot be empty.');
            if (dashboardSlug === null) return;

            const dashboardDescription = checkElementValue('.new-dashboard-description', 'Error: Dashboard description cannot be empty.');
            if (dashboardDescription === null) return;

            const dashboardTool = checkElementValue('.new-dashboard-tool', 'Error: Dashboard tool cannot be empty.');
            if (dashboardTool === null) return;
            
            const dashboardLink = checkElementValue('.new-dashboard-link', 'Error: Dashboard link cannot be empty.');
            if (dashboardLink === null) return;

            const activeTab = document.querySelector('.w-tab-pane.w--tab-active');
            const dashboardTableRows = activeTab.querySelectorAll('.admin-table tr');
            const dashboards = Array.from(dashboardTableRows).slice(1).map(row => row.querySelector('td:first-child').textContent.trim());

            const payload = {
                DashboardId: dashCmsId,
                isArchived: false,
                isDraft: false,
                fieldData: {
                    name: dashboardName,
                    slug: dashboardSlug,
                    image: dashboardImage,
                    "dashboard-omschrijving": dashboardDescription,
                    "dashboard-tool": dashboardTool,
                    "public-link": dashboardLink
                }
            };

            fetch('https://hook.eu2.make.com/cl12dsm41btujsfpnoyej3p1cmdt868x', {
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
                showSuccessModal(); // Show global success modal
                hideLoadingOverlay();
            })
            .catch(error => {
                const errorMessage = `Error sending data to the webhook: ${error}`;
                showFailureModal(errorMessage);
                hideLoadingOverlay();
            });
        });
    } else {
        const errorMessage = 'Button with class "create-dashboard-button" not found.';
        showFailureModal(errorMessage);
        hideLoadingOverlay();
    }
});