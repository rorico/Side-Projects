var startTime = new Date();
var wastingTime = false;
var pastUrl = "";
var timeLeft = 600000; //start at 10 mins
var alarm;
var timeLine = [];
var urls = [
  "http://reddit.com/*", "https://reddit.com/*", "http://*.reddit.com/*", "https://*.reddit.com/*",
  "http://threesjs.com/"
]
chrome.storage.sync.get('redirects', function(items) {
  var redirects = items.redirects;
  chrome.webRequest.onBeforeRequest.addListener(function(info) {
    var now = new Date();
    var position = now.getHours()*100+now.getMinutes()/0.6;
    for (var i = 0 ; i < today.length ; i++) {
      if (today[i][0][1] > position) {
        break;
      } else if (today[i][0][2] > position) {
        return redirect(info);
      }
    }
    handleNewPage(true,info.url);
    if(timeLeft <= 0) {
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
    /*if (!redirects){
      redirects = [];
    }
    redirects.push([+new Date(),info.url,1]);
    chrome.storage.sync.set({'redirects': redirects});*/
    return {redirectUrl: chrome.extension.getURL("/SchedulePage/Schedule.html")};
  }
});



chrome.tabs.onActivated.addListener(function(activeInfo){
  chrome.tabs.get(activeInfo.tabId, function(tab){
    handleNewPage(matchesURL(tab.url),tab.url);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(changeInfo && changeInfo.status === "loading") {
    handleNewPage(matchesURL(tab.url),tab.url);
  }
});

function handleNewPage(newWasting,url) {
    var timeSpent = new Date() - startTime; 
    timeLine.push([timeSpent,wastingTime,pastUrl]);
    if(wastingTime) {
      var timeSpent = new Date() - startTime; 
      var timeDelay = 3600000 - timeSpent;  //return time spent every hour
      clearTimeout(alarm);
      timeLeft -= timeSpent;
      returnTime(timeSpent,timeDelay);
    }
    if (newWasting) {
      setReminder(timeLeft);
    }
    wastingTime = newWasting;
    startTime = new Date();
    pastUrl = url;
}

function returnTime(time,delay) {
  setTimeout(function(){
    if(timeLeft < 0 && timeLeft < time) {
      timeLeft = 0;
      returnTime(time-timeLeft,timeLeft);
    } else {
      timeLeft += time;
    }
  },delay);
}

function matchesURL(url) {
  for (var i = 0 ; i < urls.length ; i++) {
    if (new RegExp("^" + urls[i].replace(/\./g,"\\.").replace(/\*/g, ".*") + "$").test(url)){
      return true;
    }
  }
  return false;
}

function setReminder(time){
  clearTimeout(alarm);
  var timeLeftP = timeLeft;
  if(timeLeft <= 0) {
    time = 2000;
  }
  alarm = setTimeout(function(){ 
    if(timeLeft === timeLeftP) {
      setAlarm(0);
    } else {
      setReminder(timeLeftP - timeLeft);
    }
  },time);
}