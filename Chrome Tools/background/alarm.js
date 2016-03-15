//set alarm for every half hour after 10pm
//sets alarm when it rings so can't stop before
sleepAlarmStart = 22;   //10pm
sleepAlarmEnd = 6;      //6am
setSleepAlarm();
chrome.alarms.onAlarm.addListener(function(){
  setAlarm(0);
  setSleepAlarm();
});
function setSleepAlarm(){
  date = new Date();
  date.setSeconds(0);
  date.setMinutes(Math.floor(date.getMinutes()/30)*30 + 30);
  if (date.getHours()<sleepAlarmStart && date.getHours()>sleepAlarmEnd) {
    date.setHours(sleepAlarmStart);
  }
  chrome.alarms.create("sleep", {when:+date});
}

//code for alarms
//note chrome.alarms exists
//consider changing to this later
chrome.browserAction.setBadgeBackgroundColor({color:"#0000FF"});        //blue
var alarms = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]; //state, alarm time, alarm object
var alarmCnt = 0;
var audio = new Audio('alarm.mp3');
var playAlarmCheck = [false];   //array so that it is pass by reference
function setAlarm(delay) {
    for (var i = 0 ; i<alarms.length ;i++) {
        if (!alarms[i][0]) {
            var alarmTime = new Date();
            alarmTime.setMinutes(alarmTime.getMinutes()+delay);
            chrome.browserAction.setBadgeText({text:(++alarmCnt).toString()});
            var alarm = setTimeout(function(){
                chrome.browserAction.setBadgeBackgroundColor({color:"#FF0000"});  //red
                alarms[i][0] = 2; 
                playAlarmCheck[0] = true;
                playAlarm();
            },delay*60000);
            alarms[i] = [1,alarmTime,alarm];
            break;
        }
    }
}

function playAlarm() {
    setInterval(function(){
        if (playAlarmCheck[0]) {
            audio.play();
        }
    },3000);
}

function removeAlarm(alarmNumber) {
    if (alarms[alarmNumber][0]) {
        if(--alarmCnt){
          chrome.browserAction.setBadgeText({text:(alarmCnt).toString()});
        } else {
          chrome.browserAction.setBadgeText({text:""});
        }
        clearTimeout(alarms[alarmNumber][2]);
        alarms[alarmNumber][0] = 0;
    }
}


function stopAlarm() {
    if (playAlarmCheck[0]) {
        for (var i = 0 ; i<alarms.length ; i++) {
            if (alarms[i][0]===2) {
                removeAlarm(i);
            }
        }
        playAlarmCheck[0] = false;
        audio.pause();
        audio.currentTime = 0;
        chrome.browserAction.setBadgeBackgroundColor({color:"#0000FF"});        //blue
    }
}

function snooze() {
    if (playAlarmCheck[0]) {
        stopAlarm();
        setAlarm(5);
    }
}


chrome.runtime.onMessage.addListener(function(a, b, c) {
  action = a.action;
  switch(a.action) {
    case "stopAlarm":
      stopAlarm();
      break;
    case "snooze":
      snooze:
      break;
    case "setAlarm":
      setAlarm(a.input);
      break;
    case "removeAlarm":
      removeAlarm(a.input);
      break;
  }
});
