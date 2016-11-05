//[state, alarm time, alarm object, type]
var alarms = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]; 
//types : 0 - regular
//        1 - sleep alarm
//        2 - block alert

var typeColors = ["#0000FF","#33FFFF","#FF0000"];   //["blue","teal","red"];
var defaultColor = "#000000";   //black
var alarmCnt = 0;
var ringingCnt = 0;
var alarmTypeCnt = [0,0,0];
var alarmTypeMax = -1;
var audio = new Audio("/alarm.mp3");
audio.loop = true;
var audioLength = audio.duration;
var playAlarmCheck = false;   //true if any alarm is currently ringing

chrome.browserAction.setBadgeBackgroundColor({color:defaultColor});

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
    setTimer(function() {
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
            alarmCnt++;
            var alarm = setTimer(function() {
                ringAlarm(i,type);
            },delay*60000);


            alarmTypeCnt[type]++;
            //display highest type color
            if (type > alarmTypeMax) {
                chrome.browserAction.setBadgeBackgroundColor({color:typeColors[type]});
                alarmTypeMax = type;
            }
            alarms[i] = [1,alarmTime,alarm,type];
            sendRequest("setAlarm",[i,+alarmTime,type]);
            return [i,+alarmTime];
        }
    }
    return [-1,0];
}

function ringAlarm(alarmNumber,type) {
    ringingCnt++;
    alarms[alarmNumber][0] = 2;
    playAlarmCheck = true;
    sendRequest("ringing",alarmNumber);
    audio.play();
}

//returns true if alarm is removed
function removeAlarm(alarmNumber,type) {
    //unspecified type is a catchall,
    //type 2 needs specific call
    if (alarms[alarmNumber][0] && ((typeof type === "undefined" && alarms[alarmNumber][3] !== 2) || alarms[alarmNumber][3] == type)) {
        alarmTypeCnt[type]--;
        //if no alarms left
        if (!--alarmCnt) {
            alarmTypeMax = -1;
            chrome.browserAction.setBadgeBackgroundColor({color:defaultColor});
        } else {        
            //update highest alarm color
            for (var i = alarmTypeMax ; i >= 0 ; i--) {
                if (alarmTypeCnt[i]) {
                    alarmTypeMax = i;
                    chrome.browserAction.setBadgeBackgroundColor({color:typeColors[i]});
                    break;
                }
            }
        }
        //check if ringing
        if (playAlarmCheck && alarms[alarmNumber][0]===2) {
            //if no alarms ringing, turn off sound
            if (!--ringingCnt) {
                playAlarmCheck = false;
                audio.pause();
                audio.currentTime = 0;
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
    if (playAlarmCheck) {
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