var startTime = new Date();
var wastingTime = false;
var url = "";
var title = "";
var tabId = -2;
var timeLineLength = 1800000; // 30 mins
var startingTimeLeft = 300000; // 5 mins
var VIPlength = 20000; // 20s
var tolerance = 2000; // 2s
if (0) { // if in testing mode
    timeLineLength = 120000; // 2 mins
    startingTimeLeft = 60000; // 1 mins
}
var timeLeft = startingTimeLeft;
var timeLine = [];
var timeLineAsync = true;
var alarm = -1;
var returnTimer;
var displayTimer = -1;
var displayTimeStarter = -1;
var VIPtab = -1;
var tempVIPtimer = -1;
var tempVIPstartTime = 0;
var blockedTab = -2;
var classes = [];
var classStart = Infinity;
//sites that will block after time spent
var urls = [[
    "*://reddit.com/*","*://*.reddit.com/*",
    "http://threesjs.com/"
],
//sites that will spend time but not actively block
[
    "*://*.youtube.com/*",
    "*://imgur.com/*","*://*.imgur.com/*"
]];

//set-up first time when opened
startTimeLine();

function setupClass() {
    var now = new Date();
    var position = UTCtoMilitary(now);
    for (var i = 0 ; i < today.length ; i++) {
        if (position < today[i][0][2]) {
            classes.push([today[i][0][1],today[i][0][2]]);
        }
    }
    if (classes.length) {
        classStart = militaryToUTC(classes[0][0]);
        classReminder(classStart - now - startingTimeLeft);
    }
}

//for before class, show how much time left
function classReminder(delay) {
    if (classes.length) {
        setTimer(function(){
            var time = classStart - new Date() - timeLeft;
            //if timing is off
            if (time > 0) {
                classReminder(time);
            } else {
                var keepGoing = true;
                var now = new Date();
                var position = UTCtoMilitary(now);
                if (position > classes[0][1]) {
                    classes.splice(0,1);
                    if (classes.length) {
                        classStart = militaryToUTC(classes[0][0]);
                        time = classStart - now - startingTimeLeft;
                    } else {
                        //could go to next day, for now, don't do that
                        classStart = Infinity;
                        keepGoing = false;
                    }
                } else {
                    time = militaryToUTC(classes[0][1]) - now;
                }
                badgeDisplay();
                if (keepGoing) {
                    classReminder(time);
                }
            }
        },delay);
    }
}

//probably not actually military time, but similar
function militaryToUTC(time){
    var ret = new Date();
    var hour = Math.floor(time/100);
    var minutes = (time % 100) * 0.6;
    ret.setHours(hour);
    ret.setMinutes(minutes);
    ret.setSeconds(0);
    ret.setMilliseconds(0);
    return ret;
}

function UTCtoMilitary(time){
    return time.getHours()*100 + time.getMinutes()/0.6;;
}

function inClass() {
    return new Date() > classStart;
}

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
            throw("can't store the following, too large:");
            log(newEntry);
        } else if (JSON.stringify(redirects).length + JSON.stringify(newEntry).length > limit) {
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
        throw("didn't think this situation would ever happen, good thing I coded this");
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
            if (timeLine[load][1]) {
                timeLine[load][1] = 0;
                changeTimeLeft(timeLine[load][0]);   
            }
        } else {
            throw("change to timeline out of bounds" + load + "/" + timeLine.length);
        }
    } else {
        throw("timeLine action incorrect");
    }
    timeLineAsync = true;
}

function handleNewPage(newWasting,newUrl,newTitle) {
    //handle previous page
    unblockSite();
    var timeSpent = new Date() - startTime;
    //if small time spent on wasting, don't count
    if (timeSpent < tolerance) {
        wastingTime = 0;
    }
    handleTimeLineAsync("add",[timeSpent,wastingTime,url,title,startTime]);
    if (wastingTime) {
        changeTimeLeft(-timeSpent);
    }
    //handle new page
    startTime = new Date();
    wastingTime = newWasting;
    url = newUrl;
    title = newTitle;
    badgeDisplay();
}

function changeTimeLeft(change) {
    timeLeft += change;
    //remember to call badgeDisplay(); at end of processing 
}

//shows effective timeLeft from this moment on
function badgeDisplay() {
    //have the option to update browserAction every time, but accuracy isn't completely needed
    sendRequest("timer",timeLeft);
    var time = timeLeft - (wastingTime ? new Date() - startTime : 0);
    var countDown = wastingTime;

    if (VIPtab === tabId && !tempVIPstartTime) {
        //if tempVIPstartTime is not set, VIP isn't temp
        time = Infinity;
        countDown = false;
        //infinity symbol
        //chrome.browserAction.setBadgeText({text:"\u221e"});
    } else if (time > classStart - new Date()) {
        time = classStart - new Date();
        countDown = true;
    }

    //don't even bother if more time left than limit
    var VIPtimeLeft = VIPlength - new Date() + tempVIPstartTime;
    if (VIPtab === tabId && time < VIPtimeLeft) {
        time = VIPtimeLeft;
        countDown = true;
        //when this turns to 0, will not show actual time left, may want to fix this later
    }
    countDownTimer(time,countDown);
    if (countDown && wastingTime === 1) {
        setReminder(time,tabId);
    }
}

function countDownTimer(time,countDown) {
    clearTimeout(displayTimeStarter);
    clearInterval(displayTimer);
    if (time < 0) {
        time = 0;
    }
    setBadgeText(time);
    if (countDown && time > 0) {
        var delay = (time-1)%1000 + 1;
        displayTimeStarter = setTimeout(function() {
            time -= delay;
            if (countDown && time >= 0) {
                setBadgeText(time);
                displayTimer = setInterval(function() {
                    time -= 1000;
                    if (countDown && time >= 0) {
                        setBadgeText(time);
                    } else {
                        clearInterval(displayTimer);
                    }
                },1000);
            }
        },delay);
    }
}

function setBadgeText(time) {
    chrome.browserAction.setBadgeText({text:MinutesSecondsFormat(time)});
}

function MinutesSecondsFormat(milli) {
    if (milli === Infinity) {
        return "\u221e";
    } else {
        var secs = Math.ceil(milli/1000);
        return Math.floor(secs/60)  + ":" + ("0" + Math.floor(secs%60)).slice(-2);
    }
}

function returnTime(delay) {
    returnTimer = setTimer(function() {
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
        badgeDisplay();
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

function setReminder(time,tabId) {
    clearTimeout(alarm);
    if (time < tolerance) {
        time = tolerance;
    }
    alarm = setTimeout(function() {
        blockSite(tabId);
    },time);
}

function blockSite(tabId) {
    //setAlarm(0,2);
    //use a wrapper in case tabId gets changed in the meantime, may not be needed
    if (this.tabId === tabId) {
        chrome.tabs.executeScript({file:"/lib/jquery.min.js"},function(){
            chrome.tabs.executeScript({file:"/js/content.js"},function(){
                blockedTab = tabId;
            });
        });
    }
}

function unblockSite() {
    if (blockedTab !== -2) {
        //stopAllAlarms(2);
        chrome.tabs.sendMessage(blockedTab,{action:"unblock"});
        blockedTab = -2;
    }
}

function clearAlarm() {
    clearTimeout(alarm);
    unblockSite();
}

function resetTime() {
    clearTimer(returnTimer);
    startTime = new Date();
    timeLeft = startingTimeLeft;
    timeLine = [];
    startTimeLine();
    sendRequest("reset");
}

function makeCurrentTabVIP() {
    clearTimeout(tempVIPtimer);
    VIPtab = tabId;
    clearAlarm();
}

function VIP() {
    makeCurrentTabVIP();
    tempVIPstartTime = 0;
    badgeDisplay();
}

function tempVIP() {
    makeCurrentTabVIP();
    tempVIPstartTime = +new Date();
    tempVIPtimer = setTimeout(function(){
        VIPtab = -1;
        tempVIPstartTime = 0;
    },VIPlength);
    badgeDisplay();
}

function change(timeLineIndex) {
    handleTimeLineAsync("change",timeLineIndex);
    if (timeLeft >= 0) {
        //clear incase
        clearAlarm();
    }
    clearTimer(returnTimer);
    returnTime();
    badgeDisplay();
}

//for displaying in an open browser action
function sendRequest(action,input) {
    chrome.runtime.sendMessage({
        from: "background",
        action: action,
        input: input
    });
}
