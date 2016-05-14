var startTime = new Date();
var wastingTime = false;
var url = "";
var title = "";
var tabId = -1;
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
            //today comes from scheduleInfo.js
            if (today[i][0][1] > position) {
                break;
            } else if (today[i][0][2] > position) {
                return redirect(info);
            }
        }
        if(timeLeft <= (now - startTime) * wastingTime) {
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
        return {redirectUrl: chrome.extension.getURL("/html/Schedule.html")};
    }
});

//set-up first time when opened
chrome.tabs.getSelected(chrome.windows.WINDOW_ID_CURRENT, function(tab){
    handleNewPage(matchesURL(tab.url),tab.url,tab.title);
})

chrome.tabs.onActivated.addListener(function(activeInfo){
    this.tabId = activeInfo.tabId;
    chrome.tabs.get(activeInfo.tabId, function(tab){
        handleNewPage(matchesURL(tab.url),tab.url,tab.title);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo && changeInfo.status === "loading" && tabId == this.tabId) {
        handleNewPage(matchesURL(tab.url),tab.url,tab.title);
    } else if(changeInfo && changeInfo.title && tabId == this.tabId) {
        title = changeInfo.title;
    }
});


/* does not measure when switching to outside chrome
var focused = true;
var out = [0,0,0];
chrome.windows.onFocusChanged.addListener(function(windowId){
    chrome.tabs.query({windowId:chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
        handleFocus(!!tabs.length);
    });
});

function handleFocus(newFocused){
    if(newFocused != focused) {
        if(newFocused) {
            handleNewPage(out[0],out[1],out[2]);
        } else {
            out = [wastingTime,url,title];
            handleNewPage(false,"","Not Chrome");
        }
    }
    focused = newFocused;
}*/

function handleNewPage(newWasting,newUrl,newTitle) {
    stopAllAlarms(2);
    var timeSpent = new Date() - startTime; 
    timeLine.push([timeSpent,wastingTime,url,title]);
    if(wastingTime) {
        var timeSpent = new Date() - startTime; 
        var timeDelay = 3600000 - timeSpent;    //return time spent every hour
        clearTimeout(alarm);
        timeLeft -= timeSpent;
        returnTime(timeSpent,timeDelay);
    }
    if (newWasting) {
        setReminder(timeLeft);
    }
    startTime = new Date();
    wastingTime = newWasting;
    url = newUrl;
    title = newTitle;
}

function returnTime(time,delay) {
    setTimeout(function(){
        if(timeLeft < 0 && -timeLeft < time) {
            delay = -timeLeft;
            timeLeft = 0;
            returnTime(time-delay,delay);
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
            setAlarm(0,2);
        } else {
            setReminder(timeLeftP - timeLeft);
        }
    },time);
}