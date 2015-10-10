chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // read `newIconPath` from request and read `tab.id` from sender
        if(request == 'alert_icon'){
          chrome.tabs.getSelected(null, function(tab) {
          chrome.browserAction.setBadgeBackgroundColor({color:[229, 0, 0,250]});
          chrome.browserAction.setBadgeText({text:"!",tabId:tab.id});
      	  });
        }
        else if(request == 'normal_icon'){
        	chrome.tabs.getSelected(null, function(tab) {
        		chrome.browserAction.setBadgeText({text:"",tabId:tab.id});
        	});
        }
});