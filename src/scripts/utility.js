/*
Helper functions
*/

// Global variable containing functions
var utility = {};

// Function to get current time in seconds
utility.specTime = function() {
  return Math.floor(Date.now() / 1000);
}

// Function to clear the dashboard page
utility.clearDashboard = function() {

  // Clear the center and sidebar sections
  document.querySelector(".sidebar").innerHTML = document.querySelector(".center").innerHTML = document.querySelector(".subtext").innerHTML = "";

};

// Function to format date
utility.dateFormat = function(date) {
  date = date || new Date();
  if(date.constructor !== Date) {
    if(Math.abs((date * 1000) - new Date()) < Math.abs(date - new Date())) {
      date = new Date(date * 1000);
    } else {
      date = new Date(date);
    }
  }
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var hour = [date.getHours(), date.getHours()>12];
  if(hour[1]) hour[0] -= 12;
  var minute = date.getMinutes();
  if(minute < 10) minute = "0" + minute;
  return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + ", " + hour[0] + ":" + minute + " " + (hour[1] ? "PM" : "AM");
}

// Hold a cache of user information
utility.userCache = {};

// Fetch user information
utility.fetchUsers = function(users, callback, attempt) {

  // Fail at specified number of attempts
  attempt = attempt || 1;
  if(attempt > config.retries) {
    callback(false);
    return;
  }

  // Object that will contain the result
  var returnObj = {},

  // Cache misses that must be fetched
  missedUsers = users;

  // Check for cache hits
  for(var i = 0; i < users.length; i++) {
    if(utility.userCache[users[i]]) {
      returnObj[users[i]] = utility.userCache[users[i]];
      missedUsers.splice(missedUsers.indexOf(users[i]), 1);
    }
  }

  // Fetch the catch misses
  api.send({
    action: "getUsers",
    users: missedUsers
  }, function(response) {

    // Retry if request failed
    if(response.status !== "success") {
      if(config.debug) console.error("Failed 'getUsers' request: " + response.error);
      utility.fetchUsers(users, callback, ++attempt);
      return;
    }

    // Add the returned users to the result array AND to the cache
    for(var i = 0; i < response.content.length; i++) {
      returnObj[response.content[i].user] = utility.userCache[response.content[i].user] = response.content[i];
    }

    // Execute the callback
    callback(returnObj);

  });

};

// Function to fetch tasks and related information
utility.fetchTasks = function(ids, users, done, callback, attempt) {
  attempt = attempt || 1;
  if(attempt > config.retries) {
    if(config.debug) console.error("Failed 'getTasks' request.");
    callback(false);
    return;
  }
  if(!ids || ids.constructor !== Array) ids = [];
  if(!users || users.constructor !== Array) users = [];
  api.send({
    action: "listTasks",
    request: {
      ids: ids,
      users: users,
      done: done
    }
  }, function(result) {
    if(result.status !== "success") {
      utility.fetchTasks(ids, users, callback, ++attempt);
      return;
    }
    var returned = {};
    for(var i = 0; i < result.content.length; i++) {
      returned[result.content[i].id] = result.content[i];
    }
    callback(returned);
  });
}

// Functions to create objects
utility.create = {

  button: function(innerHTML, secondary, onclick) {
    var button = document.createElement("button");
    if(innerHTML !== undefined) button.innerHTML = innerHTML;
    if(secondary === true) button.classList.add("secondary");
    if(onclick !== undefined) button.onclick = onclick;
    return button;
  },

  card: function(card2) {
    var card = document.createElement("div");
    card.classList.add("card");
    if(card2) card.classList.add("card2");
    return card;
  },

  card2Section: function(types) {
    types = types || [];
    var section = document.createElement("div");
    section.classList.add("card2-section");
    for(var i = 0; i < types.length; i++) {
      section.classList.add("card2-section-" + types[i]);
    }
    return section;
  },

  sectionHeader: function(innerHTML) {
    var card = document.createElement("div");
    card.classList.add("section-header");
    if(innerHTML !== undefined) card.innerHTML = innerHTML;
    return card;
  }


};

// Create a new task card
utility.create.taskCard = function(task, notifs, projects) {
  var card = utility.create.card(true);

  if(notifs) {
    var notifsSection = utility.create.card2Section(["beach", "small"]);
    var taskStatus, mentioned = false;
    for(var i = 0; i < notifs.length; i++) {
      var type = notifs[i].type;
      switch(true) {

        case type === 'taskmention' || type === 'commentmention':
        mentioned = true;
        break;

        case type === 'taskclosed':
        taskStatus = false;
        break;

        case type === 'taskreopened':
        taskStatus = true;
        break;

      }
    }

    var notifString = (taskStatus !== undefined ? (taskStatus ? "This task was re-opened" : "This task was closed") : "") + (mentioned ? (taskStatus !== undefined ? "; y" : "Y") + "ou were mentioned" : "") + ".";

    notifsSection.innerHTML = notifString;
    card.append(notifsSection);
  }

  var infoLine = utility.create.card2Section(["small", "caps"]);
  var infoLineItems = [];
  infoLineItems.push('<span title="' + utility.dateFormat(task.createdAt) + '">' + (task.edited ? "Edited " : "Created ") + relativeDate(task.createdAt * 1000) + '</span>');
  if(projects) infoLineItems.push("In <a onclick=\"javascript:setRoute('/dashboard/projects/" + projects[task.project] + "')\">" + projects[task.project] + "</a>");
  if(task.priority) infoLineItems.push('<span style="color: #d50f0f">High Priority</span>');
  if(task.comments.length !== 0) infoLineItems.push(task.comments.length + ' comments');
  if(task.dueDate) infoLineItems.push("<span" + (task.dueDate - utility.specTime() < 259200 && task.dueDate - utility.specTime > 0 ? ' style="color: #d50f0f"' : '') + ">Due " + relativeDate(task.dueDate) + "</span>");
  var infoLineString = "";
  for(var i2 = 0; i2 < infoLineItems.length; i2++) {
    infoLineString += infoLineItems[i2];
    if(i2 < infoLineItems.length - 1) infoLineString += " &#183; ";
  }
  infoLine.innerHTML = infoLineString;
  card.append(infoLine);

  var taskTitle = utility.create.card2Section(['title']);
  taskTitle.innerHTML += task.summary;
  card.append(taskTitle);

  // Return the final task card
  return card;
}

// Shortcuts to common elements
utility.els = {

  sidebar: document.querySelector(".sidebar"),

  main: document.querySelector(".center")

};

// Function to async fetch info from the server
utility.fetch = function(fetchers, callback) {

  // Holds the data from the fetchers
  var results = {},

  timedOut = false,

  // Function to be passed to each fetcher to allow them to return their result
  createResolver = function(fetcherName) {
    return function(data) {
      results[fetcherName] = data;

      // Check if all fetchers have returned
      for(var fetcher in fetchers) {
        if(!results[fetcher]) return;
      }

      // Run the callback with the data
      if(!timedOut) {
        callback(results);
        clearTimeout(fetchTimeout);
      }
    }
  };

  // Run the fetchers; for each, create a resolve function
  for(var fetcher in fetchers) {
    fetchers[fetcher](createResolver(fetcher));
  }

  // Set a timeout
  var fetchTimeout = setTimeout(function() {
    timedOut = true;
    console.error("Fetch function timed out.");
    createToast("There was an issue retrieving your information.");
  }, config.serverTimeout);

};
