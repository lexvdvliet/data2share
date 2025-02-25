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
document.documentElement.style.visibility = "hidden"; 

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
      document.getElementById("logout-btn")?.remove();
      console.log("Memberstack roles:", userRoles);
    }

    if (userRoles.length > 0) {
      const accessGranted = await checkUserAccess(userRoles);
      showContent(userRoles, "Microsoft or Memberstack");
        if (accessGranted) {
          document.documentElement.style.visibility = "visible";
        }

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

async function checkUserAccess(userRoles) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseUrl = window.location.origin;
      const adminUrl = `${baseUrl}/admin`;

      // Check if the user is on the admin page
      if (window.location.href === adminUrl) {
        if (!userRoles.includes("admin")) {
          window.location.href = "https://www.data2share.nl/access-denied";
          resolve(false);
          return;
        }
      }

      const workspaceRoleElement = document.getElementById("assigned-workspace-role");

      if (workspaceRoleElement) {
        const workspaceRole = workspaceRoleElement.textContent.trim();
        const hasAccess = userRoles.some(role => role.trim() === workspaceRole);

        if (hasAccess) {
          resolve(true);
        } else {
          window.location.href = "https://www.data2share.nl/access-denied";
          resolve(false);
        }
        return;
      }

      const dashboardRoleList = document.getElementById("assigned-dashboard-role-list");

      if (!dashboardRoleList) {
        console.log("Geen workspaceRoleElement en geen dashboardRoleList. Geen actie ondernomen.");
        resolve(null);
        return;
      }

      const dashboardRoles = Array.from(
        document.querySelectorAll("#dashboard-role-list p#dashboard-roles:not(.w-condition-invisible)")
      ).map(el => el.textContent.trim());

      console.log("dashboardRoles:", dashboardRoles);

      const hasMatchingRole = userRoles.some(role => dashboardRoles.includes(role));

      if (hasMatchingRole) {
        resolve(true);
      } else {
        window.location.href = "https://www.data2share.nl/access-denied";
        resolve(false);
      }
    }, 200);
  });
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

    document.documentElement.style.visibility = "visible"; 
  }, 200); 
}

checkAuthentication();

const currentAccounts = myMSALObj.getAllAccounts();
const currentAccount = currentAccounts[0]