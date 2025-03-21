const myMSALObj = new msal.PublicClientApplication(msalConfig);
document.documentElement.style.visibility = "hidden"; 

async function checkAuthentication() {
  window.userRoles = [];

  try {
    const response = await myMSALObj.handleRedirectPromise();
    if (response) {
      console.log("Microsoft login successful:", response);
    }

    const currentAccounts = myMSALObj.getAllAccounts();
    if (currentAccounts.length > 0) {
      console.log("Using Microsoft account:", currentAccounts[0]);
      window.userRoles = currentAccounts[0].idTokenClaims.roles || [];
      console.log("Microsoft roles:", window.userRoles);
    } else {
      console.log("No Microsoft account found. Checking Memberstack...");
      window.userRoles = await getUserRolesMs();
      document.getElementById("logout-btn")?.remove();
      console.log("Memberstack roles:", window.userRoles);
    }

    if (window.userRoles.length > 0) {
      const accessGranted = await checkUserAccess(window.userRoles);
      showContent(window.userRoles, "Microsoft or Memberstack");
      if (accessGranted) {
        document.documentElement.style.visibility = "visible";
      }
    } else {
      console.log("No valid roles found.");
      window.location.href = window.location.origin + "/access-denied";
    }
  } catch (error) {
    console.error("Error in checkAuthentication:", error);
    window.location.href = window.location.origin + "/access-denied";
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

      if (window.location.href === adminUrl) {
        if (!userRoles.includes("admin")) {
          window.location.href = baseUrl + "/access-denied";
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
          window.location.href = window.location.origin + "/access-denied";
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
        document.querySelectorAll("#assigned-dashboard-role-list p:not(.w-condition-invisible)")
      ).map(el => el.textContent.trim());      

      console.log("dashboardRoles:", dashboardRoles);

      const hasMatchingRole = userRoles.some(role => dashboardRoles.includes(role));

      if (hasMatchingRole) {
        resolve(true);
      } else {
        window.location.href = window.location.origin + "/access-denied";
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