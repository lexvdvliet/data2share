const currentAccounts = myMSALObj.getAllAccounts();
const currentAccount = currentAccounts[0]

function signOut() {
    const username = currentAccounts[0].username
    const logoutRequest = {
      account: myMSALObj.getAccountByUsername(username),
      postLogoutRedirectUri: "https://www.data2share.nl/log-out"
    };
    myMSALObj.logoutRedirect(logoutRequest);
  } 
  
  document.getElementById("logout-btn").addEventListener("click", () => {
    signOut();
  });