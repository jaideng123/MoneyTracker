// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getUrl(reqURL, callback) {
var xhr = new XMLHttpRequest();
xhr.open("GET", reqURL, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    callback(xhr.responseText);
  }
}
xhr.send();}

function renderPre(statusText) {
  document.getElementById('pre-balance').textContent = statusText;
}  
function renderPost(statusText) {
  document.getElementById('post-balance').textContent = statusText;
  document.getElementById('post-desc').style.display = 'block';
  if(statusText[1] == '-'){
    document.getElementById('post-balance').style.color = 'red'
  }
}        
function renderCost(statusText) {
  document.getElementById('cost').textContent = statusText;
  document.getElementById('price-desc').style.display = 'block';
}
function onAmazon(callback){
   var tabID
   var tabUrl
  chrome.tabs.getSelected(null, function(tab) {
        tabID = tab.id;
        tabUrl = tab.url;
        if(tabUrl.substring(0,22) == 'http://www.amazon.com/'){
          callback(tab)
        }
    });
}        

function doStuffWithDOM(element) {
    alert("I received the following DOM content:\n" + element);
}


var balance
var cost
var newBalance
var elem
var accountID
var done = 0
document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage("normal_icon");

    // Put the image URL in Google search.
    //renderStatus('Performing Google Imag search for ' + url);
    //chrome.extension.getBackgroundPage().console.log('Hello!');
    //console.log(Get('api.reimaginebanking.com/accounts/560f0207f8d8770df0efa3fe?key=aaf37afb12d98c6d8610edfde329b8f0'));
     chrome.storage.sync.get({
    AID: ''
    }, function(items) {
    accountID = items.AID;
    url = 'http://api.reimaginebanking.com/accounts/'+accountID+'?key=aaf37afb12d98c6d8610edfde329b8f0'
      getUrl(url, function(results) {
        console.log(results);
        var account = JSON.parse(results);
        renderPre('$'+account.balance);
        balance = Number(account.balance)
        done += 1
        if(done == 2){
          newBalance = balance - cost
          renderPost(newBalance)
        }
      });
    });
    onAmazon(function(tab){
        chrome.tabs.sendMessage(tab.id, { text: "report_back" },
                                function(element){
                                  elem = element
                                  renderCost(element.split('<')[0].trim())
                                  cost = Number(element.split('<')[0].trim().substring(1))
                                  done += 1
                                  if(done == 2){
                                    newBalance = balance - cost
                                    renderPost('$' + newBalance)
                                  }
                                });
    });
    //else
      //alert('bad')
});