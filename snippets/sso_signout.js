function signOut() {
    const username = currentAccounts[0].username
    const logoutRequest = {
      account: myMSALObj.getAccountByUsername(username),
      postLogoutRedirectUri: "https://www.data2share.nl/test-page"
    };
    myMSALObj.logoutRedirect(logoutRequest);
  } 
  
  document.getElementById("logout-btn").addEventListener("click", () => {
    signOut();
  });