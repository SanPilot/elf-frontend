/*
Use document location to display requested information
*/

// A configurable list of routes
var routes = {

  _default: "default.route.js", // the default path, to be loaded when there is no route

};

// Globally accessible routePath
var getRoutePath = function() {

  // Split the URI into sections
  var rawPaths = window.location.pathname.split("/"),
  paths = [],
  foundPointer = false;

  // Remove empty and other strings
  for(var i = 0; i < rawPaths.length; i++) {
    if(rawPaths[i] === "dashboard") {
      foundPointer = true;
      continue;
    }
    if(!rawPaths[i].length || !foundPointer) continue;
    paths.push(rawPaths[i]);
  }

  // Return the result
  return paths;
};

// Function to load in script
var lazyload = function(src) {
  var script = document.createElement('script');
  script.type = "text/javascript";
  script.src = "/scripts/routes/" + src;
  document.body.append(script);
}

// Function that gets current url and routes
var route = function() {

  // Get the current route, or use _default if its empty
  var selectedRoute = getRoutePath()[0];

  // Ensure that the selectedRoute exists
  if(!routes[selectedRoute]) selectedRoute = "_default";

  // Load in the route
  lazyload(routes[selectedRoute]);

}

// Global pushState monkey function
var setRoute = function(routePath) {

  // Push the new url
  history.pushState({}, "", routePath);

  // Route the new url
  route();

}

// Route on popstate
window.onpopstate = route;

// Route when the page loads
route();
