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
document.documentElement.style.visibility = "hidden"; // Keep page hidden until access check

async function checkAuthentication() {
  let userRoles = [];

  try {
    const response = await myMSALObj.handleRedirectPromise();
    if (response) {
      console.log("Microsoft login successful:", response);
    }

    const currentAccounts = myMSALObj.getAllAccounts();
    if (currentAccounts.length > 0) {
      console.log("Using Microsoft account:", currentAccounts[0]);
      userRoles = currentAccounts[0].idTokenClaims.roles || [];
      console.log("Microsoft roles:", userRoles);
    } else {
      console.log("No Microsoft account found. Checking Memberstack...");
      userRoles = await getUserRolesMs();
      console.log("Memberstack roles:", userRoles);
    }

    if (userRoles.length > 0) {
      document.addEventListener("DOMContentLoaded", async () => {
        const accessGranted = await checkUserAccess(userRoles);
        if (accessGranted) {
          showContent(userRoles, "Microsoft or Memberstack");
          document.documentElement.style.visibility = "visible"; // Show page only after access check
        }
      });

      document.getElementById("logout-btn")?.remove();
    } else {
      console.log("No valid roles found.");
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

function showContent(userRoles, source) {
  setTimeout(() => {
    const elements = document.querySelectorAll("[data-msal-content]");
    elements.forEach(element => {
      const requiredRoles = element.getAttribute("data-msal-content").split(",");
      const hasRole = requiredRoles.some(role => userRoles.includes(role.trim()));
      if (!hasRole) {
        element.remove();
      }
    });
  }, 200);
}

async function checkUserAccess(userRoles) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const workspaceRoleElement = document.getElementById("workspace-role");
      if (!workspaceRoleElement) {
        window.location.href = "https://www.data2share.nl/access-denied";
        resolve(false);
        return;
      }

      const workspaceRole = workspaceRoleElement.textContent.trim();
      const hasAccess = userRoles.some(role => role.trim() === workspaceRole);

      if (hasAccess) {
        resolve(true);
      } else {
        window.location.href = "https://www.data2share.nl/access-denied";
        resolve(false);
      }
    }, 200);
  });
}

checkAuthentication();

const currentAccounts = myMSALObj.getAllAccounts();
const currentAccount = currentAccounts[0]