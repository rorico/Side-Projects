function block(e,n){var o=$("<div id='chromeTools_block'></div>");$("body").append(o),"time"===e?(timeLineInit(o,n),keyPressInit(o,keyPhrases)):scheduleInit(o)}function unblock(){$("#chromeTools_block").remove()}function weekSchedule(e,n){sendRequest("weekSchedule",e,n)}function sendRequest(e,n,o){chrome.runtime.sendMessage({from:"content",action:e,input:n},o)}chrome.runtime.onMessage.addListener(function(e,n,o){"block"===e.action?block(e.type,e.info):"unblock"===e.action&&unblock()});