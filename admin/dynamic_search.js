document.addEventListener("DOMContentLoaded", () => {
    const setupSearch = (inputId, textClass) => {
        const searchInput = document.getElementById(inputId);
        if (!searchInput) return; // Voorkomt fouten als het element niet bestaat

        searchInput.addEventListener("input", () => {
            const filter = searchInput.value.toLowerCase();
            document.querySelectorAll(".w-dyn-item").forEach(item => {
                const textElement = item.querySelector(`.${textClass}`);
                item.style.display = textElement && textElement.textContent.trim().toLowerCase().includes(filter) ? "" : "none";
            });
        });
    };

    setupSearch("dashboardSearchInput", "dash_nav_link-text");
    setupSearch("workspaceSearchInput", "work_nav_link-text");
});