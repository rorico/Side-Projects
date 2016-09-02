var startTime = new Date();
var wastingTime = false;
var url = "";
var title = "";
var tabId = -1;
var timeLineLength = 1800000; // 30 mins
var startingTimeLeft = 300000; // 5 mins
if(0) { // if in testing mode
    timeLineLength = 120000; // 2 mins
    startingTimeLeft = 60000; // 1 mins
}
var timeLeft = startingTimeLeft;
var alarm;
var timeLine = [];
var timeLineAsync = true;
var returnTimers = [];
var returnTimer = -1;
var displayTimer = -1;
var displayTimeStarter = -1;
var VIPtab = -1;
//sites that will block after time spent
var urls = [[
    "http://reddit.com/*", "https://reddit.com/*", "http://*.reddit.com/*", "https://*.reddit.com/*",
    "http://threesjs.com/",
],
//sites that will spend time but not actively block
[
    "http://*.youtube.com/*", "https://*.youtube.com/*",
    "http://imgur.com/*", "https://imgur.com/*", "http://*.imgur.com/*", "https://*.imgur.com/*"
]];
chrome.storage.sync.get('redirects', function(items) {
    var redirects = items.redirects;
    chrome.webRequest.onBeforeRequest.addListener(function(info) {
        if(info.tabId != VIPtab) {
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
            var currentTimeOffset = (wastingTime ? new Date() - startTime : 0);
            if(timeLeft <= currentTimeOffset) {
                return redirect(info);
            }
        }
    },
    {
        urls: urls[0],
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
returnTime(timeLineLength - timeLeft);

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

//used to make sure there is no async problems, likely not needed
function handleTimeLineAsync(action,load) {
    while(!timeLineAsync) {
        console.log("didn't think this situation would ever happen, good thing I coded this");
    }
    timeLineAsync = false;
    if(action === "push") {
        timeLine.push(load);
    } else if(action === "remove") {
        timeLine.splice(0,load);
    } else if(action === "change") {
        timeLine[load][1] = 0;
        changeTimeLeft(timeLine[load][0]);
    } else {
        console.log("this shouldn't happen");
    }
    timeLineAsync = true;
}

function handleNewPage(newWasting,newUrl,newTitle) {
    stopAllAlarms(2);
    var timeSpent = new Date() - startTime; 
    handleTimeLineAsync("push",[timeSpent,wastingTime,url,title,startTime]);
    if(wastingTime) {
        var timeSpent = new Date() - startTime; 
        changeTimeLeft(-timeSpent);
        if(wastingTime === 1) {
            clearTimeout(alarm);
        }
    }
    startTime = new Date();
    wastingTime = newWasting;
    url = newUrl;
    title = newTitle;
    if(newWasting) {
        if(newWasting === 1 && tabId !== VIPtab) {
            setReminder(timeLeft);
        }
    }
    countDownTimer();
}

function changeTimeLeft(change) {
    timeLeft += change;
    //remember to call countDownTimer(); at end of processing 
}

function countDownTimer() {
    clearTimeout(displayTimeStarter);
    clearInterval(displayTimer);
    var currentTimeOffset = (wastingTime ? new Date() - startTime : 0);
    var curTimeLeft = timeLeft - currentTimeOffset; //don't want to touch timeLeft variable
    if(curTimeLeft < 0) {
        curTimeLeft = 0;
    }
    chrome.browserAction.setBadgeText({text:MinutesSecondsFormat(curTimeLeft)});
    timerssss = new Date();
    if(wastingTime && curTimeLeft > 0) {
        delay = (curTimeLeft-1)%1000+1;
        displayTimeStarter = setTimeout(function(){
            curTimeLeft -= delay;
            if(wastingTime && curTimeLeft >= 0) {
                chrome.browserAction.setBadgeText({text:MinutesSecondsFormat(curTimeLeft)});
                displayTimer = setInterval(function(){
                    curTimeLeft -= 1000;
                    if(wastingTime && curTimeLeft >= 0) {
                        chrome.browserAction.setBadgeText({text:MinutesSecondsFormat(curTimeLeft)});
                    } else {
                        clearInterval(displayTimer);
                    }
                },1000);
            }
        },delay);
    }
}

function MinutesSecondsFormat(milli) {
    var secs = Math.ceil(milli/1000);
    return Math.floor(secs/60)  + ":" + ("0" + Math.floor(secs%60)).slice(-2);
}

function returnTime(delay) {
    returnTimer = setTimeout(function(){
        var date = new Date() - timeLineLength;
        var cnt = 0;
        var timeTotal = 0;
        var currentTimeInterval = new Date() - startTime;
        var currentTimeOffset = (wastingTime ? currentTimeInterval : 0);
        //remove anything after limit
        for (var i = 0 ; i < timeLine.length ; i++) {
            //endtime is same as next starttime
            var endTime = (i === timeLine.length - 1 ? timeLine[i][4] + timeLine[i][0] : timeLine[i+1][4]);
            if (date > endTime) {
                if (timeLine[i][1]) {
                    timeLeft += timeLine[i][0];
                }
                cnt++;
            } else {
                timeTotal = timeLine[i][4] - date; //negative
                break;
            }
        }
        if(cnt) {
            handleTimeLineAsync("remove",cnt);
        }
        //return time and calculate when to call function again
        //ideally check again when can return time again
        var changed = [];
        var completed = false;
        for (var i = 0 ; i < timeLine.length ; i++) {
            if(timeLine[i][1]) {
                if(timeLeft - currentTimeOffset > timeTotal) {
                    changed.push([i,timeLine[i][1],timeLine[i][0]]);
                    handleTimeLineAsync("change",i);
                } else {
                    completed = true;
                    break;
                }
            }
            timeTotal += timeLine[i][0];
        }
        //if reach end of the list, add current time
        if (!completed) {
            timeTotal += currentTimeInterval;
        }
        countDownTimer();
        //if browser action is open, update values
        sendRequest("timeLine",[cnt,changed]);
        returnTime(timeTotal - timeLeft + currentTimeOffset);
    },delay);
}

//checks all levels and returns the level of url if matched, 0 if none
function matchesURL(url) {
    for (var lvl = 0 ; lvl < urls.length ; lvl++) {
        for (var i = 0 ; i < urls[lvl].length ; i++) {
            if (new RegExp("^" + urls[lvl][i].replace(/\./g,"\\.").replace(/\*/g, ".*") + "$").test(url)){
                return lvl + 1;
            }
        }
    }
    return 0;
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

function resetTime(){
    clearTimeout(returnTimer);
    startTime = new Date();
    timeLeft = startingTimeLeft;
    timeLine = [];
    //set-up first time when opened
    chrome.tabs.getSelected(chrome.windows.WINDOW_ID_CURRENT, function(tab){
        handleNewPage(matchesURL(tab.url),tab.url,tab.title);
    });
    returnTime(timeLineLength - timeLeft);
}

function makeCurrentTabVIP() {
    stopAllAlarms(2);
    VIPtab = tabId;
}

//for displaying in an open browser action
function sendRequest(action,input){
    chrome.runtime.sendMessage({
        from: "background",
        action: action,
        input: input
    });
}


//get requests from browserAction
chrome.runtime.onMessage.addListener(function(a, b, c) {
    if(a.from === "browserAction") {
        switch(a.action) {
            case "VIP":
                makeCurrentTabVIP();
                break;
            case "resetTime":
                resetTime();
                break;
        }
    }
});
