// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const http = require('http');
const url = require('url');
const path = require('path');

document.addEventListener('DOMContentLoaded', (event) => {

  const searchForm = dom("#search-form"),
      keywordInput = dom("input[name='url']"),
      fileTextarea = dom("#file-contents"),
      tsUrlTextarea = dom('#ts-urls');

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    let m3u8Url = keywordInput.value;
    
    fetch(m3u8Url).then(function(response){
      return response.text();
    }).then(function(text){
      fileTextarea.value = text;
      parseFileContents(text, m3u8Url);
    }).catch(function(error) {
      alert(error.message);
    });
    return false;
  }, false);

  function parseFileContents(str, m3u8Url) {
    let arr = str.split("\n");
    let tsArr = arr.filter((v) => {
      return v.indexOf('.ts') > 1;
    });
    let urlObject = url.parse(m3u8Url);
    tsArr.forEach((v, index, array) => {
      if (!~v.indexOf('http')) {
        array[index] = urlObject.protocol + '//' + urlObject.host + path.dirname(urlObject.pathname) + '/' + v;
      }
    });
    tsUrlTextarea.value = tsArr.join("\n");
  }

});

function dom(selector) {
  return document.querySelector(selector);
}