/*
Connect to and communicate with backend API server.
*/

if(config.debug) console.info("Connecting to API server at address " + config.apiAddress + ".");

// Generate an ID for each API request
function genId() {
  return Math.floor((Math.random()*0x100000000)).toString(16); // jshint ignore:line
}

// Global variable to store the WS API system
var api = {
  backlog: [],
  callbackArray: {},
  con: {readyState: WebSocket.CLOSED},
  lastSec: 0, // To prevent becoming blocked by the server

  // Function to send messages currently in backlog
  execMessages: function(index) {

    if(index === undefined || !this.backlog[index]) {

      // Recursively send each message
      if(this.backlog.length > 0) this.execMessages(this.backlog.length - 1);
      return;

    }

    if(this.con.readyState !== WebSocket.OPEN) return; // Wait for open connection

    if(this.lastSec >= config.lastSec - 1) {

      // Do not send over 10 messages a second to the server
      setTimeout(function() {
        api.execMessages(index);
      }, 50);
      return;

    }

    // Encode and send the message
    var id = genId(),
    message = this.backlog[index][0];
    message.id = id;

    // Add auth token to the message
    if(localStorage.getItem("authToken")) {
      message.JWT = JSON.parse(localStorage.getItem("authToken")).token;
    } else {
      if(config.debug) console.warn("Sending message without authentication.");
    }

    // Send the message and increment last second counter
    this.con.send(JSON.stringify(message));
    this.lastSec++;

    // Add this to the callback array
    this.callbackArray[id] = this.backlog[index][1];

    // In case the server doesn't respond within the timeout
    setTimeout(function() {

      // If the callback has already been executed, there is no need for timeout warning.
      if(!api.callbackArray[id]) return;

      if(config.debug) console.error("Request timed out.");
      api.callbackArray[id]({type: "short", status: "failed", error: "Request timed out"});
      delete api.callbackArray[id];

    }, config.serverTimeout);

    // Remove the message from the backlog and move on to the next message to be sent
    this.backlog.splice(index, 1);
    if(this.backlog.length > 0) this.execMessages(--index);

  },
  send: function(message, callback) {

    // Make callback optional
    callback = callback || function() {};

    // Add this request to the backlog
    this.backlog.unshift([message, callback]);

    // Send the messages in the backlog
    this.execMessages();

  }
};

// Reset counter
setInterval(function() {
  api.lastSec = 0;
}, 1100);

// Unify WS APIs
window.WebSocket = window.WebSocket || window.MozWebSocket;

// Print failure message to a toast
function printFailure() {
  createToast("Elf was unable to connect to the database.", {"Reload": function() {window.location.reload(true);}, "Dismiss": function() {}});
}

// Function to connect to server
function createConnection(attempt, background) {

  // Display connection status or not
  background = background || false;

  // Unable to connect
  if(attempt > config.retries) {
    if(!background) printFailure();

    // Continue to try in the background
    setTimeout(function() {
      createConnection(1, true);
    }, 10000);

    return;
  }

  // If the API is not supported, exit
  if(!window.WebSocket) {
    printFailure();
    return;
  }

  // Create the connection
  api.con = new WebSocket(config.apiAddress);

  // If the connection fails, try again
  api.con.onerror = function(e) {
    if(config.debug) console.error("API server connection failed!");

    // Retry the connection
    setTimeout(function() {
      createConnection(++attempt, background);
    }, 1000);

    return;
  }

  // If the connection succeeds, continue
  api.con.onopen = function() {

    if(config.debug) console.info("Successfully connected to API server.");

    // Alert the user that the connection has been restored
    if(background) createToast("Connection restored.", {"Dismiss": function() {}});

    // If the connection unexpectedly closes, fail all dispatched requests
    api.con.onclose = function() {
      if(config.debug) console.error("Connection to server closed unexpectedly.");

      // Notify the user
      createToast("Server is temporarily unavailable. Attempting to reconnect...", {"Dismiss": function() {}});

      for(var callback in api.callbackArray) {
        api.callbackArray[callback]({type: "short", status: "failed", error: "Connection to the server closed unexpectedly"});
        delete api.callbackArray[callback];
      }

      // Attempt reconnection to the server
      createConnection(1, true);
    }

    // Respond to incoming messages
    api.con.onmessage = function(message) {

      // Attempt to parse the message
      var parsed;

      try {
        parsed = JSON.parse(message.data);
      } catch(e) {
        if(config.debug) console.error("Incoming message could not be parsed", e);
        return;
      }

      // Ensure the id is in the callback array
      if(!api.callbackArray[parsed.id]) return;

      // Retrieve the callback
      var callback = api.callbackArray[parsed.id];

      // Remove the callback
      delete api.callbackArray[parsed.id];

      // Execute the callback
      callback(parsed);

      // If there is an auth error, redirect to signin
      if(parsed.status !== 'success' && parsed.error === "Authentication failed") {
        localStorage.removeItem("authToken");
        authRedirect("You have been signed out. Please sign in again.");
      }


    };

    // Execute backlog messages
    api.execMessages();

  }

}

// Connect to the server
createConnection(1);
