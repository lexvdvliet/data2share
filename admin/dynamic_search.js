document.addEventListener("DOMContentLoaded", function () { 
    document.getElementById("dashboardSearchInput").addEventListener("input", function () {
      let filter = this.value.toLowerCase();
      let items = document.querySelectorAll(".w-dyn-item");

      items.forEach(item => {
        let textElement = item.querySelector(".dash_nav_link-text");
        
        if (textElement) { // Zorg ervoor dat het element bestaat voordat je het leest
          let text = textElement.textContent.trim().toLowerCase();
          item.style.display = text.includes(filter) ? "" : "none";
        }
      });
    });
});
  
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("workspaceSearchInput").addEventListener("input", function () {
        let filter = this.value.toLowerCase();
        let items = document.querySelectorAll(".w-dyn-item");

        items.forEach(item => {
        let textElement = item.querySelector(".work_nav_link-text");
        
        if (textElement) { // Zorg ervoor dat het element bestaat voordat je het leest
            let text = textElement.textContent.trim().toLowerCase();
            item.style.display = text.includes(filter) ? "" : "none";
        }
        });
    });
});