// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


var searchForm = document.querySelector("#search-form");
var keywordInput = searchForm.querySelector("input[name='url']");
var fileTextarea = document.querySelector("#file-contents");

searchForm.addEventListener("submit", function(e) {
  e.preventDefault();
  e.stopPropagation();
  
  var request = new XMLHttpRequest();
  request.open('GET', keywordInput.value, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var resp = request.responseText;
      alert('resp:' + resp);
      fileTextarea.value = resp;
    } else {
      // We reached our target server, but it returned an error

    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();

  return false;
}, false);