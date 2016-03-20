chrome.storage.sync.get('redirects', function(items) {
  var redirects = items.redirects;
  chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
      var now = new Date();
      var position = now.getHours()*100+now.getMinutes()/0.6;
      for (var i = 0 ; i < today.length ; i++) {
        if (today[i][0][1] > position) {
          break;
        } else if (today[i][0][2] > position) {
          if (!redirects){
            redirects = [];
          }
          redirects.push([+new Date(),info.url]);
          chrome.storage.sync.set({'redirects': redirects});
          return {redirectUrl: chrome.extension.getURL("/SchedulePage/Schedule.html")};
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
});



