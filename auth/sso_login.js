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
      window.location.href = window.location.origin + "/datatoshare-home";
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
    window.location.href = window.location.origin + "/datatoshare-home";
  }
});