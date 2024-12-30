// delete_workspace.js
document.addEventListener('DOMContentLoaded', () => {
    // Select the button with class 'delete-workspace-button'
    const button = document.querySelector('.delete-workspace-button'); 

    if (button) {
        button.addEventListener('click', function () {
            // Show loading overlay
            showLoadingOverlay();

            if (!firstWebhookData) {
                const errorMessage = 'First webhook data not available.';
                showFailureModal(errorMessage);
                hideLoadingOverlay();
                return;
            }

            const matchingItemIndex = firstWebhookData.items.findIndex(item => item.fieldData.name === buttonName);

            if (matchingItemIndex === -1) {
                const errorMessage = `No matching item found for button name: ${buttonName}`;
                showFailureModal(errorMessage);
                hideLoadingOverlay();
                return;
            }

            const itemId = firstWebhookData.items[matchingItemIndex].id;

            const payload = {
                id: itemId,
                WorkspaceId: wsCmsId
            };

            fetch('https://hook.eu2.make.com/y60y6hrofoh6yg3uyagl2banxem72b99', {
                method: 'DELETE',
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
        const errorMessage = 'Button with class "delete-workspace-button" not found.';
        showFailureModal(errorMessage);
        hideLoadingOverlay();
    }
});