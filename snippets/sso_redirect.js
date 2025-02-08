const msalConfig = {
  auth: {
    clientId: "46b86472-683d-4a28-a6d0-2c69d3e1ce41",
    authority: "https://login.microsoftonline.com/3790009a-a120-44ed-a6ba-1fdf516e3e43",
    redirectUri: "https://www.data2share.nl/redirect"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  }
};
  
const myMSALObj = new msal.PublicClientApplication(msalConfig);
const loginRequest = { 
  scopes: [
    "openid", 
    "profile", 
    "User.Read"
  ] 
};

myMSALObj.handleRedirectPromise()
  .then((response) => {
    if (response) {
      console.log("Redirect response:", response);
    }
    selectAccount();
  })
  .catch((error) => {
    console.error("Error in handleRedirectPromise:", error);
});

const currentAccounts = myMSALObj.getAllAccounts();
  
function selectAccount() {
  if (!currentAccounts || currentAccounts.length === 0) {
    console.log("No accounts found.");
    window.location.href = "https://www.data2share.nl/access-denied";
    return;
  } else if (currentAccounts.length > 1) {
    console.warn("Multiple accounts detected.");
  } else {
    username = currentAccounts[0].username;
    console.log("Logged in as:", username);
  }
}

function signOut() {
  const username = currentAccounts[0].username
  const logoutRequest = {
    account: myMSALObj.getAccountByUsername(username),
    postLogoutRedirectUri: "https://www.data2share.nl/test-page"
  };
  myMSALObj.logoutRedirect(logoutRequest);
} 

document.getElementById("logout-btn").addEventListener("click", () => {
  signOut();
});

document.addEventListener("DOMContentLoaded", async function () {
  async function displayUserInfo() {
    if (currentAccounts.length > 0) {
      const account = currentAccounts[0];

      // Display basic user info
      document.getElementById("user-info").style.display = "block";
      document.getElementById("user-name").textContent = `Name: ${account.name}`;
      document.getElementById("user-email").textContent = `Email: ${account.username}`;

      // Check if user has the "admin" role
      if (account.idTokenClaims && account.idTokenClaims.roles && account.idTokenClaims.roles.includes("admin")) {
        document.getElementById("admin-section").style.display = "block";
      } else {
        console.log("User does not have the admin role.");
      }

    } else {
      console.log("No accounts found.");
    }
  }

  await displayUserInfo();
});