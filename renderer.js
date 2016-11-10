// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const url = require('url');
const path = require('path');

var searchForm = document.querySelector("#search-form");
var keywordInput = searchForm.querySelector("input[name='url']");
var fileTextarea = document.querySelector("#file-contents");
var tsUrlTextarea = document.querySelector('#ts-urls');

searchForm.addEventListener("submit", function(e) {
  e.preventDefault();
  e.stopPropagation();
  var m3u8Url = keywordInput.value;
  var request = new XMLHttpRequest();
  request.open('GET', m3u8Url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var resp = request.responseText;
      fileTextarea.value = resp;
      parseFileContents(resp, m3u8Url);
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

function parseFileContents(str, m3u8Url) {
  var arr = str.split("\n");
  var tsArr = arr.filter(function(v){
    return v.indexOf('.ts') > 1;
  });
  var urlObject = url.parse(m3u8Url);
  //var urlPath = urlObject.protocol + '//' + urlObject.host + urlObject.pathname;
  //console.log('urlPath:', urlPath);
  tsArr.forEach(function(v, index, array) {
    if (!~v.indexOf('http')) {
      
      array[index] = urlObject.protocol + '//' + urlObject.host + path.dirname(urlObject.pathname) + '/' + v;
      //console.log('v1:', v);
    }
  });
  tsUrlTextarea.value = tsArr.join("\n");
}