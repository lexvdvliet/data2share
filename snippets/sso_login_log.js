For some reason this first script actually manages to log a user in. 
The second script is needed to handle the request. 
However the redirect from login to redirect page does not happen
Why?

// https://www.data2share.nl/login script
console.log("Initializing MSAL configuration...");
const msalConfig = {
  auth: {
    clientId: "46b86472-683d-4a28-a6d0-2c69d3e1ce41", // Replace with your app's client ID
    authority: "https://login.microsoftonline.com/3790009a-a120-44ed-a6ba-1fdf516e3e43", // Replace with your tenant ID
    redirectUri: "https://www.data2share.nl/redirect" // Replace with your app's redirect URI
  }
};

// Initialize MSAL instance
console.log("Creating MSAL instance...");
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Check if MSAL.js is available
if (typeof msal === "undefined") {
  console.error("MSAL.js is not loaded correctly.");
} else {
  console.log("MSAL.js is loaded correctly.");
}

// Handle the login process
document.getElementById("login-btn").addEventListener("click", () => {
  console.log("Login button clicked.");

  const loginRequest = {
    scopes: ["openid", "profile", "User.Read"]
  };

  console.log("Triggering loginRedirect...");
  msalInstance.loginRedirect(loginRequest)
    .then(() => {
      console.log("Login redirect triggered.");
    })
    .catch((error) => {
      console.error("Error during loginRedirect:", error);
    });
});

// Check if the redirect was successful after the page reload
window.addEventListener('load', () => {
  console.log("Window loaded. Checking for redirect response...");

  msalInstance.handleRedirectPromise().then((response) => {
    if (response) {
      console.log("Redirect response received:", response);
      // You can now proceed to handle the user information here.
    } else {
      console.log("No redirect response.");
    }
  }).catch((error) => {
    console.error("Error handling redirect response:", error);
  });
});



// https://www.data2share.nl/redirect script
const msalConfig = {
    auth: {
      clientId: "46b86472-683d-4a28-a6d0-2c69d3e1ce41", // Replace with your app's client ID
      authority: "https://login.microsoftonline.com/3790009a-a120-44ed-a6ba-1fdf516e3e43", // Replace with your tenant ID
      redirectUri: "https://www.data2share.nl/redirect" // Replace with your app's redirect URI
    }
  };
  
const msalInstance = new msal.PublicClientApplication(msalConfig);

msalInstance.handleRedirectPromise()
  .then((response) => {
    if (response) {
      console.log("Login successful, user details:", response.account);
      // Redirect user to the desired page after successful login
      window.location.href = 'https://www.data2share.nl/redirect'; // Redirect to final destination
    }
  })
  .catch((error) => {
    console.error("Error handling redirect response:", error);
  });

document.addEventListener("DOMContentLoaded", async function () {
  async function displayUserInfo() {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      const account = accounts[0];

      // Display basic user info
      document.getElementById("user-info").style.display = "block";
      document.getElementById("user-name").textContent = `Name: ${account.name}`;
      document.getElementById("user-email").textContent = `Email: ${account.username}`;

    } else {
      console.log("No accounts found. Redirecting to login.");
      window.location.href = "index.html";
    }
  }

  await displayUserInfo();
}); 