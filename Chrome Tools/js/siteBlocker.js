var startTime = new Date();
var wastingTime = false;
var url = "";
var title = "";
var tabId = -1;
var timeLineLength = 1800000; // 30 mins
var startingTimeLeft = 300000; // 5 mins
if (0) { // if in testing mode
    timeLineLength = 120000; // 2 mins
    startingTimeLeft = 60000; // 1 mins
}
var timeLeft = startingTimeLeft;
var alarm;
var timeLine = [];
var timeLineAsync = true;
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

//set-up first time when opened
startTimeLine();

chrome.webRequest.onBeforeRequest.addListener(function(info) {
    if (info.tabId != VIPtab) {
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
        if (timeLeft <= currentTimeOffset) {
            return redirect(info);
        }
    }
    function redirect(info) {
        //so it runs in parallel/doesn't wait
        setTimeout(function(){
            storeRedirect(info.url);
        },0);
        return {redirectUrl: chrome.extension.getURL("/html/schedule.html")};
    }
},
{
    urls: urls[0],
    types: ["main_frame"]
},
    ["blocking"]
);

function storeRedirect(url) {
    chrome.storage.sync.get("redirects", function(items) {
        var redirects = items.redirects;
        if (!redirects) {
            redirects = [];
        }
        var newEntry = [+new Date(),url];
        //approximately the max size per item, slightly smaller
        var limit = 8000;
        //if the new entry is larger than it can possibly be stored, shouldn't ever happen
        //to make sure we don't get into an infinite loop
        if (JSON.stringify(newEntry).length > limit) {
            console.log("can't store the following, too large:");
            console.log(newEntry);
        } else if (JSON.stringify(redirects).length + JSON.stringify(newEntry).length > 7300) {
            moveRedirect(redirects,url);
        } else {
            redirects.push(newEntry);
            chrome.storage.sync.set({"redirects": redirects});
        }
    });
}

function moveRedirect(redirects,url) {
    chrome.storage.sync.get("redirectIndexes", function(items) {
        var redirectIndexes = items.redirectIndexes;
        if (!redirectIndexes) {
            redirectIndexes = [];
        }
        var redirectName = "redirect_" + redirectIndexes.length;
        redirectIndexes.push(redirectName);
        var setObj = {redirectIndexes:redirectIndexes,redirects:[]};
        setObj[redirectName] = redirects;
        chrome.storage.sync.set(setObj);
        storeRedirect(url);
    });
}

function startTimeLine() {
    chrome.tabs.getSelected(chrome.windows.WINDOW_ID_CURRENT, function(tab) {
        handleNewPage(matchesURL(tab.url),tab.url,tab.title);
    });
    returnTime(timeLineLength - timeLeft);
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    this.tabId = activeInfo.tabId;
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        handleNewPage(matchesURL(tab.url),tab.url,tab.title);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo && changeInfo.status === "loading" && tabId == this.tabId) {
        handleNewPage(matchesURL(tab.url),tab.url,tab.title);
    } else if (changeInfo && changeInfo.title && tabId == this.tabId) {
        title = changeInfo.title;
    }
});


/* does not measure when switching to outside chrome
var focused = true;
var out = [0,0,0];
chrome.windows.onFocusChanged.addListener(function(windowId) {
    chrome.tabs.query({windowId:chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
        handleFocus(!!tabs.length);
    });
});

function handleFocus(newFocused) {
    if (newFocused != focused) {
        if (newFocused) {
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
    if (action === "add") {
        timeLine.unshift(load);
    } else if (action === "remove") {
        timeLine.splice(load[0],load[1]);
    } else if (action === "change") {
        if (load === -1) {
            sendRequest("change",[load,wastingTime]);
            wastingTime = 0;
        } else if (load < timeLine.length) {
            sendRequest("change",[load,timeLine[load][1]]);
            timeLine[load][1] = 0;
            changeTimeLeft(timeLine[load][0]);
        } else {
            console.log("change to timeline out of bounds" + load + "/" + timeLine.length);
        }
    } else {
        console.log("this shouldn't happen");
    }
    timeLineAsync = true;
}

function handleNewPage(newWasting,newUrl,newTitle) {
    stopAllAlarms(2);
    var timeSpent = new Date() - startTime; 
    handleTimeLineAsync("add",[timeSpent,wastingTime,url,title,startTime]);
    if (wastingTime) {
        changeTimeLeft(-timeSpent);
        if (wastingTime === 1) {
            clearTimeout(alarm);
        }
    }
    startTime = new Date();
    wastingTime = newWasting;
    url = newUrl;
    title = newTitle;
    if (newWasting) {
        if (newWasting === 1 && tabId !== VIPtab) {
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
    //have the option to update browserAction every time, but accuracy isn't completely needed
    sendRequest("timer",timeLeft);
    var currentTimeOffset = (wastingTime ? new Date() - startTime : 0);
    var curTimeLeft = timeLeft - currentTimeOffset; //don't want to touch timeLeft variable
    if (curTimeLeft < 0) {
        curTimeLeft = 0;
    }
    chrome.browserAction.setBadgeText({text:MinutesSecondsFormat(curTimeLeft)});
    if (wastingTime && curTimeLeft > 0) {
        var delay = (curTimeLeft-1)%1000+1;
        displayTimeStarter = setTimeout(function() {
            curTimeLeft -= delay;
            if (wastingTime && curTimeLeft >= 0) {
                chrome.browserAction.setBadgeText({text:MinutesSecondsFormat(curTimeLeft)});
                displayTimer = setInterval(function() {
                    curTimeLeft -= 1000;
                    if (wastingTime && curTimeLeft >= 0) {
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
    returnTimer = setTimeout(function() {
        var date = new Date() - timeLineLength;
        var endingIndex = 0;
        var cnt = 0;
        var timeTotal = 0;
        var currentTimeInterval = new Date() - startTime;
        var currentTimeOffset = (wastingTime ? currentTimeInterval : 0);
        //remove anything after limit
        for (var i = timeLine.length - 1 ; i != -1 ; i--) {
            //endtime is same as next starttime
            var endTime = (i ? timeLine[i-1][4] : +timeLine[i][4] + timeLine[i][0]);
            if (date > endTime) {
                if (timeLine[i][1]) {
                    timeLeft += timeLine[i][0];
                }
                cnt++;
            } else {
                timeTotal = timeLine[i][4] - date; //negative
                endingIndex = i + 1;
                break;
            }
        }
        if (cnt) {
            handleTimeLineAsync("remove",[endingIndex,cnt]);
        }
        //return time and calculate when to call function again
        //ideally check again when can return time again
        var changed = [];
        var completed = false;
        for (var i = timeLine.length - 1 ; i != -1 ; i--) {
            if (timeLine[i][1]) {
                if (timeLeft - currentTimeOffset > timeTotal) {
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
        returnTime(timeTotal - timeLeft + currentTimeOffset);
    },delay);
}

//checks all levels and returns the level of url if matched, 0 if none
function matchesURL(url) {
    for (var lvl = 0 ; lvl < urls.length ; lvl++) {
        for (var i = 0 ; i < urls[lvl].length ; i++) {
            if (new RegExp("^" + urls[lvl][i].replace(/\./g,"\\.").replace(/\*/g, ".*") + "$").test(url)) {
                return lvl + 1;
            }
        }
    }
    return 0;
}

function setReminder(time) {
    clearTimeout(alarm);
    var timeLeftP = timeLeft;
    if (timeLeft <= 0) {
        time = 2000;
    }
    alarm = setTimeout(function() { 
        if (timeLeft === timeLeftP) {
            setAlarm(0,2);
        } else {
            setReminder(timeLeftP - timeLeft);
        }
    },time);
}

function clearAlarm() {
    clearTimeout(alarm);
    stopAllAlarms(2);
}

function resetTime() {
    clearTimeout(returnTimer);
    startTime = new Date();
    timeLeft = startingTimeLeft;
    timeLine = [];
    startTimeLine();
    sendRequest("reset");
}

function makeCurrentTabVIP() {
    VIPtab = tabId;
    clearAlarm();
}

function change(timeLineIndex) {
    handleTimeLineAsync("change",timeLineIndex);
    if (timeLeft >= 0) {
        //clear incase
        clearAlarm();
    }
    clearTimeout(returnTimer);
    returnTime();
    countDownTimer();
}

//for displaying in an open browser action
function sendRequest(action,input) {
    chrome.runtime.sendMessage({
        from: "background",
        action: action,
        input: input
    });
}
