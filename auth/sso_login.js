const msalConfig = {
    auth: {
      clientId: "46b86472-683d-4a28-a6d0-2c69d3e1ce41",
      authority: "https://login.microsoftonline.com/3790009a-a120-44ed-a6ba-1fdf516e3e43",
      redirectUri: "https://www.data2share.nl/datatoshare-home"
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
  
function selectAccount() {
  const currentAccounts = myMSALObj.getAllAccounts();  
    if (!currentAccounts || currentAccounts.length === 0) {
      console.log("No accounts found.");
      return;
    } else if (currentAccounts.length > 1) {
      console.warn("Multiple accounts detected.");
    } else {
      username = currentAccounts[0].username;
      console.log("Welcome", username);
      console.log("Login details:", currentAccounts[0]);
    }
  }  

myMSALObj.handleRedirectPromise()
  .then((response) => {
    if (response) {
      window.location.href = "https://www.data2share.nl/datatoshare-home";
    }
    selectAccount();
  })
  .catch((error) => {
    console.error("Error during handleRedirectPromise:", error);
});

document.getElementById("login-btn").addEventListener("click", () => {
  if (!myMSALObj.getAllAccounts().length) {
    myMSALObj.loginRedirect(loginRequest).catch((error) => {
      console.error("Error during loginRedirect:", error);
    });
  } else {
    console.log("User is already logged in.");
    window.location.href = "https://www.data2share.nl/datatoshare-home";
  }
});