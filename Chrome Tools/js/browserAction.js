chrome.runtime.getBackgroundPage(function (backgroundPage) {
    var ringingAlarms = [0,0,0,0,0];
    var background = backgroundPage;
    var typeColors = backgroundPage.typeColors;
    var defaultColor = backgroundPage.defaultColor;
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

    $("#info").html(formatInfo(url,timeCurrent,title));
    var timeLine = background.timeLine;
    var parentWidth = 360;      //keep unchanged
    var timeLineLeft = parentWidth;
    var offset = 0;
    var timeLineOffset = 0;
    var currentTimePiece = -1;
    var updateTimeLineInterval = -1;
    var timeCurrentInterval = -1;

    if (addTimeLine(-1,false,timeCurrent,wastingTime)) {
        for (var i = 0; i < timeLine.length ; i++) {
            if (!addTimeLine(i,false,timeLine[i][0],timeLine[i][1])) {
                break;
            }
        }
        //fill in rest
        addTimeLine(-2,false);
    }
    displayInfo(-1);
    updateTimeLine();

    var logs = background.allLogs;
    var numUnread = background.numUnread;
    alertLogs();

    //automatically close window after a period of time
    //due to alt tabbing out of game to close alarm multiple times and expecting it not to be open
    //if browserAction becomes more than alarm, remove this
    //consider also making a certain time after last action
    setTimeout(function() {
        window.close();
    },60000);//1 minute

    //may want to combine with start later
    function restartTimeLine() {
        clearInterval(updateTimeLineInterval);
        clearInterval(timeCurrentInterval);

        //these values will probably be update from background when called
        timeLeft = background.timeLeft;
        startTime = background.startTime;
        wastingTime = background.wastingTime;
        url = background.url;
        title = background.title;

        //reset these to starting
        timeCurrent = new Date() - startTime;
        $("#info").html(formatInfo(url,timeCurrent,title));
        timeLineLeft = parentWidth;
        currentTimePiece = -1;
        offset = 0;

        $("#timeLine").empty();
        addTimeLine(-1,false,timeCurrent,wastingTime);
        addTimeLine(-2,false);
        displayInfo(-1);
        updateTimeLine();
    }

    //returns true if not done
    function addTimeLine(index,first,time,wastingTime) {
        var width = 0;
        if (index === -2) {
            width = timeLineLeft;
        } else {
            width = time/timeLineLength * parentWidth + offset;
        }
        offset = width % 1;
        width = Math.floor(width);
        //if smaller than 1px, don't bother adding, unless at very start or end (these will change size)
        if (width < 1 && index !== -1) {
            offset += width;
            return true;
        }
        var ret = true;
        if (width >= timeLineLeft) {
            width = timeLineLeft;
            timeLineLeft = 0;
            ret = false;
        } else {
            timeLineLeft -= width;
        }

        var classes = "timeLine";
        if (index !== -2) {
            classes += " wasting" + wastingTime;
            if (width >= 3) {
                classes += " timeLineBlock";
            }
        }

        var timeLineEntry = $("<div style='width:" + width + "px;' class='" + classes + "' id='" + getTimeLineId(index) + "'></div>");
        if (first) {
            $("#timeLine").append(timeLineEntry);
        } else {
            $("#timeLine").prepend(timeLineEntry);
        }

        if (index !== -2) {
            setClick(timeLineEntry,index);
        }
        return ret;
    }

    function getTimeLineId(index) {
        return (index === -2 ? "timeLineP" : "timeLine" + (index - timeLineOffset));
    }

    function setClick(ele,i) {
        ele.click(function() {
            currentTimePiece = i + timeLineOffset;
            displayInfo(currentTimePiece);
        });
        ele.hover(function() {
            displayInfo(i + timeLineOffset);
        },function() {
            displayInfo(currentTimePiece);
        });
    }

    function displayInfo(i) {
        clearTimeout(timeCurrentInterval);
        var info = "";
        if (i === -1) {
            timeCurrent = new Date() - startTime;
            var delay = 1 - (timeCurrent%1);
            timeCurrentInterval = setTimeout(function() {
                displayInfo(i);
            },delay);
            info = formatInfo(url,timeCurrent,title);
        } else {
            info = formatInfo(timeLine[i][2],timeLine[i][0],timeLine[i][3]);
        }
        $("#info").html(info);
    }

    function countDown(timeLeft) {
        if (wastingTime) {
            timeLeft -= new Date() - startTime;
        }
        if (timeLeft < 0) {
            timeLeft = 0;
        }
        countDownFunction(timeLeft);
    }

    //not exactly accurate, not too important
    function countDownFunction(time) {
        $("#timeLeft").html(MinutesSecondsFormat(time));
        if (wastingTime && time>0) {
            var delay = (time-1)%1000+1;
            countDownTimer = setTimeout(function() {
                countDownFunction(time - delay);
            },delay);
        }
    }

    function updateTimeLine() {
        var delay = timeLineLength/parentWidth;
        updateTimeLineInterval = setInterval(function() {
            var newEle = $("#timeLine div:last-child");
            newEle.width(newEle.width() + 1);
            if (!newEle.hasClass("timeLineBlock") && newEle.width() >= 3) {
                newEle.addClass("timeLineBlock");
            }
            var oldestEle = $("#timeLine div:first-child");
            //oldest has 0 width, remove
            while(oldestEle.width() <= 0) {
                oldestEle.remove();
                oldestEle = $("#timeLine div:first-child");
            }
            oldestEle.width(oldestEle.width() - 1);
            if (oldestEle.hasClass("timeLineBlock") && oldestEle.width() < 3) {
                oldestEle.removeClass("timeLineBlock");
            }
        },delay);
    }

    function formatInfo(url,time,title) {
        return shorten(title," ",50) + "<br />" + shorten(url,"/",50) + "<br />Time spent:" + MinutesSecondsFormat(time);
    }

    function shorten(info,delim,limit) {
        if (info.length > limit) { //show be about a line (400px)
            var index = 0;
            do {
                index = info.lastIndexOf(delim);
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

    function alertLogs() {
        if (numUnread) {
            var logHolder = $("<div id='logHolder' class='block'>!</div>");
            $("body").prepend(logHolder);
            logHolder.width(logHolder.height());
            logHolder.one("click",displayLogs);
        }
    }

    function displayLogs() {
        var allLogEle = $("<div id='logs'></div>");
        for (var i = 0 ; i < logs.length ; i++) {
            if (!logs[i][1]) {
                var logEle = $("<div class='log block'>" + logs[i][0] + "</div>");
                clickLogRemove(logEle,i);
                allLogEle.append(logEle);
            }
        }
        var logHolder = $("#logHolder")
        logHolder.html(allLogEle);
        //20 is 2 * margin
        logHolder.outerWidth($("body").width() - 20);
        logHolder.one("click",function() {
            //maybe want to just change instead of remove
            this.remove();
            alertLogs();
        });
    }

    function clickLogRemove(ele,i) {
        ele.click(function(e){
            e.stopPropagation();
            this.remove();
            sendRequest("removeLog",i);
            numUnread--;
            if (!numUnread) {
                $("#logHolder").remove();
            }
        });
    }

    ////////////////////////events//////////////////////////////
    $("#timerButton").click(setTimer);
    function setTimer() {
        var delay = +$("#setTimer").val();
        setAlarm(delay);
    }

    var time = new Date();
    var currentTimer = "";
    function changeTimer(digit) {
        var now = new Date();
        if (now-time<1000) {
            currentTimer += digit.toFixed(0);
            //limit to 3 digits
            if (currentTimer.length > 3) {
                currentTimer = currentTimer.substring(1);
            }
            $("#setTimer").val(currentTimer);
        } else {
            currentTimer = digit;
            $("#setTimer").val(currentTimer);
        }
        time = new Date();
    }

    function startShowHotkey(phrase,start) {
        $("#phraseHolder").remove();
        var front = "<div id='phraseFront'>";
        var back = "<div id='phraseBack'>";
        for (var i = 0 ; i < phrase.length ; i++) {
            front += "<div id='phrase" + i + "' class='phrasePart'>" + phrase[i] + "</div>";
            back += "<div class='phrasePart'>" + phrase[i] + "</div>";
        }
        front += "</div>";
        back += "</div>";
        var html = "<div id='phraseHolder'><div id='phrase'>" + front + back + "</div></div>";
        $("body").prepend(html);
        var fontSize = 100;
        var widthMargin = 40;    //don't want text to hug the sides
        var maxWidth = $("body").width() - widthMargin;
        if (maxWidth < $("#phraseFront").width()) {
            //shouldn't get stuck in an infinite loop
            fontSize = Math.floor(fontSize / ($("#phraseFront").width() / maxWidth));
            $(".phrasePart").css("font-size",fontSize);
        }
        //center display
        var leftOffset = ($("body").innerWidth() - $("#phraseFront").outerWidth())/2;
        var topOffset = ($("body").innerHeight() - $("#phraseFront").outerHeight())/2;
        $("#phraseHolder").css("left",leftOffset);
        $("#phraseHolder").css("top",topOffset);
        if (start) {
            $("#phrase0").addClass("filled");
        }
        disappearHotkey(1200);
    }

    function showHotkey(index,correct) {
        if (correct) {
            $("#phrase" + index).addClass("filled").removeClass("failed");
            disappearHotkey(1200);
        } else {
            $("#phrase" + index).addClass("failed");
            disappearHotkey(500);
        }
    }

    var disappearInterval;
    function disappearHotkey(time) {
        var opacity = 0.8;
        var delay = (time ? time / opacity / 100 : 15);
        $("#phrase").css("opacity",opacity);
        clearInterval(disappearInterval);
        if (!allowMistakes) {
            disappearInterval = setInterval(function() {
                opacity -= 0.01;
                $("#phrase").css("opacity",opacity);
                if (opacity <= 0) {
                    clearHotkey();
                }
            },delay);
        }
    }

    function clearHotkey() {
        currentPhrase = 0;
        phraseIndex = 0;
        allowMistakes = false;
    }
    //order matters in terms of what gets checked first
    //keep letters capitalized
    var phrases = [["ZYXWVUTSRQPONMLKJIHGFEDCBA",resetTimeLine],["VIP",VIP],["CHANGE",change],["TEMP",tempVIP]];
    var currentPhrase = 0;
    var phraseIndex = 0;
    var allowMistakes = false;
    var deletes = false;
    $(window).keydown(function(e) {
        if (currentPhrase) {
            //get lowercase ascii value of next part
            if (e.keyCode === currentPhrase[0].charCodeAt(phraseIndex)) {
                showHotkey(phraseIndex,true);
                if (++phraseIndex === currentPhrase[0].length) {
                    $("#phrase").addClass("done");
                    var fnc = currentPhrase[1];
                    clearHotkey();
                    fnc();
                    disappearHotkey();
                }
            } else {
                showHotkey(phraseIndex,false);
                if (!allowMistakes) {
                    clearHotkey();
                }
            }
        } else  {
            var found = false;
            for (var i = 0 ; i < phrases.length ; i++) {
                if (e.keyCode === phrases[i][0].charCodeAt(0)) {
                    startShowHotkey(phrases[i][0],true);
                    currentPhrase = phrases[i];
                    phraseIndex = 1;
                    found = true;
                }
            }
            if (!found) {
                switch (e.keyCode) {
                    case 83:        //s
                        setAlarm(+$("#setTimer").val());
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
        //add another test to actually call vip in background
        var random = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 0 ; i < 18 ; i++) {
            random += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        currentPhrase = [random,function() {sendRequest("VIP");}];
        allowMistakes = true;
        startShowHotkey(random,false);
    }

    function change() {
        sendRequest("change",currentTimePiece);
    }

    function tempVIP() {
        sendRequest("temp");
    }

    //send requests to background
    function sendRequest(action,input) {
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
        if (a.from === "background") {
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
                case "timer":
                    clearTimeout(countDownTimer);
                    countDown(a.input);
                    break;
                case "change":
                    var input = a.input;
                    $("#" + getTimeLineId(input[0])).removeClass("wasting" + input[1]).addClass("wasting0");
                    break;
                case "reset":
                    restartTimeLine();
                    break;
                case "newPage":
                    $("#" + getTimeLineId(-1)).removeClass("wasting" + wastingTime).addClass("wasting0");
                    startTime = background.startTime;
                    wastingTime = background.wastingTime;
                    timeLineOffset++;
                    addTimeLine(-1,true,new Date() - startTime,wastingTime);
                    break;
            }
        }
    });

    function showAlarm(date,alarmNumber,type) {
        var time = date.toLocaleTimeString();
        $("#alarmText"+(alarmNumber+1)).html("Alarm at "+time);
        $("#alarm"+(alarmNumber+1)).removeClass("notSet");
        $("#alarm"+(alarmNumber+1)).css({"color":typeColors[type],"border-color":typeColors[type]});
        $("#alarm"+(alarmNumber+1)).bind("click",function() {
            removeAlarm(alarmNumber);
        });
    }

    function showRemove(alarmNumber,type) {
        $("#alarmText"+(alarmNumber+1)).html("Not Set");
        $("#alarm"+(alarmNumber+1)).addClass("notSet");
        $("#alarm"+(alarmNumber+1)).unbind("click");
        $("#alarm"+(alarmNumber+1)).css({"color":defaultColor,"border-color":defaultColor});
        $("#alarmText"+(alarmNumber+1)).css("visibility","visible");
        clearInterval(ringingAlarms[alarmNumber]);
    }

    function showRinging(alarmNumber) {
        var visibility = "hidden";
        ringingAlarms[alarmNumber] = setInterval(function() {
            visibility = (visibility === "hidden" ? "visible" : "hidden");
            $("#alarmText"+(alarmNumber+1)).css("visibility",visibility);
        },300);
    }

    function changeTime(change) {
        var delay = parseInt($("#setTimer").val());
        if (change>0 || delay>0) {
            $("#setTimer").val(delay+change);
        }
    }
});
