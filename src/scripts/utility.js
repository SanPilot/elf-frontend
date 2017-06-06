/*
Helper functions
*/

// Global variable containing functions
var utility = {};

// Function to get current time in seconds
utility.specTime = function() {
  return Math.floor(Date.now() / 1000);
};
