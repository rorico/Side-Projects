//get requests from browserAction
chrome.runtime.onMessage.addListener(function(a, b, c) {
    if (a.from === "browserAction") {
        switch(a.action) {
            //from siteBlocker.js
            case "VIP":
                VIP();
                break;
            case "resetTime":
                resetTime();
                break;
            case "change":
                change(a.input);
                break;
            case "temp":
                tempVIP();
                break;

            //from alarm.js
            case "stopAllAlarms":
                stopAllAlarms();
                break;
            case "snooze":
                snooze();
                break;
            case "setAlarm":
                setAlarm(a.input,0);
                break;
            case "removeAlarm":
                removeAlarm(a.input);
                break;

            //from log.js
            case "removeLog":
                removeLog(a.input);
                break;
        }
    } else if (a.from === "options") {
        switch(a.action) {
            //from scheduleInfo.js
            case "resetSchedule":
                setScheduleInfo();
                break;
        }
    } else if (a.from === "content") {
        switch(a.action) {
            //from scheduleInfo.js
            case "weekSchedule":
                c(weekSchedule(a.input));
                break;
        }
    }
});

//for displaying in an open browser action
function sendRequest(action,input,content) {
    var data = {
        from: "background",
        action: action,
        input: input
    }

    chrome.runtime.sendMessage(data);
    //if send to content scripts
    if (content) {
        sendContent(data);
    }
}