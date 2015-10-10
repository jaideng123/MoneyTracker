/* Listen for messages */

$(document).ready(function(){
	chrome.runtime.sendMessage("alert_icon");
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	    /* If the received message has the expected format... */
	    if (msg.text && (msg.text == "report_back")) {
	        /* Call the specified callback, passing 
	           the web-pages DOM content as argument */
		    if(document.getElementById("priceblock_ourprice") != null)
		    	sendResponse(document.getElementById("priceblock_ourprice").innerHTML);
		    else
		    	sendResponse(document.getElementsByClassName('a-color-price')[0].innerHTML);
	    }
	});
});