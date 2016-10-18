//[state, alarm time, alarm object, type]
var alarms = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]; 
//types : 0 - regular
//        1 - sleep alarm
//        2 - block alert

var typeColors = ["#0000FF","#33FFFF","#FF0000"];   //["blue","teal","red"];
var defaultColor = "#000000";   //black
var alarmCnt = 0;
var ringingCnt = 0;
var ringingTypeCnt = [0,0,0];
var ringingTypeMax = -1;
var audio = new Audio("/alarm.mp3");
var playAlarmCheck = [false];   //array so that it is pass by reference

chrome.browserAction.setBadgeBackgroundColor({color:defaultColor});
chrome.browserAction.setBadgeText({text:""});                           //reset text

//set alarm for every half hour after 10pm
//sets alarm when it rings so can't stop before
var sleepAlarmStart = 22;   //10pm
var sleepAlarmEnd = 6;      //6am
setSleepAlarm();

function setSleepAlarm() {
    var date = new Date();
    date.setSeconds(0);
    date.setMinutes(Math.floor(date.getMinutes()/30)*30 + 30);
    if (date.getHours()<sleepAlarmStart && date.getHours()>sleepAlarmEnd) {
        date.setHours(sleepAlarmStart);
        date.setMinutes(0);
    }
    setTimer(function(){
        setAlarm(0,1);
        setSleepAlarm();
    },date - new Date());
}

//returns [alarmNumber, alarm timestamp]
function setAlarm(delay,type) {
    for (var i = 0 ; i<alarms.length ;i++) {
        if (!alarms[i][0]) {
            var alarmTime = new Date();
            alarmTime.setMinutes(alarmTime.getMinutes()+delay);
            ++alarmCnt;
            //chrome.browserAction.setBadgeText({text:(++alarmCnt).toString()});
            var alarm = setTimer(function() {
                ringAlarm(i,type);
            },delay*60000);

            alarms[i] = [1,alarmTime,alarm,type];
            sendRequest("setAlarm",[i,+alarmTime,type]);
            return [i,+alarmTime];
        }
    }
    return [-1,0];
}

function ringAlarm(alarmNumber,type) {
    if (type > ringingTypeMax) {
        chrome.browserAction.setBadgeBackgroundColor({color:typeColors[type]});
        ringingTypeMax = type;
    }
    ringingTypeCnt[type]++;
    ringingCnt++;
    alarms[alarmNumber][0] = 2;
    playAlarmCheck[0] = true;
    sendRequest("ringing",alarmNumber);
    var interval = setInterval(function() {
        if (playAlarmCheck[0]) {
            audio.play();
        } else {
            clearInterval(interval);
        }
    },3000);
}

//returns true if alarm is removed
function removeAlarm(alarmNumber,type) {
    //unspecified type is a catchall,
    //type 2 needs specific call
    if (alarms[alarmNumber][0] && ((typeof type === "undefined" && alarms[alarmNumber][3] !== 2) || alarms[alarmNumber][3] == type)) {
        if (--alarmCnt) {
          //chrome.browserAction.setBadgeText({text:(alarmCnt).toString()});
        } else {
          //chrome.browserAction.setBadgeText({text:""});
        }
        //check if ringing
        if (playAlarmCheck[0] && alarms[alarmNumber][0]===2) {
            ringingTypeCnt[type]--;
            if (--ringingCnt === 0) {
                ringingTypeMax = -1;
                playAlarmCheck[0] = false;
                audio.pause();
                audio.currentTime = 0;
                chrome.browserAction.setBadgeBackgroundColor({color:defaultColor});
            } else {
                for (var i = ringingTypeMax ; i >= 0 ; i--) {
                    if (ringingTypeCnt[i]) {
                        ringingTypeMax = i;
                        chrome.browserAction.setBadgeBackgroundColor({color:typeColors[i]});
                        break;
                    }
                }
            }
        }
        clearTimer(alarms[alarmNumber][2]);
        alarms[alarmNumber][0] = 0;
        sendRequest("removeAlarm",[alarmNumber,alarms[alarmNumber][3]]);
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
        setAlarm(5,0);
    }
}

//for displaying in an open browser action
function sendRequest(action,input) {
    chrome.runtime.sendMessage({
        from: "background",
        action: action,
        input: input
    });
}