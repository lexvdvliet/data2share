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
    "User.Read",
    "Files.Read.All", 
    "Sites.Read.All"
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
const currentAccount = currentAccounts[0]
const userRoles = currentAccount.idTokenClaims.roles
  
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
    console.log("Login details:", currentAccounts);
  }
};

// Block rendering until roles are checked
document.documentElement.style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll("[data-msal-content]");
  
  elements.forEach(element => {
  const requiredRoles = element.getAttribute("data-msal-content").split(",");
  const hasRole = requiredRoles.some(role => userRoles.includes(role.trim()));
  
  if (!hasRole) {
      element.remove(); // Remove elements if roles don't match
  }
  });

  // Now that role check is done, show the content
  document.documentElement.style.display = "initial"; // Allow content to be shown
});