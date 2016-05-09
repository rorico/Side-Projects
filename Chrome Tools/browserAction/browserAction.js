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
    var url = background.url;
    var title = background.title;
    var timeCurrent = new Date() - startTime;
    if (wastingTime) {
        timeLeft -= timeCurrent;
    }
    if(timeLeft < 0) {
        timeLeft = 0;
    }
    countDown(timeLeft,wastingTime);

    $('#info').html(formatInfo(url,timeCurrent,title));
    var timeLine = background.timeLine;
    var parentWidth = 360;
    var timeLeft = parentWidth;
    var offset = 0;
    var cnt = 0;    //used to set hovers
    var hover = false;
    var click = false;
    if(addTimeLine([timeCurrent,wastingTime,url],false)){
        for (var i = timeLine.length - 1 ; i != -1 ; i--) {
            if(!addTimeLine(timeLine[i],true)) {
                break;
            }
        }
        if(timeLeft > 0) {
            $('#timeLine').prepend('<div style="width:' + timeLeft + 'px" class="timeLine"></div>');
        }
    }
    updateTimeLine();
    
    function addTimeLine(info,hover) {        //returns true if not done
        var time = info[0]/3600000 * parentWidth + offset;
        offset = time%1;
        time = Math.floor(time);
        if(time < 1 && hover) {
            offset += time;
            return true;
        }
        var ret = true;
        if(time >= timeLeft) {
            time = timeLeft;
            timeLeft = 0;
            ret = false;
        } else {
            timeLeft -= time;
        }
        var classAddon = '';
        if(time >= 3) {
            time -= 2;
            classAddon = ' timeLineBlock';
        }
        $('#timeLine').prepend('<div style="width:' + time + 'px" id="timeLine' + cnt + '" class="timeLine ' + timeType(info[1]) + classAddon + '"></div>');
        setClick(info);
        if (hover) {
            setHover(info);
        }
        return ret;
    }

    function setHover(info) {
        $('#timeLine'+cnt).hover(function(){
            hover = true;
            $('#info').html(formatInfo(info[2],info[0],info[3]));
        },function(){
            if(!click){
                hover = false;
                $('#info').html(formatInfo(url,timeCurrent,title));
            }
        });
        cnt++;
    }
    function setClick(info) {
        $('#timeLine'+cnt).click(function(){
            click = true;
            $('#info').html(formatInfo(info[2],info[0],info[3]));
        });
    }
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
        var parentWidth = $('#timeLine').width();
        var delay = 3600000/parentWidth;
        setInterval(function(){
            var width = 1;
            $('#timeLine div:last-child').width(($('#timeLine div:last-child').width() + width));
            var percentage = $('#timeLine div:first-child').width();
            while(percentage<width) {
                width -= percentage;
                $('#timeLine div:first-child').remove();
                percentage = $('#timeLine div:first-child').width();
            }
            $('#timeLine div:first-child').width((percentage - width));
        },delay);
        setInterval(function(){
            timeCurrent += 1000;
            if(!hover) {
                $('#info').html(formatInfo(url,timeCurrent,title));
            }
        },1000);
    }

    function timeType(number) {
        if(number) {
            return "wasting";
        } else {
            return "using";
        }
    }

    function formatInfo(url,time,title) {
        return shorten(title," ",50) + '<br />' + shorten(url,"/",50) + '<br />Time spent:' + MinutesSecondsFormat(time);
    }

    function shorten(info,delim,limit){
        if(info.length > limit) { //show be about a line (400px)
            do {
                var index = info.lastIndexOf(delim);
                info = info.substring(0,index);
            } while(index > limit);
            info += delim + "...";
        }
        return info;
    }
    
    function MinutesSecondsFormat(milli) {
        return Math.floor(milli/60000)  + ":" + ("0" + Math.floor((milli%60000)/1000)).slice(-2);
    }
});

$('#timerButton').click(setTimer);
function setTimer() {
    var delay = +$('#setTimer').val();
    setAlarm(delay);
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
            stopAllAlarms();
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
                removeAlarm(e.keyCode-49);
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
                removeAlarm(e.keyCode-96);
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

//send requests to background
function sendRequest(action,input){
    chrome.runtime.sendMessage({
        from: "browserAction",
        action: action,
        input: input
    });
}

function setAlarm(delay) {
    sendRequest("setAlarm",delay);
}

function removeAlarm(alarmNumber) {
    sendRequest("removeAlarm",alarmNumber);
}

function stopAllAlarms() {
    sendRequest("stopAllAlarms");
}

function snooze() {
    sendRequest("snooze");
}

//get from background to display
chrome.runtime.onMessage.addListener(function(a, b, c) {
    if(a.from === "background") {
        switch(a.action) {
            case "setAlarm":
                input = a.input;
                showAlarm(new Date(input[1]),input[0]);
                break;
            case "removeAlarm":
                input = a.input;
                showRemove(input);
                break;
        }
    }
});

function showAlarm(date,index) {
    var time = date.toLocaleTimeString();
    $('#alarm'+(index+1)).html("Alarm at "+time);
    $('#alarm'+(index+1)).parent().removeClass("notSet");
}

function showRemove(alarmNumber) {
    $('#alarm'+(alarmNumber+1)).html("Not Set");
    $('#alarm'+(alarmNumber+1)).parent().addClass("notSet");
}


function changeTime(change) {
    delay = parseInt($('#setTimer').val());
    if (change>0 || delay>0) {
        $('#setTimer').val(delay+change);
    }
}