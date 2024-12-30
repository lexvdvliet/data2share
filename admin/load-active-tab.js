// load-active-tab.js
// Global function to activate the tab based on the stored value
function activateTab() {
    const activeTabValue = sessionStorage.getItem('activeTab');
    if (activeTabValue) {
        const allTabLinks = document.querySelectorAll('.dash_profile-nav-link');
        
        // Remove the active class from all tabs
        allTabLinks.forEach(tabLink => {
            tabLink.classList.remove('w--tab-active');
            tabLink.setAttribute('aria-selected', 'false'); // Update aria-selected
        });
        
        // Find and activate the stored tab
        const activeTabLink = Array.from(allTabLinks).find(tabLink => 
            tabLink.getAttribute('data-w-tab') === activeTabValue
        );
        
        if (activeTabLink) {
            activeTabLink.classList.add('w--tab-active');
            activeTabLink.setAttribute('aria-selected', 'true'); // Update aria-selected
            // Optionally, you can trigger a click to show the corresponding tab content
            activeTabLink.click();
        }
    }
}

// Call activateTab on page load
window.addEventListener('load', activateTab);
