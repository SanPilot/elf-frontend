/*
Ensure the client supports all functionality
*/

// Run only if the feature check is enabled in config
if(config.featureCheck && localStorage.getItem("dismissFeatureCheck") !== "true") {

  if(config.debug) console.log("Running feature check...");

  var checkFeatures = {
    "WebSockets": window.WebSocket,
    "Dedicated WebWorkers": window.Worker,
    "LocalStorage": window.localStorage
  },
  missing = [],
  checkFailed = false;

  for(var feature in checkFeatures) {
    if(!checkFeatures[feature]) {
      checkFailed = true;
      missing.push(feature);
      if(!config.debug) break; // if this is debug, continue the loop so all missing features can be reported
    }
  }

  if(checkFailed) {
    createToast("You may experience issues with Elf.",
    {
      "Dismiss": function() {
        localStorage.setItem("dismissFeatureCheck", "true");
      }
    });
    if(config.debug) console.error("Feature check failed. The following were not detected: " + missing.join(", "));
  } else if(config.debug) {
    console.log("Feature check passed.");
  }

}
