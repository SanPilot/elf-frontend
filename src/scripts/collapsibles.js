/* Allow user to collapse designated sections */

window.onload = function() {

  // Helper function to change style without transition
  var woTransitions = function(settingElem, property, value) {
    settingElem.classList.add('no-transition');
    settingElem.style[property] = value;
    settingElem.offsetHeight; // jshint ignore:line
    settingElem.classList.remove('no-transition');
  },

  // Search for collapsible elements
  cElems = document.getElementsByClassName("collapsible"),

  // Function for each matched element
  collapseReady = function(elem) {

    // This id is associated with the section that is collapsible
    var id = elem.id.split("-")[1],

    // This is the element will be collapsed
    eTC = document.getElementById('collapsible-body-' + id);

    // Add an indication that the section is collapsible
    elem.innerHTML += " <span class='collapse-button' id='collapse-button-" + id + "'>[ - ]</span>";

    // Make the section collapsible
    elem.style.cursor = "pointer";
    elem.title = "Collapse this section";
    var oFunc = function() {
      eTC.style.display = "block";
      setTimeout(function() {
        eTC.style.opacity = 1;
        document.getElementById('collapse-button-' + id).innerHTML = "[ - ]";
        elem.title = "Collapse this section";
        elem.onclick = cFunc;
      }, 10);
    },
    cFunc = function() {
      eTC.style.opacity = 0;
      document.getElementById('collapse-button-' + id).innerHTML = "[ + ]";
      elem.title = "Uncollapse this section";
      elem.onclick = oFunc;
      setTimeout(function() {
        var restoreMargin = elem.style.marginBottom;
        woTransitions(elem, 'marginBottom', (eTC.scrollHeight + 43) + 'px');
        eTC.style.display = "none";
        elem.style.marginBottom = restoreMargin;
      }, 200);
    };

    elem.onclick = cFunc;

  };

  // Iterate through each element
  for(var i = 0; i < cElems.length; i++) {
    collapseReady(cElems[i]);
  }

};
