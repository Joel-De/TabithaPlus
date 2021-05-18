// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

// Search the bookmarks when entering the search keyword.
// $('#search').change(function () {
//   $('#bookmarks').empty();
//   dumpBookmarks($('#search').val());
// });

// Traverse the bookmark tree, and print the folder and nodes.


var list = document.getElementById('Tablist');
const Discard = document.getElementById('Discard');
const Sort = document.getElementById('Sort');
const DisableAutoDiscard = document.getElementById('DisableAutoDiscard');
const SearchBar = document.getElementById('SearchBar');
const CloseTab = document.getElementById('CloseTab');
const OpenTab = document.getElementById('OpenTab');
const PinTab = document.getElementById('PinTab');
var Tablist = [];
var WindowId=-1;


function QueryTabs(){

  console.log("Querying Tabs");
  chrome.tabs.query({}, LoadTabs);

  


}





function QueryWindow(){

  console.log("Querying Window");
  chrome.windows.getCurrent({}, LoadWindow);

  


}


QueryTabs();
QueryWindow();


// chrome.storage.local.get(['TabHistory'], function(result) {
//   console.log('Value currently is ' + result[0]);
// });
function LoadWindow(window){
  WindowId = window.id;
}

function LoadTabs(tabs){
  
  for (var tb of tabs){
          
      var ID = tb.id;
      var Title = tb.title;
      var url = new URL(tb.url);
      var WindowID = tb.windowId;
      var tabobj = {'ID' : ID, 
                    'Title':Title,
                    'URL' : url.hostname,
                    'WindowID':WindowID
                  };

      Tablist.push(tabobj);
  };
  
  for (var tab of Tablist){
  
    AddToList(tab.Title, tab.ID);
    
  }

}


function AddToList(value, id){
  var radiobox = document.createElement('input');
  radiobox.type = 'checkbox';
  radiobox.id = id;
  radiobox.value = value;

  var label = document.createElement('label')
  label.htmlFor =value;
  
  var description = document.createTextNode(value);
  label.appendChild(description);

  var newline = document.createElement('br');
  
  list.appendChild(radiobox);
  list.appendChild(label);
  list.appendChild(newline);
}


function clearList(){

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

}
  




//for sending a message


//for listening any message which comes from runtime
//chrome.runtime.onMessage.addListener(messageReceived);


// function messageReceived(msg) {
//   AddToList(msg.name);
// }

Discard.addEventListener('click', () => {
  // Draw the video frame to the canvas.
  
  
  for (var page of Tablist){

    var button = document.getElementById(page.ID);

    if ((button) && (button.checked == true)){
      chrome.tabs.discard(page.ID);
      console.log("Discarded - " + page.Title);
      


    }



  }
});

CloseTab.addEventListener('click', () => {
 
  for (var page of Tablist){
    var button = document.getElementById(page.ID);
    if ((button) && (button.checked == true)){
      chrome.tabs.remove(page.ID);
      console.log("Close Tab  - " + page.Title);
      location.reload();
    }
  }

    
});

Sort.addEventListener('click', () => {    
  Tablist.sort((a, b) => a.URL.localeCompare(b.URL));

  for (var i =0; i<Tablist.length; i++){
    page = Tablist[i];
    if (page.WindowID == WindowId){
      chrome.tabs.move(page.ID, {index: i});
      console.log("Sorted Tabs");
    }
  }

  
});

DisableAutoDiscard.addEventListener('click', () => {    
  for (var page of Tablist){
    var button = document.getElementById(page.ID);
    if ((button) && (button.checked == true)){
      chrome.tabs.update(page.ID, {'autoDiscardable': false});
      console.log("Disabled Auto Discard  - " + page.Title);
    }
  }
});


PinTab.addEventListener('click', () => {    
  for (var page of Tablist){
    var button = document.getElementById(page.ID);
    if ((button) && (button.checked == true)){
      chrome.tabs.update(page.ID, {'pinned': true});
      console.log("Pinned Auto Discard  - " + page.Title);
    }
  }
});


SearchBar.addEventListener('input', () => { 

  var text = SearchBar.value;
  clearList();

  for (var tab of Tablist){
    if (tab.Title.toLowerCase().includes(text.toLowerCase())){
      AddToList(tab.Title, tab.ID);
    

    }
      
  }



});










OpenTab.addEventListener('click', () => {
  for (var page of Tablist){
    var button = document.getElementById(page.ID);
    if ((button) && (button.checked == true)){






      chrome.runtime.sendMessage({'Page': page});






      
      console.log("Highlighted - " + page.Title)
      break;

    }
  }
});