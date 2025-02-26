const msalConfig = {
  auth: {
    clientId: "your_client_id",
    authority: "https://login.microsoftonline.com/your_tenant_id",
    redirectUri: window.location.origin + "/datatoshare-home"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  }
};