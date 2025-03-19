async function getAccessToken() {
    const currentAccounts = myMSALObj.getAllAccounts();
    if (currentAccounts.length === 0) {
      console.log("Geen ingelogde gebruiker gevonden.");
      return;
    }
  
    const account = currentAccounts[0];  // De ingelogde account
    try {
      const tokenResponse = await myMSALObj.acquireTokenSilent({
        scopes: ["Application.Read.All"],  // Scope voor de benodigde API
        account: account
      });
  
      console.log("Access token opgehaald:", tokenResponse.accessToken);
      return tokenResponse.accessToken;
    } catch (error) {
      console.error("Fout bij het ophalen van het access token:", error);
    }
  }
  
  async function callApi() {
    const token = await getAccessToken();
    if (!token) {
      console.log("Geen toegangstoken beschikbaar.");
      return;
    }
  
    const apiUrl = "https://graph.microsoft.com/v1.0/me/appRoleAssignments";
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  
    const data = await response.json();
    let allAppRoles = data.value.filter(role => role.resourceDisplayName === displayName);
    console.log(allAppRoles);
  }
  
  callApi();