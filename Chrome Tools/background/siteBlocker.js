chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    var now = new Date();
    var position = now.getHours()*100+now.getMinutes()/0.6;
    for (var i = 0 ; i < today.length ; i++) {
      if (today[i][0][1] > position) {
        break;
      } else if (today[i][0][2] > position) {
        return {redirectUrl: chrome.extension.getURL("Schedule.html")};
      }
    }
  },
  {
    urls: [
      "http://reddit.com/*", "https://reddit.com/*", "http://*.reddit.com/*", "https://*.reddit.com/*",
      "http://threesjs.com/"
    ],
    types: ["main_frame"]
  },
  ["blocking"]
);