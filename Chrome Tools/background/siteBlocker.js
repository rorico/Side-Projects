var pastTime = new Date();
var startTime = new Date();
var wastingTime = false;
var pastUrl;
var timeLeft = 600000; //start at 10 mins
var alarm;
var timeLine = [];
var urls = [
  "http://reddit.com/*", "https://reddit.com/*", "http://*.reddit.com/*", "https://*.reddit.com/*",
  "http://threesjs.com/"
]
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
          return redirect(info);
        }
      }
      if(wastingTime) {
        var timeSpent = new Date() - startTime; 
        var timeDelay = 120000 - timeSpent;
        if (timeSpent > timeLeft) {
          timeDelay -= timeLeft - timeSpent;
          timeSpent = timeLeft;
          timeLeft = 0;
        } else {
          clearTimeout(alarm);
          timeLeft -= timeSpent;
        }
        setTimeout(function(){
          timeLeft += timeSpent;
        },timeDelay);
      }
      if(timeLeft>0) {
        startTime = new Date();
        recordTimer();
        pastUrl = info.url;
        wastingTime = true;
      } else {
        return redirect(info);
      }
    },
    {
      urls: urls,
      types: ["main_frame"]
    },
    ["blocking"]
  );
  function redirect(info){
    if (!redirects){
      redirects = [];
    }
    redirects.push([+new Date(),info.url,1]);
    chrome.storage.sync.set({'redirects': redirects});
    return {redirectUrl: chrome.extension.getURL("/SchedulePage/Schedule.html")};
  }
});



chrome.tabs.onActivated.addListener(function(activeInfo){
  //console.log(activeInfo);
  chrome.tabs.get(activeInfo.tabId, function(tab){
    var timeSpent = new Date() - startTime; 
    timeLine.push([timeSpent,wastingTime,pastUrl]);
    if(wastingTime) {
      var timeSpent = new Date() - startTime; 
      var timeDelay = 3600000 - timeSpent;  //every hour
      if (timeSpent > timeLeft) {
        timeDelay -= timeLeft - timeSpent;  //delay return for however longer past
        timeSpent = timeLeft;               //return only the part that didn't go past
        timeLeft = 0;
      } else {
        clearTimeout(alarm);
        timeLeft -= timeSpent;
      }
      setTimeout(function(){
        timeLeft += timeSpent;
      },timeDelay);
    }
    if (matchesURL(tab.url)) {
      startTime = new Date();
      wastingTime = true;
      recordTimer();
    } else {
      startTime = new Date();
      wastingTime = false;
    }
    pastUrl = tab.url;
  });
});

function matchesURL(url) {
  for (var i = 0 ; i < urls.length ; i++) {
    if (new RegExp("^" + urls[i].replace(/\./g,"\\.").replace(/\*/g, ".*") + "$").test(url)){
      return true;
    }
  }
  return false;
}

function recordTimer(){
  clearTimeout(alarm);
  alarm = setTimeout(function(){
    setAlarm(0);
  },timeLeft);
}