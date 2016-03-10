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
  ["blocking"]);



var alarms = [false,false,false,false,false];
var alarmTimes = [false,false,false,false,false];
var audio = new Audio('alarm.mp3');
var playAlarmCheck = false;
function setAlarm(delay) {
    for (var i = 0 ; i<alarms.length ;i++) {
        if (alarms[i]===false) {
            var alarmTime = new Date();
            alarmTime.setMinutes(alarmTime.getMinutes()+delay);
            alarmTimes[i] = alarmTime;
            var alarm = setTimeout(function(){
                alarms[i] = true;
                playAlarmCheck = true;
                playAlarm();
            },delay*60000);
            alarms[i] = alarm;
            break;
        }
    }
}
function removeAlarm(alarmNumber) {
    if (alarms[alarmNumber]!==false) {
        clearTimeout(alarms[alarmNumber]);
        alarms[alarmNumber] = false;
    }
}

function playAlarm() {
    setInterval(function(){
        if (playAlarmCheck) {
            audio.play();
        }
    },3000);
}

function getTime(date) {
    var hours = date.getHours();
    var suffix = " AM";
    if (hours>=13) {
        hours-=12;
        suffix = " PM";
    } else if (hours===12) {
        suffix = " PM";
    } else if (hours===0) {
        hours = 12;
    }
    var time = hours + ":" + ('0'+date.getMinutes()).slice(-2) + ":" + ('0'+date.getSeconds()).slice(-2) + suffix;
    return time;
}

function stopAlarm() {
    if (playAlarmCheck) {
        for (var i = 0 ; i<alarms.length ; i++) {
            if (alarms[i]===true) {
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
  console.log(a);
  console.log(b);
  console.log(c);
});
