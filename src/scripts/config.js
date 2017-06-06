/*
Frontend configuration options
*/

var config = {
  apiAddress: "ws://127.0.0.1:3000", // network address of backend server
  debug: true, // print debug statements to console
  featureCheck: true, // ensure client supports all functionality
  retries: 5, // when failed, how many times to retry request
  serverTimeout: 10000, // how long to wait for a response
  lastSec: 2 // backend rate-limiting
};
