var alarms;
var playAlarmCheck;

chrome.runtime.getBackgroundPage(function (backgroundPage) {
    var background = backgroundPage;
    alarms = background.alarms;
    playAlarmCheck = background.playAlarmCheck;
    for (var i = 0 ; i < alarms.length ; i++) {
        if (alarms[i][0] == 1) {
            showAlarm(alarms[i][1],i);
        } else if (alarms[i][0] == 2) {
            showAlarm(alarms[i][1],i);
        }
    }
});

function setTimer() {
    var delay = +$('#setTimer').val();
    setAlarm(delay);
}

function setAlarm(delay) {
    for (var i = 0 ; i<alarms.length ;i++) {
        if (!alarms[i][0]) {
            var alarmTime = new Date();
            alarmTime.setMinutes(alarmTime.getMinutes()+delay);
            showAlarm(alarmTime,i);
            break;
        }
    }
    sendRequest("setAlarm",delay);
}

function showAlarm(date,index) {
    var time = date.toLocaleTimeString()
    $('#alarm'+(index+1)).html("Alarm at "+time);
    $('#alarm'+(index+1)).parent().removeClass("notSet");
}

function removeAlarm(alarmNumber) {
    if (alarms[alarmNumber][0]) {
        $('#alarm'+(alarmNumber+1)).html("Not Set");
        $('#alarm'+(alarmNumber+1)).parent().addClass("notSet");
    }
    sendRequest("removeAlarm",alarmNumber);
}

function stopAlarm() {
    if (playAlarmCheck[0]) {
        for (var i = 0 ; i<alarms.length ; i++) {
            if (alarms[i][0]===2) {
                removeAlarm(i);
            }
        }
    }
    sendRequest("stopAlarm");
}

function changeTime(change) {
    delay = parseInt($('#setTimer').val());
    if (change>0 || delay>0) {
        $('#setTimer').val(delay+change);
    }
}

function snooze() {
    if (playAlarmCheck[0]) {
        stopAlarm();
        setAlarm(5);
    }
    sendRequest("snooze");
}

time = new Date();
currentTimer = "";
function changeTimer(digit) {
    now = new Date();
    if (now-time<1000) {
        currentTimer += digit.toFixed(0);
        $('#setTimer').val(currentTimer);
    } else {
        currentTimer = digit;
        $('#setTimer').val(currentTimer);
    }
    time = new Date();
}

var deletes = false;
$(window).keydown(function(e) {
    switch (e.keyCode) {
        case 83:        //s
            setAlarm(+$('#setTimer').val());
            break;
        case 68:        //d
            deletes = true;
            break;
        case 65:        //a
            stopAlarm();
            break;
        case 88:        //x
            snooze();
            break;
        case 81:        //q
            setAlarm(5);
            break;
        case 87:        //w
            setAlarm(15);
            break;
        case 69:        //e
            setAlarm(30);
            break;
        case 82:        //r
            setAlarm(60);
            break;
        case 48:        //0
        case 49:        //1
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:        //5
            if (deletes) {
                i = e.keyCode-49;
                removeAlarm(i);
                break;
            }
        case 55:        //6
        case 56:
        case 57:
        case 58:
            changeTimer(e.keyCode-48);
            break;
        case 96:        //keypad 0
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:       //5
            if (deletes) {
                i = e.keyCode-49;
                removeAlarm(i);
                break;
            }
        case 102:        //6
        case 103:
        case 104:
        case 105:
            changeTimer(e.keyCode-96);
            break;

        case 38:        //up key
            changeTime(1);
            break;
        case 40:        //down key
            changeTime(-1);
            break;
    }
}).keyup(function(e) {
    switch (e.keyCode) {
        case 68:        //d
            deletes = false;
            break;
    }
});

function sendRequest(action,input){
    chrome.runtime.sendMessage({
        action: action,
        input: input
    });
}