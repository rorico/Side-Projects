var startTime = new Date();
var wastingTime = false;
var url = "";
var title = "";
var tabId = -2;
var windowId = -3;
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

//gets run when schedule gets loaded in ScheduleInfo.js
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
                timeLeftOutput();
                if (keepGoing) {
                    classReminder(time);
                }
            }
        },delay);
    }
}

//probably not actually military time, but similar
function militaryToUTC(time) {
    var ret = new Date();
    var hour = Math.floor(time/100);
    var minutes = (time % 100) * 0.6;
    ret.setHours(hour);
    ret.setMinutes(minutes);
    ret.setSeconds(0);
    ret.setMilliseconds(0);
    return ret;
}

function UTCtoMilitary(time) {
    return time.getHours()*100 + time.getMinutes()/0.6;;
}

function inClass() {
    return new Date() > classStart;
}

function startTimeLine() {
    chrome.tabs.getSelected(chrome.windows.WINDOW_ID_CURRENT, function(tab) {
        handleNewPage(tab.url,tab.title);
    });
    returnTime(timeLineLength - timeLeft);
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    this.tabId = activeInfo.tabId;
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        handleNewPage(tab.url,tab.title);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo && changeInfo.status === "loading" && tabId == this.tabId) {
        handleNewPage(tab.url,tab.title);
    } else if (changeInfo && changeInfo.title && tabId == this.tabId) {
        title = changeInfo.title;
    }
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
    //due to browserAction triggering this, gonna have to workaround it
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        //handleNewPage("","Outside Chrome");
    } else {
        if (windowId !== this.windowId) {
            chrome.tabs.query({windowId:windowId,active:true}, function(tabs) {
                if (tabs.length) {
                    var activeTab = tabs[0];
                    handleNewPage(activeTab.url,activeTab.title);
                    tabId = activeTab.tabId;
                } else {
                    throw("window empty tab")
                }
            });
        }
        this.windowId = windowId;
    }
});

function handleNewPage(newUrl,newTitle) {
    //handle previous page
    unblockSite();
    var newWasting = matchesURL(newUrl);
    var timeSpent = new Date() - startTime;
    //if small time spent on wasting, don't count
    if (timeSpent < tolerance) {
        wastingTime = 0;
    }
    modifyTimeLine("add",[timeSpent,wastingTime,url,title,startTime]);
    if (wastingTime) {
        changeTimeLeft(-timeSpent);
    }
    //handle new page
    startTime = new Date();
    wastingTime = newWasting;
    url = newUrl;
    title = newTitle;
    timeLeftOutput();
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

//timeLine acts as an object
function modifyTimeLine(action,load) {
    if (action === "add") {
        timeLine.unshift(load);
    } else if (action === "remove") {
        timeLine.splice(load[0],load[1]);
    } else if (action === "change") {
        if (load < timeLine.length || load < 0) {
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
}

function changeTimeLeft(change) {
    timeLeft += change;
    //could run timeLeftOutput() here, but if this function gets called multiple times, a lot of calculations are wasted
    //instead, remember to call timeLeftOutput(); at end of processing
}

//shows effective timeLeft from this moment on
var timeLeftOutput = (function(){
    function timeLeftOutput() {
        //have the option to update browserAction every time, but accuracy isn't completely needed
        sendRequest("timer",timeLeft);
        var time = timeLeft - (wastingTime ? new Date() - startTime : 0);
        var countDown = wastingTime;

        if (VIPtab === tabId && !tempVIPstartTime) {
            //if tempVIPstartTime is not set, VIP isn't temp
            time = Infinity;
            countDown = false;
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
        setReminder(time,countDown);
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
        function MinutesSecondsFormat(milli) {
            if (milli === Infinity) {
                //infinity symbol
                return "\u221e";
            } else {
                var secs = Math.ceil(milli/1000);
                return Math.floor(secs/60)  + ":" + ("0" + Math.floor(secs%60)).slice(-2);
            }
        }
    }

    //sets a reminder when timeLeft reaches 0, and blocks site
    function setReminder(time,countDown) {
        clearTimeout(alarm);
        unblockSite();
        if (countDown && wastingTime === 1) {
            if (time < tolerance) {
                time = tolerance;
            }
            alarm = setTimeout(function() {
                blockSite(tabId);
            },time);
        }
    }
    return timeLeftOutput;
})();

var blockSite = (function() {
    function blockSite(tabId) {
        //all changes in tabs should be caught, but in case, check
        if (this.tabId === tabId) {
            //use a wrapper in case tabId gets changed in the meantime, may not be needed
            var thisUrl = url;
            chrome.tabs.executeScript(tabId,{file:"/lib/jquery.min.js"},function(){
                chrome.tabs.executeScript(tabId,{file:"/js/content.js"},function(){
                    blockedTab = tabId;
                    storeRedirect(thisUrl);
                });
            });
        } else {
            throw("uncaught change in tabId");
        }
    }

    function storeRedirect(url) {
        chrome.storage.sync.get("redirects", function(items) {
            var redirects = items.redirects;
            if (!redirects) {
                redirects = [];
            }
            var newEntry = [+new Date(),url];
            //approximately the max size per item, slightly smaller
            //for some reason the limit is around 7700 instead of 8192, be much lower to be sure
            //can check getBytesInUse, but seems unnecessary
            var limit = 7000;
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
    return blockSite;
})();

function unblockSite() {
    if (blockedTab !== -2) {
        chrome.tabs.sendMessage(blockedTab,{action:"unblock"});
        blockedTab = -2;
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
            modifyTimeLine("remove",[endingIndex,cnt]);
        }
        //return time and calculate when to call function again
        //ideally check again when can return time again
        var changed = [];
        var completed = false;
        for (var i = timeLine.length - 1 ; i != -1 ; i--) {
            if (timeLine[i][1]) {
                if (timeLeft - currentTimeOffset > timeTotal) {
                    changed.push([i,timeLine[i][1],timeLine[i][0]]);
                    modifyTimeLine("change",i);
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
        timeLeftOutput();
        returnTime(timeTotal - timeLeft + currentTimeOffset);
    },delay);
}

///////////// Requests from outside ///////////
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
}

function VIP() {
    makeCurrentTabVIP();
    tempVIPstartTime = 0;
    timeLeftOutput();
}

function tempVIP() {
    makeCurrentTabVIP();
    tempVIPstartTime = +new Date();
    tempVIPtimer = setTimeout(function(){
        VIPtab = -1;
        tempVIPstartTime = 0;
    },VIPlength);
    timeLeftOutput();
}

function change(timeLineIndex) {
    if (timeLineIndex === -1) {
        //change the current one and restart counter
        wastingTime = 0;
        handleNewPage(url,title);
        //to browserAction, assume only way to get newPage while its open
        sendRequest("newPage");
    } else {
        modifyTimeLine("change",timeLineIndex);
    }
    clearTimer(returnTimer);
    returnTime();
    timeLeftOutput();
}
///////////////////////////////////////////////

//for displaying in an open browser action
function sendRequest(action,input) {
    chrome.runtime.sendMessage({
        from: "background",
        action: action,
        input: input
    });
}
