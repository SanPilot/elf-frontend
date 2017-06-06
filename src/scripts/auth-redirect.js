/*
Redirect authenticated user.
*/

// Location to send user one login is complete
var destiny = localStorage.getItem("destiny") || "dashboard/";
localStorage.removeItem("destiny");

// Check if the user is already logged in
var authToken = localStorage.getItem("authToken") && JSON.parse(localStorage.getItem("authToken"));
if(authToken && authToken.expires > utility.specTime()) window.location = destiny;
