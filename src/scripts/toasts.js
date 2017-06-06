/*
Create toast notifications
*/

// Create the containing element
var toastContainer = document.createElement("div");
toastContainer.classList.add("toast-container");
document.body.appendChild(toastContainer);

var createToast = function(message, actions) {

  // Create the toast element
  var toast = document.createElement("div");
  toast.innerHTML = "<div>" + message + "</div>";
  toast.classList.add("toast");
  toast.classList.add("card");

  // Function to remove the toast
  var removeToast = function() {

    toast.style.opacity = 0;

    setTimeout(function() {
      toast.style.height = toast.style.marginBottom = toast.style.padding = 0;

      setTimeout(function() {
        toast.parentNode.removeChild(toast);
      }, 200);

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
    appendAction.onclick = (function(func) { // jshint ignore:line
      return function() {
        func();
        removeToast();
      }
    })(actions[action]);
    appendAction.classList.add("action");
    actionList.appendChild(appendAction);
  }
  if(numberOfActions > 0) toast.appendChild(actionList);

  // Add the toast to the toastContainer
  toastContainer.appendChild(toast);

  // Animate the toast
  toast.offsetHeight; // jshint ignore:line
  toast.style.marginBottom = "0.5em";

  // Remove the toast after 10 seconds
  setTimeout(removeToast, 10000);
};
