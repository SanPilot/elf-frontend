// Show or hide the Feedback button
var hideFeedbackButton = function(action) {
  // Feedback button
  var feedbackButton = $('.feedback-button');
  if(action) {
    feedbackButton.css("bottom", "-36px");
  } else {
    feedbackButton.css("bottom", "24px");
  }
}

$(document).ready(function() {
  // Scrolling up or down?
  var top = $('#scroll-container').scrollTop();
  $('#scroll-container').scroll(function(){
    var cur_top = $('#scroll-container').scrollTop();
    if(top < cur_top) {
      // Down
      hideFeedbackButton(true);
    }
    else {
      // Up
      hideFeedbackButton(false);
    }
    top = cur_top;
  });
});
