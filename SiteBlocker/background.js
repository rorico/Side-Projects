chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    var now = new Date();
    var position = now.getHours()*100+now.getMinutes()/0.6;
    for (var i = 0 ; i < today.length ; i++) {
      if (today[i][0][1] > position) {
        break;
      } else if (today[i][0][2] > position) {
        return {redirectUrl: chrome.extension.getURL("Schedule.html")};
      }
    }
  },
  {
    urls: [
      "http://reddit.com/*", "https://reddit.com/*", "http://*.reddit.com/*", "https://*.reddit.com/*",
      "http://threesjs.com/"
    ],
    types: ["main_frame"]
  },
  ["blocking"]
);

//set alarm for every half hour after 10pm
//sets alarm when it rings so can't stop before
sleepAlarmStart = 22;
sleepAlarmEnd = 6;
setSleepAlarm();
chrome.alarms.onAlarm.addListener(function(){
  setAlarm(0);
  setSleepAlarm();
});
function setSleepAlarm(){
  date = new Date();
  date.setMinutes(Math.floor(date.getMinutes()/30) + 30);
  if (date.getHours()<sleepAlarmStart && date.getHours()>sleepAlarmEnd) {
    date.setHours(sleepAlarmStart);
    date.setMinutes(0);
    date.setSeconds(0);
  }
  chrome.alarms.create("sleep", {when:+date});
}

//code for alarms
//note chrome.alarms exists
//consider changing to this later
var alarms = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]; //state, alarm time, alarm object
var audio = new Audio('alarm.mp3');
var playAlarmCheck = false;
function setAlarm(delay) {
    for (var i = 0 ; i<alarms.length ;i++) {
        if (!alarms[i][0]) {
            var alarmTime = new Date();
            alarmTime.setMinutes(alarmTime.getMinutes()+delay);
            var alarm = setTimeout(function(){
                alarms[i][0] = 2; 
                playAlarmCheck = true;
                playAlarm();
            },delay*60000);
            alarms[i] = [1,alarmTime,alarm];
            break;
        }
    }
}

function playAlarm() {
    setInterval(function(){
        if (playAlarmCheck) {
            audio.play();
        }
    },3000);
}

function removeAlarm(alarmNumber) {
    if (alarms[alarmNumber][0]) {
        clearTimeout(alarms[alarmNumber][2]);
        alarms[alarmNumber][0] = 0;
    }
}


function stopAlarm() {
    if (playAlarmCheck) {
        for (var i = 0 ; i<alarms.length ; i++) {
            if (alarms[i][0]===2) {
                removeAlarm(i);
            }
        }
        playAlarmCheck = false;
        audio.pause();
        audio.currentTime = 0;
    }
}

function snooze() {
    if (playAlarmCheck) {
        stopAlarm();
        setAlarm(5);
    }
}


chrome.runtime.onMessage.addListener(function(a, b, c) {
  action = a.action;
  switch(a.action) {
    case "setTimer":
      break;
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
