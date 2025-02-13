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

async function checkAuthentication() {
  try {
    const response = await myMSALObj.handleRedirectPromise();
    if (response) {
      console.log("Microsoft login successful:", response);
    }

    const currentAccounts = myMSALObj.getAllAccounts();
    if (currentAccounts.length > 0) {
      console.log("Using Microsoft account:", currentAccounts[0]);
      const microsoftRoles = currentAccounts[0].idTokenClaims.roles || [];
      handleRoleBasedContent(microsoftRoles, "Microsoft");
      return;
    }

    console.log("No Microsoft account found. Checking Memberstack...");
    const memberstackRoles = await getUserRolesMs();
    if (memberstackRoles.length > 0) {
      console.log("Using Memberstack roles:", memberstackRoles);
      handleRoleBasedContent(memberstackRoles, "Memberstack");
    } else {
      console.log("No valid Memberstack or Microsoft account found.");
      window.location.href = "https://www.data2share.nl/access-denied";
    }
  } catch (error) {
    console.error("Error in checkAuthentication:", error);
    window.location.href = "https://www.data2share.nl/access-denied";
  }
}

async function getUserRolesMs() {
  let userRolesMs = [];
  try {
    const member = await window.$memberstackDom.getCurrentMember();
    if (member && member.data && member.data.planConnections) {
      userRolesMs = member.data.planConnections
        .map(connection => {
          const match = connection.planId.match(/pln_(.+)-[^-]+$/);
          return match ? match[1] : null;
        })
        .filter(Boolean);
    } else {
      console.log("No plan connections found for this member.");
    }
  } catch (error) {
    console.error("Error fetching user roles:", error);
  }
  return userRolesMs;
}

function handleRoleBasedContent(userRoles, source) {
  console.log(`Handling content for ${source} roles:`, userRoles);
  document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll("[data-msal-content]");

    elements.forEach(element => {
      const requiredRoles = element.getAttribute("data-msal-content").split(",");
      const hasRole = requiredRoles.some(role => userRoles.includes(role.trim()));

      if (!hasRole) {
        element.remove(); // Remove elements if roles don't match
      }
    });

    // Show content after role check
    document.documentElement.style.display = "initial";
  });
}

// Hide content until roles are checked
document.documentElement.style.display = "none";

// Start the authentication check
checkAuthentication();