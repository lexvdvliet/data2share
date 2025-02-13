document.addEventListener("DOMContentLoaded", async function () {
    async function displayUserInfo() {
      if (currentAccounts.length > 0) {
        const account = currentAccounts[0];
  
        // Display basic user info
        //document.getElementById("welcome-header").textContent = `Welkom ${account.name}`;
        document.getElementById("profile-name").textContent = account.name;
        document.getElementById("profile-mail").textContent = account.username;
        document.getElementById("profile-lastname").textContent = null;
      }
    }
  });