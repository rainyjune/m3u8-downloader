// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

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
      return (v.indexOf('.ts') > 1) || (v.indexOf('.webm') > 1);
    });
    let urlObject = url.parse(m3u8Url);
    tsArr.forEach((v, index, array) => {
      if (!~v.indexOf('http')) {
        array[index] = urlObject.protocol + '//' + urlObject.host + path.dirname(urlObject.pathname) + '/' + v;
      }
    });
    tsUrlTextarea.value = tsArr.join("\n");
    
    downloadFilelist(tsArr);
    
  }

});

function dom(selector) {
  return document.querySelector(selector);
}

function downloadFilelist(fileArr) {
  fileArr.forEach(function(file){
    var pathname = url.parse(file).path;
    var filename = path.basename(pathname);
    download(file, './ts/' + filename, function(data){
      console.log(file + ' finished');
    });
  });  
}

function download(url, dest, cb) {
  let file = fs.createWriteStream(dest);
  //return false;
  let request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', (err) => { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
}
