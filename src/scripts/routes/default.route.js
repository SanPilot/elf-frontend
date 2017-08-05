/*
Main dashboard page
*/

(function() {

  // Clear the dashboard
  utility.clearDashboard();

  // Create first card
  var created = {};
  created.searchCard = utility.create.card();
  created.searchCard.innerHTML = "<input type='text' class='field-clear' placeholder='Loading...' id='dashboard-search' style='width: 100%' disabled>";
  utility.els.main.append(created.searchCard);
  var search = document.querySelector("#dashboard-search");
  search.onkeydown = search.onkeyup = function(e) {};

  // Create user card
  created.userCard = utility.create.card(true);
  created.userCard.style.display = "none";
  utility.els.sidebar.append(created.userCard);

  // Create notification collapsible section

  // Fetch information from the server
  utility.fetch({

    // Get user information
    user: function(resolve) {
      var currentUser = localStorage.getItem("user");
      utility.fetchUsers([currentUser], function(user) {
        if(user === false) {

          // The request has failed
          if(config.debug) console.error("Unable to fetch user information.");
          createToast("There was an issue loading information from the server.", {"Reload": function() {window.location.reload(true);}});

          // Exit the function
          resolve(false);
          return;

        }
        resolve(user[currentUser]);
      });
    },

    // Get projects
    projects: function(resolve) {
      var fetchProjects = function(attempt) {
        attempt = attempt || 1;
        if(attempt > config.retries) {
          if(config.debug) console.error("Failed to get projects.");
          resolve(false);
          return;
        }
        api.send({action: 'listProjects', ids: []}, function(result) {
          if(result.status !== "success") {
            fetchProjects(++attempt);
            return;
          }
          var sortedList = {};
          for(var i = 0; i < result.content.length; i++) {
            sortedList[result.content[i].id] = result.content[i];
          }
          resolve(sortedList);
        });
      };
      fetchProjects();
    },

    // Fetch notifications
    notifications: function(resolve) {
      // Get up to 5 pages of notifications
      var notifs = [],
      getNotifs = function(page, attempt) {
        attempt = attempt || 1;
        if(attempt > config.retries) {
          console.error("Failed 'getNotifs' function");
          return;
        }
        api.send({
          action: "getNotifications",
          page: page
        }, function(res) {

          // Error handling
          if(res.status !== "success") {
            getNotifs(page, ++attempt);
            return;
          }

          for(var i = 0; i < res.content.notifications.length; i++) {
            notifs.push(res.content.notifications[i]);
          }
          if(page < 1 && page < res.content.pages) {
            getNotifs(++page);
            return;
          }

          // Figure out which of the notifications are open
          var collatedNotifs = {
            byId: {},
            uniqueIds: []
          };
          for(var i2 = 0; i2 < notifs.length; i2++) {
            if(collatedNotifs.byId[notifs[i2].taskId]) {
              collatedNotifs.byId[notifs[i2].taskId].push(notifs[i2]);
            } else {
              collatedNotifs.byId[notifs[i2].taskId] = [notifs[i2]];
              collatedNotifs.uniqueIds.push(notifs[i2].taskId);
            }
          }

          utility.fetchTasks(collatedNotifs.uniqueIds, [], false, function(tasks) {
            if(tasks === false) {
              createToast("Some tasks could not be loaded.");
              resolve(false);
              return;
            }
            var finalizedNotifs = [];
            for(var task in tasks) {
              finalizedNotifs.push({task: tasks[task], notifs: collatedNotifs.byId[task]});
            }
            resolve(finalizedNotifs);
          });
        });
      };
      getNotifs(1);
    }

  }, function(data) {

    // Set the page
    var searchbar = document.querySelector("#dashboard-search");
    searchbar.placeholder = "Search for tasks and users...";
    searchbar.disabled = false;

    if(data.user) {
      created.userCard.style.display = "block";
      var userHeader = utility.create.card2Section();
      userHeader.append(utility.create.sectionHeader(data.user.name));
      userHeader.innerHTML += "<div class='section-header-subtext'>@" + data.user.user + "</div>";
      created.userCard.append(userHeader);

      var userOptions = [
        ['View Your Tasks', function() {setRoute("tasks/user/" + data.user.user)}],
        ['Edit Profile', function() {}]
      ];

      for(var i = 0; i < userOptions.length; i++) {
        var userOptionSection = utility.create.card2Section(["option"]);
        userOptionSection.innerHTML = userOptions[i][0];
        userOptionSection.onclick = userOptions[i][1];
        created.userCard.append(userOptionSection);
      }

      var signout = utility.create.card2Section(["beach"]);
      signout.append(utility.create.button("Sign Out", true, function() {
        localStorage.removeItem("authToken");
        authRedirect(true);
      }));
      created.userCard.append(signout);
    }

    // Load notifications
    if(data.notifications) {
      document.querySelector("#subtext").innerHTML = data.notifications.length + " NOTIFICATION" + (data.notifications.length !== 1 ? "S" : "") + ".";

      for(var i2 = 0; i2 < data.notifications.length; i2++) {
        utility.els.main.append(utility.create.taskCard(data.notifications[i2].task, data.notifications[i2].notifs, data.projects));
      }
    }

  });

})();
