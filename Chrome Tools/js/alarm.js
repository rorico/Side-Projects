//set alarm for every half hour after 10pm
//sets alarm when it rings so can't stop before
sleepAlarmStart = 22;   //10pm
sleepAlarmEnd = 6;      //6am
setSleepAlarm();
chrome.alarms.onAlarm.addListener(function(alarm){
    if(alarm.name=='sleep') {
        setAlarm(0,1);
        setSleepAlarm();
    }
});
function setSleepAlarm(){
    date = new Date();
    date.setSeconds(0);
    date.setMinutes(Math.floor(date.getMinutes()/30)*30 + 30);
    if (date.getHours()<sleepAlarmStart && date.getHours()>sleepAlarmEnd) {
        date.setHours(sleepAlarmStart);
        date.setMinutes(0);
    }
    chrome.alarms.create("sleep", {when:+date});
}

//code for alarms
chrome.browserAction.setBadgeBackgroundColor({color:"#0000FF"});        //blue
chrome.browserAction.setBadgeText({text:""});                           //reset text
var alarms = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]; //state, alarm time, alarm object, type
//types : 0 - regular
//        1 - sleep alarm
//        2 - block alert

var alarmCnt = 0;
var ringingCnt = 0;
var audio = new Audio('/alarm.mp3');
var playAlarmCheck = [false];   //array so that it is pass by reference

//returns [alarmNumber, alarm timestamp]
function setAlarm(delay,type) {
    for (var i = 0 ; i<alarms.length ;i++) {
        if (!alarms[i][0]) {
            var alarmTime = new Date();
            alarmTime.setMinutes(alarmTime.getMinutes()+delay);
            chrome.browserAction.setBadgeText({text:(++alarmCnt).toString()});

            var alarm = setTimeout(function(){
                chrome.browserAction.setBadgeBackgroundColor({color:"#FF0000"});  //red
                ringingCnt++;
                alarms[i][0] = 2; 
                playAlarmCheck[0] = true;
                sendRequest("ringing",i);
                var interval = setInterval(function(){
                    if (playAlarmCheck[0]) {
                        audio.play();
                    } else {
                        clearInterval(interval);
                    }
                },3000);
            },delay*60000);

            alarms[i] = [1,alarmTime,alarm,type];
            sendRequest("setAlarm",[i,+alarmTime],type);
            return [i,+alarmTime];
        }
    }
    return [-1,0];
}

//returns true if alarm is removed
function removeAlarm(alarmNumber,type) {
    //unspecified type is a catchall,
    //type 2 needs specific call
    if (alarms[alarmNumber][0] && ((typeof type === 'undefined' && alarms[alarmNumber][3] !== 2) || alarms[alarmNumber][3] == type)) {
        if(--alarmCnt){
          chrome.browserAction.setBadgeText({text:(alarmCnt).toString()});
        } else {
          chrome.browserAction.setBadgeText({text:""});
        }
        //check if ringing
        if (playAlarmCheck[0] && alarms[alarmNumber][0]===2 && --ringingCnt === 0) {
            playAlarmCheck[0] = false;
            audio.pause();
            audio.currentTime = 0;
            chrome.browserAction.setBadgeBackgroundColor({color:"#0000FF"});        //blue
        }
        clearTimeout(alarms[alarmNumber][2]);
        alarms[alarmNumber][0] = 0;
        sendRequest("removeAlarm",alarmNumber);
        return true;
    }
    return false;
}

//returns true if any alarms are stopped
function stopAllAlarms(type) {
    var ret = false;
    if (playAlarmCheck[0]) {
        for (var i = 0 ; i<alarms.length ; i++) {
            if (alarms[i][0]===2) {
                ret |= removeAlarm(i,type);
            }
        }
    }
    return ret;
}

function snooze() {
    //if any alarms are stopped, set another in 5 minutes;
    if (stopAllAlarms()) {
        setAlarm(5);
    }
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
            case "stopAllAlarms":
                stopAllAlarms();
                break;
            case "snooze":
                snooze();
                break;
            case "setAlarm":
                setAlarm(a.input);
                break;
            case "removeAlarm":
                removeAlarm(a.input);
                break;
        }
    }
});
