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
    var timeLeft = background.timeLeft;
    var startTime = background.startTime;
    var wastingTime = background.wastingTime;
    var timeCurrent = new Date() - startTime;
    if (wastingTime) {
        timeLeft -= timeCurrent;
        if(timeLeft < 0) {
            timeLeft = 0;
        }
    }
    countDown(timeLeft,wastingTime);

    var timeLine = background.timeLine;
    var parentWidth = $('#timeLine').width();
    var timeLeft = 400;
    var totalTime = timeCurrent/36000;
    var cnt = 0;    //used to set hovers
    if(totalTime < 100) {
        $('#timeLine').prepend('<div style="width:' + totalTime + '%" id="timeLine'+cnt+'" class="timeLine ' + timeType(wastingTime) + '"></div>');
        setHover(cnt,[timeCurrent,wastingTime,"look up you lazy son of a"]);
        for (var i = timeLine.length - 1 ; i != -1 ; i--) {
            var percentage = timeLine[i][0]/36000;
            if(totalTime + percentage>=100) {
                $('#timeLine').prepend('<div style="width:' + (100 - totalTime) + '%" id="timeLine'+cnt+'" class="timeLine ' + timeType(timeLine[i][1]) + '"></div>');
                setHover(cnt,timeLine[i]);
                totalTime = 100;
                break;
            }
            totalTime += percentage;
            $('#timeLine').prepend('<div style="width:' + percentage + '%" id="timeLine'+cnt+'" class="timeLine ' + timeType(timeLine[i][1]) + '"></div>');
            setHover(cnt,timeLine[i]);
        }
        if(totalTime <= 100) {
            $('#timeLine').prepend('<div style="width:' + (100 - totalTime) + '%" id="timeLine'+cnt+'" class="timeLine"></div>');
        }
    } else {
        $('#timeLine').prepend('<div style="width:' + 100 + '%" id="timeLine'+cnt+'" class="timeLine ' + timeType(wastingTime) + '"></div>');
        setHover(cnt,[timeCurrent,wastingTime,"look up you lazy son of a"]);
    }
    updateTimeLine();
    function setHover(num,info) {
        $('#timeLine'+num).hover(function(){
            $('#timeLine').append('<div id="try">URL:' + info[2] + '<br />Time spent:'+MinutesSecondsFormat(info[0])+'</div>');
        },function(){
            $('#try').remove();
        });
        cnt++;
    }
});
function countDown(time,on) {
    $('#test').html(MinutesSecondsFormat(time));
    if(on && time>0) {
        delay = (time-1)%1000+1;
        setTimeout(function(){
            countDown(time - delay,on);
        },delay);
    }
}

function updateTimeLine() {
    setInterval(function(){
        var parentWidth = $('#timeLine').width();
        var width = 1000/3600000 * parentWidth;
        $('#timeLine').last().width(($('#timeLine').last().width - width));
        var percentage = $('#timeLine').first().width();
        while(percentage<width) {
            width -= percentage;
            $('#timeLine').first().remove();
            percentage = $('#timeLine').first().width();
        }
        $('#timeLine').first().width((percentage - width));
    },1000);
}

function timeType(number) {
    if(number) {
        return "wasting";
    } else {
        return "using";
    }
}

function MinutesSecondsFormat(milli) {
    return Math.floor(milli/60000)  + ":" + ("0" + Math.floor((milli%60000)/1000)).slice(-2);
}

$('#timerButton').click(setTimer);
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