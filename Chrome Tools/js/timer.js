//wrapper for the setTimeout, especially for long delays
//setTimeout doesn't seem to work when computer sleeps, or if the computer is slow,
//chrome.alarms doesn't seem to have these problems

var timeoutThreshold = 300000; // 5 minutes
var timeoutQueue = [];
var curTimeoutId = 0;
var timeoutHandlers = [];

setTimer(function(){
    setAlarm(1,0);
},timeoutThreshold);

function setTimer(funct,delay) {
    if (delay < timeoutThreshold) {
        timeoutHandlers[++curTimeoutId] = [0,setTimeout(funct,delay)];
        return curTimeoutId;
    } else {
        var index = 0;
        var runTime = +new Date() + delay;
        for (var i = 0 ; i < timeoutQueue.length ; i++) {
            if (runTime < timeoutQueue[i][1]) {
                break;
            } else {
                index++;
            }
        }
        timeoutQueue.splice(index,0,[++curTimeoutId,runTime,funct]);
        if (!index) {
            //if using alarms for anything else, change clearAll
            chrome.alarms.clearAll();
            chrome.alarms.create("timeout",{when:runTime});
        }
        timeoutHandlers[curTimeoutId] = [1];
        return curTimeoutId;//[1,curTimeoutId];
    }
}

function clearTimer(handler) {
    var thisHandle = timeoutHandlers[handler];
    if (thisHandle) {
        if (thisHandle[0]) {
            //want a better way to do this
            //can use another array, but will likely have more overhead due to low use of this
            var first = false;
            for (var i = 0 ; i < timeoutQueue.length ; i++) {
                if (handler === timeoutQueue[i][0]) {
                    timeoutQueue.splice(i,1);
                    if (i === 0) {
                        chrome.alarms.clearAll();
                        chrome.alarms.create("timeout",{when:timeoutQueue[0][1]});
                    }
                    break;
                }
            }
        } else {
            clearTimeout(thisHandle[1]);
        }
    }
}

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name==="timeout") {
        console.log(timeoutQueue);
        var threshold = +new Date() + timeoutThreshold;
        var cnt = 0;
        for (var i = 0 ; i < timeoutQueue.length ; i++) {
            if (timeoutQueue[i][1] < threshold) {
                timeoutHandlers[timeoutQueue[i][0]] = setTimeout(timeoutQueue[i][2],timeoutQueue[i][1] - new Date());
                cnt++;
            } else {
                break;
            }
        }
        timeoutQueue.splice(0,cnt);
        if (timeoutQueue.length) {
            chrome.alarms.create("timeout",{when:timeoutQueue[0][1]});
        }
        console.log(timeoutQueue);
    }
});