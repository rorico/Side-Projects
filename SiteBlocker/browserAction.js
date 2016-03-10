var test;
var alarms = [false,false,false,false,false];
var audio = new Audio('alarm.mp3');
var playAlarmCheck = false;

chrome.runtime.getBackgroundPage(function (backgroundPage) {
    test = backgroundPage;
    console.log(test);
    alarms = test.alarms;
    alarmTimes = test.alarmTimes;
    for (var i = 0 ; i < alarms.length ; i++) {
        if (alarms[i]) {
            showAlarm(alarmTimes[i],i);
        }
    }
});
function setTimer() {
    var delay = parseInt($('#setTimer').val());
    setAlarm(delay);
}

function setAlarm(delay) {
    
    var current = -1;
    for (var i = 0 ; i<alarms.length ;i++) {
        if (alarms[i]===false) {
            current = i;
            break;
        }
    }
    
    if (current!==-1) {
        var alarmTime = new Date();
        alarmTime.setMinutes(alarmTime.getMinutes()+delay);
        showAlarm(alarmTime,current,delay);
        var alarm = setTimeout(function(){
            alarms[current] = true;
            playAlarmCheck = true;
            playAlarm();
        },delay*60000);
        alarms[current] = alarm;
    }
}

function showAlarm(date,index) {
    var time = getTime(date);
    $('#alarm'+(index+1)).html("Alarm at "+time);
    $('#alarm'+(index+1)).parent().removeClass("notSet");
}

function removeAlarm(alarmNumber) {
    if (alarms[alarmNumber]!==false) {
        clearTimeout(alarms[alarmNumber]);
        alarms[alarmNumber] = false;
        $('#alarm'+(alarmNumber+1)).html("Not Set");
        $('#alarm'+(alarmNumber+1)).parent().addClass("notSet");
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
$(window).keydown(function(e) {
    if (e.keyCode == 38) { //up key
        changeTime(1);
    } else if (e.keyCode == 40) { //down key
        changeTime(-1);
    }
});
function changeTime(change) {
    delay = parseInt($('#setTimer').val());
    if (change>0 || delay>0) {
        $('#setTimer').val(delay+change);
    }
}
var deletes = false;
var deleteCheck = [false,false,false,false,false,false];
$(window).keypress(function(e) {
    switch (e.keyCode) {
        case 110:        //n
            setToday();
            break;
        case 109:        //m
            weekView();
            break;
        case 44:        //,
            prev();
            break;
        case 46:        //.
            next();
            break;
        case 115:        //s
            setTimer();
            break;
        case 100:        //d
            deletes = true;
            break;
        case 97:        //a
            stopAlarm();
            break;
        case 120:        //x
            snooze();
            break;
        case 113:        //q
            setAlarm(5);
            break;
        case 119:        //w
            setAlarm(15);
            break;
        case 101:        //e
            setAlarm(30);
            break;
        case 114:        //r
            setAlarm(60);
            break;
        case 49:        //1
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:        //6
            i = e.keyCode-49;
            if (deletes && !deleteCheck[i]) {
                deleteCheck[i] = true;
                removeAlarm(i);
                break;
            }
        case 56:
        case 57:
        case 58:
        case 48://0
            changeTimer(e.keyCode-48);
            break;
        case 96:        //keypad 0
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:        //6
            i = e.keyCode-49;
            if (deletes && !deleteCheck[i]) {
                deleteCheck[i] = true;
                removeAlarm(i);
                break;
            }
        case 103:
        case 104:
        case 105:
            changeTimer(e.keyCode-96);
            break;
        
    }
});
$(window).keyup(function(e) {
    if(e.keyCode>=49 && e.keyCode<=55){
        deleteCheck[e.keyCode-49] = false;
    } else if (e.keyCode===68) {
        deletes = false;
    }
});
time = new Date();
currentTimer = "";
function changeTimer(digit) {
    now = new Date();
    if (now.getTime()-time.getTime()<1000) {
        currentTimer += digit.toFixed(0);
        $('#setTimer').val(currentTimer);
    } else {
        currentTimer = digit;
        $('#setTimer').val(currentTimer);
    }
    time = new Date();
}