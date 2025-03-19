document.addEventListener("DOMContentLoaded", async function () {
    async function displayProfileInfo() {
      if (currentAccounts.length > 0) {
        const account = currentAccounts[0];
  
        document.getElementById("user-profile-mail").textContent = account.username;
        document.getElementById("user-profile-name").textContent = account.name;
        document.getElementById("profile-lastname").textContent = null;
      }
    }
    await displayUserInfo();
  });

async function getProfilePhoto() {
    // Verkrijg een access token voor Graph API
    const currentAccounts = myMSALObj.getAllAccounts();
    const account = currentAccounts[0];  // Gebruik de eerste account
    const tokenRequest = {
      scopes: ["User.Read"]  // Scope om de profielfoto op te halen
    };
  
    try {
      // Verkrijg het access token
      const accessTokenResponse = await myMSALObj.acquireTokenSilent(tokenRequest);
      const accessToken = accessTokenResponse.accessToken;
  
      // Maak een fetch-verzoek naar de Microsoft Graph API om de profielfoto op te halen
      const graphEndpoint = "https://graph.microsoft.com/v1.0/me/photo/$value";
  
      const response = await fetch(graphEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      if (!response.ok) throw new Error("Fout bij ophalen profielfoto");
  
      // Zet de afbeelding om in een Blob en maak een URL van de Blob
      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
  
      // Voeg de afbeelding toe aan een img element
      document.getElementById("user-profile-image").src = imgUrl;
    } catch (error) {
      console.error("Fout bij ophalen profielfoto:", error);
    }
  }  