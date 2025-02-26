function signOut() {
    const username = currentAccounts[0].username
    const logoutRequest = {
      account: myMSALObj.getAccountByUsername(username),
      postLogoutRedirectUri: window.location.origin + "/log-out"
    };
    myMSALObj.logoutRedirect(logoutRequest);
  } 
  
  document.getElementById("logout-btn").addEventListener("click", () => {
    signOut();
  });