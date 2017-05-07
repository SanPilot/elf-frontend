/*
Create toast notifications
*/

var createToast = function(message, actions) {

  // Create the toast element
  var actionList = document.createElement("div");
  actionList.classList.add("actions");
  var numberOfActions = 0;
  for(var action in actions) {
    numberOfActions++;
    var appendAction = document.createElement("span");
    appendAction.innerHTML = action;
    appendAction.onclick = actions[action];
    appendAction.classList.add("action");
    actionList.appendChild(appendAction);
  }
  var toast = document.createElement("div");
  toast.innerHTML = "<div>" + message + "</div>";
  if(numberOfActions > 0) toast.appendChild(actionList);
  toast.classList.add("toast");
  toast.classList.add("card");

  // Move other toasts
  var moveToasts = document.getElementsByClassName("toast");
  for(var i = 0; i < moveToasts.length; i++) {
    moveToasts[i].style.bottom = ((moveToasts.length - i) * 4 + 1) + "em";
  }

  // Position the toast
  toast.style.bottom = "-4em";

  // Add the toast to the body
  document.body.appendChild(toast);

  // Animate the toast
  toast.offsetHeight; // jshint ignore:line
  toast.style.bottom = "1em";

  // Remove the toast after 20 seconds
  setTimeout(function() {
    toast.style.opacity = 0;
    toast.style.bottom = (document.getElementsByClassName("toast").length * 4 - 2.5) + "em";
    setTimeout(function() {
      toast.parentNode.removeChild(toast);
    }, 200);
  }, 20000);
};