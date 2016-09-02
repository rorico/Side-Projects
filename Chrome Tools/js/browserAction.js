chrome.runtime.getBackgroundPage(function (backgroundPage) {
    var ringingAlarms = [0,0,0,0,0];
    var background = backgroundPage;
    var typeColors = backgroundPage.typeColors;
    var defaultColor = backgroundPage.defaultColor;
    var resetTimeLine = backgroundPage.resetTime;
    var alarms = background.alarms;
    for (var i = 0 ; i < alarms.length ; i++) {
        if (alarms[i][0] == 1) {
            showAlarm(alarms[i][1],i,alarms[i][3]);
        } else if (alarms[i][0] == 2) {
            showAlarm(alarms[i][1],i,alarms[i][3]);
            showRinging(i);
        }
    }
    var timeLineLength = background.timeLineLength;
    var timeLeft = background.timeLeft;
    var startTime = background.startTime;
    var wastingTime = background.wastingTime;
    var url = background.url;
    var title = background.title;
    var timeCurrent = new Date() - startTime;
    var countDownTimer = -1;
    countDown(timeLeft);

    $('#info').html(formatInfo(url,timeCurrent,title));
    var timeLine = background.timeLine;
    var parentWidth = 360;
    var timeLineLeft = parentWidth;
    var offset = 0;
    var hover = false;
    var click = false;
    var totalOffset = 0;
    if(addTimeLine([timeCurrent,wastingTime,url],false)){
        for (var i = timeLine.length - 1 ; i != -1 ; i--) {
            if(!addTimeLine(timeLine[i],true,i)) {
                break;
            }
        }
        if(timeLineLeft > 0) {
            $('#timeLine').prepend('<div style="width:' + timeLineLeft + 'px" class="timeLine"></div>');
        }
    }
    updateTimeLine();

    function addTimeLine(info,hover,num) {        //returns true if not done
        var time = info[0]/timeLineLength * parentWidth + offset;
        offset = time%1;
        time = Math.floor(time);
        if(time < 1 && hover) {
            offset += time;
            return true;
        }
        var ret = true;
        if(time >= timeLineLeft) {
            time = timeLineLeft;
            timeLineLeft = 0;
            ret = false;
        } else {
            timeLineLeft -= time;
        }
        var classAddon = '';
        if(time >= 3) {
            time -= 2;
            classAddon = ' timeLineBlock';
        }
        var timeLineEntry = $('<div style="width:' + time + 'px;" class="timeLine wasting' + info[1] + classAddon + '" id="timeLine' + num + '"></div>');
        $('#timeLine').prepend(timeLineEntry);
        setClick(timeLineEntry,info);
        if (hover) {
            setHover(timeLineEntry,info);
        }
        return ret;
    }

    function setHover(ele,info) {
        ele.hover(function(){
            hover = true;
            $('#info').html(formatInfo(info[2],info[0],info[3]));
        },function(){
            if(!click){
                hover = false;
                $('#info').html(formatInfo(url,timeCurrent,title));
            }
        });
    }
    function setClick(ele,info) {
        ele.click(function(){
            click = true;
            $('#info').html(formatInfo(info[2],info[0],info[3]));
        });
    }

    function countDown(timeLeft) {
        if (wastingTime) {
            timeLeft -= timeCurrent;
        }
        if(timeLeft < 0) {
            timeOffset = timeLeft;
            timeLeft = 0;
        }
        countDownFunction(timeLeft);
    }
    function countDownFunction(time) {
        $('#test').html(MinutesSecondsFormat(time));
        if(wastingTime && time>0) {
            delay = (time-1)%1000+1;
            countDownTimer = setTimeout(function(){
                countDownFunction(time - delay);
            },delay);
        }
    }

    function updateTimeLine() {
        var parentWidth = $('#timeLine').width();
        var delay = timeLineLength/parentWidth;
        setInterval(function(){
            var newEle = $('#timeLine div:last-child');
            var oldestEle = $('#timeLine div:first-child');
            if(!newEle.hasClass("timeLineBlock") && newEle.width() + 1 >= 2) {
                newEle.width(newEle.width() - 1);
                newEle.addClass("timeLineBlock");
            } else {
                newEle.width(newEle.width() + 1);
            }
            //oldest has 0 width, remove
            while(!oldestEle.hasClass("timeLineBlock") && oldestEle.width() <= 0) {
                oldestEle.remove();
                oldestEle = $('#timeLine div:first-child');
            }
            if(oldestEle.hasClass("timeLineBlock") && oldestEle.width() - 1 <= 0) {
                oldestEle.width(oldestEle.width() + 1);
                oldestEle.removeClass("timeLineBlock");
            } else {
                oldestEle.width(oldestEle.width() - 1);
            }
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
        var secs = Math.ceil(milli/1000);
        return Math.floor(secs/60)  + ":" + ("0" + Math.floor(secs%60)).slice(-2);
    }

    ////////////////////////events//////////////////////////////
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
            //limit to 3 digits
            if (currentTimer.length > 3) {
                currentTimer = currentTimer.substring(1);
            }
            $('#setTimer').val(currentTimer);
        } else {
            currentTimer = digit;
            $('#setTimer').val(currentTimer);
        }
        time = new Date();
    }

    function startShowHotkey(phrase) {
        $("#phrase").remove();
        var front = "<div id='phraseFront'>";
        var back = "<div id='phraseBack'>";
        for(var i = 0 ; i < phrase.length ; i++) {
            front += "<div id='phrase" + i + "' class='phrasePart'>" + phrase[i] + "</div>";
            back += "<div class='phrasePart'>" + phrase[i] + "</div>";
        }
        front += "</div>";
        back += "</div>";
        var html = "<div id='phrase'>" + front + back + "</div>";
        $("body").append(html);
        var fontSize = 100;
        while($("body").width() < $("#phraseFront").width()) {
            $(".phrasePart").css("font-size",--fontSize);
        }
        //center display
        var leftOffset = ($("body").width() - $("#phraseFront").width())/2;
        var topOffset = ($("body").height() - $("#phraseFront").height())/2;
        $("#phraseFront").css("left",leftOffset);
        $("#phraseFront").css("top",topOffset);
        $("#phraseBack").css("left",leftOffset);
        $("#phraseBack").css("top",topOffset);
        $("#phrase0").addClass("filled");
        disappearHotkey();
    }

    function showHotkey(index) {
        $("#phrase" + index).addClass("filled");
        disappearHotkey();
    }

    var disappearInterval;
    function disappearHotkey() {
        var opacity = 0.8;
        clearInterval(disappearInterval);
        disappearInterval = setInterval(function(){
            opacity -= 0.01;
            $("#phrase").css("opacity",opacity);
            if(opacity <= 0) {
                clearHotkey();
            }
        },10)
    }

    function clearHotkey() {
        currentPhrase = -1;
        phraseIndex = 0;
        clearInterval(disappearInterval);
        $("#phrase").remove();
    }
    //order matters in terms of what gets checked first
    //keep letters capitalized
    var phrases = [["ABCDEFGHIJKLMNOPQRSTUVWXYZ",resetTimeLine],["VIP",VIP]];
    var currentPhrase = -1;
    var phraseIndex = 0;
    var deletes = false;
    $(window).keydown(function(e) {
        if(currentPhrase !== -1) {
            //get lowercase ascii value of next part
            if(e.keyCode === phrases[currentPhrase][0].charCodeAt(phraseIndex)) {
                found = true;
                showHotkey(phraseIndex);
                if(++phraseIndex === phrases[currentPhrase][0].length) {
                    phrases[currentPhrase][1]();
                }
            } else {
                clearHotkey();
            }
        } else  {
            var found = false;
            for(var i = 0 ; i < phrases.length ; i++) {
                if(e.keyCode === phrases[i][0].charCodeAt(0)) {
                    startShowHotkey(phrases[i][0]);
                    currentPhrase = i;
                    phraseIndex = 1;
                    found = true;
                }
            }
            if(!found) {
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
                    case 87:        //w
                        setAlarm(15);
                        break;
                    case 69:        //e
                        setAlarm(30);
                        break;
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
                    case 48:        //0
                        changeTimer(e.keyCode-48);
                        break;
                    case 97:        //keypad 1
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
                    case 96:        //keypad 0
                        changeTimer(e.keyCode-96);
                        break;

                    case 38:        //up key
                        changeTime(1);
                        break;
                    case 40:        //down key
                        changeTime(-1);
                        break;
                }
            }
        }
    }).keyup(function(e) {
        switch (e.keyCode) {
            case 68:        //d
                deletes = false;
                break;
        }
    });

    function resetTimeLine() {
        sendRequest("resetTime");
    }

    function VIP() {
        sendRequest("VIP");
    }
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
                    var input = a.input;
                    showAlarm(new Date(input[1]),input[0],input[2]);
                    break;
                case "removeAlarm":
                    var input = a.input;
                    showRemove(input[0],input[1]);
                    break;
                case "ringing":
                    showRinging(a.input);
                    break;
                case "timeLine":
                    var input = a.input;
                    var changes = input[1];
                    var offset = input[0];
                    totalOffset += offset;
                    for(var i = 0 ; i < changes.length ; i++) {
                        $('#timeLine' + (changes[i][0] + totalOffset)).removeClass("wasting"+changes[i][1]).addClass("wasting0");
                        timeLeft += changes[i][2];
                    }
                    clearTimeout(countDownTimer);
                    countDown(timeLeft);
                    break;
            }
        }
    });


    function alarmTypeOf(type) {
        switch(type) {
            case 1:
                return "sleep";
            case 2:
                return "block";
            default:
                return "";
        }
    }

    function showAlarm(date,alarmNumber,type) {
        var time = date.toLocaleTimeString();
        $('#alarmText'+(alarmNumber+1)).html("Alarm at "+time);
        $('#alarm'+(alarmNumber+1)).removeClass("notSet");
        $('#alarm'+(alarmNumber+1)).css({"color":typeColors[type],"border-color":typeColors[type]});
        $('#alarm'+(alarmNumber+1)).bind("click",function(){
            removeAlarm(alarmNumber);
        });
    }

    function showRemove(alarmNumber,type) {
        $('#alarmText'+(alarmNumber+1)).html("Not Set");
        $('#alarm'+(alarmNumber+1)).addClass("notSet");
        $('#alarm'+(alarmNumber+1)).unbind("click");
        $('#alarm'+(alarmNumber+1)).css({"color":defaultColor,"border-color":defaultColor});
        $('#alarmText'+(alarmNumber+1)).css("visibility","visible");
        clearInterval(ringingAlarms[alarmNumber]);
    }

    function showRinging(alarmNumber) {
        var visibility = "hidden";
        ringingAlarms[alarmNumber] = setInterval(function(){
            visibility = (visibility === "hidden" ? "visible" : "hidden");
            $('#alarmText'+(alarmNumber+1)).css("visibility",visibility)
        },300);
    }

    function changeTime(change) {
        delay = parseInt($('#setTimer').val());
        if (change>0 || delay>0) {
            $('#setTimer').val(delay+change);
        }
    }
});
