console.log("Started!");





chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.Page){
            chrome.tabs.get(request.Page.ID, function(tab) {
                chrome.windows.update(request.Page.WindowID, {'focused' : true}, function(_){
                    chrome.tabs.highlight({'tabs': tab.index});
                });

            });
        }

      
    }
);



