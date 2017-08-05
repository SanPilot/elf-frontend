/*
Validate and authenticate user
*/

(function() {

  // Input fields
  var user = document.querySelector("#username"),
  password = document.querySelector("#password"),
  signinButton = document.querySelector("#action-sys"),
  processing = false;

  // Validate input fields
  password.onkeyup = user.onkeyup = password.onkeydown = user.onkeydown = function(e) {

    // Change the value back to original
    signinButton.innerHTML = "Sign In";

    if(!processing) {
      if(password.value && user.value) {
        signinButton.disabled = false;
      } else {
        signinButton.disabled = true;
      }
    }

    // Trigger the signinButton if enter (ASCII 13) is pressed
    if(e.keyCode === 13) signinButton.click();

  }

  // Diable submit button to prevent unintended submitions
  var setProcFlag = function(disable) {
    signinButton.disabled = processing = disable;
  }

  signinButton.onclick = function() {

    // Disable the button to prevent unintended submitions
    setProcFlag(true);

    // Send auth request
    api.send({
      action: "auth",
      auth: [
        user.value,
        password.value
      ]
    }, function(resp) {

      if(resp.status === "success") {

        // Save the username
        localStorage.setItem("user", user.value);

        // Save the token to storage
        localStorage.setItem("authToken", JSON.stringify(resp.content));

        // Redirect
        authRedirect();

      } else {

        // Create incorrect password toast
        createToast("The sign in attempt was unsuccessful.");

      }

      // Re-enable submit button
      setProcFlag(false);

    });

  }
})();
