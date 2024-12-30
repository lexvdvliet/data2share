// delete_dashboards.js
document.addEventListener('DOMContentLoaded', () => {
    // Select the button with class 'delete-dash-button'
    const button = document.querySelector('.delete-dash-button'); 

    if (button) {
        button.addEventListener('click', function () {

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

            const payload = {
                id: itemId,
                DashboardId: dashCmsId
            };

            fetch('https://hook.eu2.make.com/fwajh95bt36d6ic5wesmyoowka4mw3ex', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
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
        const errorMessage = 'Button with class "delete-workspace-button" not found.';
        showFailureModal(errorMessage);
        hideLoadingOverlay();
    }
});