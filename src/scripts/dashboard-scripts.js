// Scripts for dashboard page

// Search bar stuff
// Object for search bar related functions for opening/closing search bar
var searchBar = {

  // Is the search bar open?
  isOpen: false,

  // Functions for opening/closing search bar
  open: function() {
    searchBar.isOpen = true;
    $("#open-search-button-icon").css("background-color", "rgba(255, 255, 255, 0.4)").html("close");
    $("#content").css("margin-top", "0");

    // ¯\_(ツ)_/¯ This setTimeout fixed problems, so I kept it.
    setTimeout(function() {
      $("#search-input").focus();
      $("#search").css("opacity", 1);
    }, 0);
  },

  close: function() {
    searchBar.isOpen = false;
    $("#open-search-button-icon").css("background-color", "initial").html("search");
    $("#search").css({"opacity": 0, "top": 0, "z-index": -999});
    $("#content").css("margin-top", "-64px");
    $("#search-input").val("").focusout();
  },
};

// Implement search bar open/close functions
$("#open-search-button-icon").on("mousedown", function() {
  if(!searchBar.isOpen) {
    searchBar.open();
  } else {
    searchBar.close();
  }
});

// Change background-color of open search bar button on hover
$("#open-search-button-icon").hover(function() {
  if(!searchBar.isOpen) {
    $("#open-search-button-icon").css("background-color", "rgba(255, 255, 255, 0.2)");
  }
}, function() {
  if(!searchBar.isOpen) {
    $("#open-search-button-icon").css("background-color", "initial");
  }
});

// Make sure search-input is put in focus when the search bar is clicked
$("#search").on("mousedown", function() {
  $("#search-input").focus();
});

// Make sure clicking on the search doesn't deactivate the input
$("#search").on("mousedown", function(e) {
  if($("#search-input").is(":focus")) {
    e.preventDefault();
  }
});
