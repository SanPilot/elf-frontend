/*
Create toast notifications
*/

var createToast = function(message, actions) {

  // Create the toast element
  var toast = document.createElement("div");
  toast.innerHTML = "<div>" + message + "</div>";
  toast.classList.add("toast");
  toast.classList.add("card");
  var removeToast = function() {
    toast.style.opacity = 0;
    toast.style.bottom = (document.getElementsByClassName("toast").length * 4 - 2.5) + "em";
    setTimeout(function() {
      toast.parentNode.removeChild(toast);
    }, 200);
  }

  // Add the actions to the toast
  var actionList = document.createElement("div");
  actionList.classList.add("actions");
  var numberOfActions = 0;
  for(var action in actions) {
    numberOfActions++;
    var appendAction = document.createElement("span");
    appendAction.innerHTML = action;
    appendAction.onclick = function() {
      actions[action](removeToast);
    };
    appendAction.classList.add("action");
    actionList.appendChild(appendAction);
  }
  if(numberOfActions > 0) toast.appendChild(actionList);

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
  setTimeout(removeToast, 20000);
};
