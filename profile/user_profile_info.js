async function getProfilePhoto() {
  
  if (currentAccounts.length === 0) {
    console.error("Geen accounts gevonden");
    return;
  }

  const account = currentAccounts[0];
  myMSALObj.setActiveAccount(account);

  // Controleer of de afbeelding al gecached is in localStorage
  const cachedImage = localStorage.getItem("profilePhoto");

  if (cachedImage) {
    document.getElementById("user-profile-image").src = cachedImage;
    return;
  }

  const tokenRequest = {
    scopes: ["User.Read"]
  };

  try {
    const accessTokenResponse = await myMSALObj.acquireTokenSilent(tokenRequest);
    const accessToken = accessTokenResponse.accessToken;
    const graphEndpoint = "https://graph.microsoft.com/v1.0/me/photo/$value";

    const response = await fetch(graphEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) throw new Error("Fout bij ophalen profielfoto");

    const blob = await response.blob();
    const imgUrl = URL.createObjectURL(blob);

    // Cache de afbeelding in localStorage zodat deze blijft bestaan tussen sessies
    localStorage.setItem("profilePhoto", imgUrl);

    // Zet de profielfoto in de img element
    document.getElementById("user-profile-image").src = imgUrl;
    document.getElementById("profile-image").src = imgUrl;
  } catch (error) {
    console.error("Fout bij ophalen profielfoto:", error);
  }
}

getProfilePhoto();

async function getProfileData() {

  if (currentAccounts.length === 0) {
    console.error("Geen accounts gevonden");
    return;
  }

  const account = currentAccounts[0];
  myMSALObj.setActiveAccount(account);

  // Controleer of er al gecachede gegevens zijn
  const cachedProfile = localStorage.getItem("profileData");

  if (cachedProfile) {
    const userData = JSON.parse(cachedProfile);
    updateProfileUI(userData, account.username);
    return;
  }

  const tokenRequest = {
    scopes: ["User.Read"]
  };

  try {
    const accessTokenResponse = await myMSALObj.acquireTokenSilent(tokenRequest);
    const accessToken = accessTokenResponse.accessToken;
    const graphEndpoint = "https://graph.microsoft.com/v1.0/me";

    const response = await fetch(graphEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) throw new Error("Fout bij ophalen gebruikersgegevens");

    const userData = await response.json();
    
    // Sla de gegevens op in localStorage
    localStorage.setItem("profileData", JSON.stringify(userData));

    // Update de UI met de gebruikersgegevens
    updateProfileUI(userData, account.username);

  } catch (error) {
    console.error("Fout bij ophalen gebruikersgegevens:", error);
  }
}

// Hulpfunctie om de UI te updaten
function updateProfileUI(userData, email) {
  document.getElementById("user-profile-mail").textContent = email || "Geen mail beschikbaar";
  document.getElementById("user-first-name").textContent = userData.givenName || "Geen voornaam beschikbaar";
  document.getElementById("user-last-name").textContent = userData.surname || "Geen achternaam beschikbaar";
  document.getElementById("user-job-title").textContent = userData.jobTitle || "Geen functie beschikbaar";
  document.getElementById("user-phone-number").textContent = (userData.businessPhones.length > 0 ? userData.businessPhones[0] : "Geen telefoonnummer beschikbaar");
}

// Roep de functie aan
getProfileData();
