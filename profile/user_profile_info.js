async function getProfilePhoto() {
  const currentAccounts = myMSALObj.getAllAccounts();

  if (currentAccounts.length === 0) {
    console.error("Geen accounts gevonden");
    return;
  }

  const account = currentAccounts[0];
  myMSALObj.setActiveAccount(account);

  const cachedImage = localStorage.getItem("profilePhoto");

  const setImageIfExists = (id, src) => {
    const element = document.getElementById(id);
    if (element) {
      element.src = src;
    }
  };

  if (cachedImage) {
    setImageIfExists("user-profile-image", cachedImage);
    setImageIfExists("profile-image", cachedImage);
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
    
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result;

      localStorage.setItem("profilePhoto", base64data);
      setImageIfExists("user-profile-image", base64data);
      setImageIfExists("profile-image", base64data);
    };

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
    
    localStorage.setItem("profileData", JSON.stringify(userData));

    updateProfileUI(userData, account.username);

  } catch (error) {
    console.error("Fout bij ophalen gebruikersgegevens:", error);
  }
}

function updateProfileUI(userData, email) {
  const setTextIfExists = (id, text) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  };

  setTextIfExists("profile-first-name", userData.givenName || "Geen voornaam beschikbaar");
  setTextIfExists("profile-last-name", userData.surname || "Geen achternaam beschikbaar");
  setTextIfExists("profile-mail", email || "Geen mail beschikbaar");
  setTextIfExists("user-profile-mail", email || "Geen mail beschikbaar");
  setTextIfExists("user-first-name", userData.givenName || "Geen voornaam beschikbaar");
  setTextIfExists("user-last-name", userData.surname || "Geen achternaam beschikbaar");
  setTextIfExists("user-job-title", userData.jobTitle || "Geen functie beschikbaar");
  setTextIfExists("user-phone-number", (userData.businessPhones.length > 0 ? userData.businessPhones[0] : "Geen telefoonnummer beschikbaar"));
}

getProfileData();