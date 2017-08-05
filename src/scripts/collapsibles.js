/* Allow user to collapse designated sections */

window.onload = function() {

  // Search for collapsible elements
  var cElems = document.getElementsByClassName("collapsible"),

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
      document.getElementById('collapse-button-' + id).innerHTML = "[ - ]";
      elem.title = "Collapse this section";
      elem.onclick = cFunc;
    },
    cFunc = function() {
      document.getElementById('collapse-button-' + id).innerHTML = "[ + ]";
      elem.title = "Uncollapse this section";
      eTC.style.display = "none";
      elem.onclick = oFunc;
    };

    elem.onclick = cFunc;

  };

  // Iterate through each element
  for(var i = 0; i < cElems.length; i++) {
    collapseReady(cElems[i]);
  }

};
