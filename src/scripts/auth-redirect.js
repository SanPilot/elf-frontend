/*
Redirect user based on authentication
*/

var authRedirect = function(signoutmessage) {

  if(signoutmessage && signoutmessage.constructor !== String) signoutmessage = "You have been successfully signed out.";

  // Location to send user one login is complete
  var destiny = localStorage.getItem("destiny") || "dashboard/";
  localStorage.removeItem("destiny");

  // Is the user logged in?
  var authToken = localStorage.getItem("authToken") && JSON.parse(localStorage.getItem("authToken"));
  var authStatus = authToken && authToken.expires > Math.floor(Date.now() / 1000);

  // Check if the user is already logged in
  if(authStatus && window.location.pathname === "/") {

    // Redirect the user
    window.location = destiny;

  } else if(window.location.pathname !== "/" && !authStatus) {

    // Set the destiny
    localStorage.setItem("destiny", window.location.pathname);

    // Set the signoutmessage
    if(signoutmessage) localStorage.setItem("signoutmessage", signoutmessage);

    // Redirect to the login page
    window.location = "/";

  } else if(authStatus) {

    // When the token expires, navigate to the login page
    setTimeout(function() {

      // Delete the expired token
      localStorage.removeItem("authToken");

      // Redirect to the login
      authRedirect("You have been signed out. Please sign in again.");

    }, ((authToken.expires - Math.floor(Date.now() / 1000)) * 1000) - 10000);

  }
}

// Create the signoutmessage
var displaySOM = localStorage.getItem("signoutmessage");
if(displaySOM) {
  createToast(displaySOM);
  localStorage.removeItem("signoutmessage");
}

// Make the redirect
authRedirect();
