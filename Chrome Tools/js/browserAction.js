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

    timeLineInit($("#timeLineH"),background);
    keyPressInit($("body"),keyPhrases);

    var alarmPhrases = [["S",setAlarmKey],["A",stopAllAlarms],["X",snooze]];
    addPhrases(alarmPhrases);

    addNumberListener(removeAlarm,"D");
    addNumberListener(changeTimer);

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
        var logHolder = $("#logHolder");
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

    function setAlarmKey() {
        setAlarm(+$("#setTimer").val());
    }

    function setAlarm(delay) {
        sendRequest("setAlarm",delay);
    }

    function removeAlarm(alarmNumber) {
        var num = alarmNumber - 1;  //0 index
        if (num >= 0 && num < 5) {
            sendRequest("removeAlarm",num);
        }
    }

    function stopAllAlarms() {
        sendRequest("stopAllAlarms");
    }

    function snooze() {
        sendRequest("snooze");
    }

    //send requests to background
    function sendRequest(action,input) {
        chrome.runtime.sendMessage({
            from: "browserAction",
            action: action,
            input: input
        });
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
            }
        }
    });

    function showAlarm(date,alarmNumber,type) {
        var time = date.toLocaleTimeString();
        var alarm = alarmNumber + 1;
        $("#alarmText" + alarm).html("Alarm at "+time);
        $("#alarm" + alarm).removeClass("notSet").css({"color":typeColors[type],"border-color":typeColors[type]}).bind("click",function() {
            removeAlarm(alarm);
        });
    }

    function showRemove(alarmNumber,type) {
        var alarm = alarmNumber + 1;
        $("#alarmText" + alarm).html("Not Set");
        $("#alarm" + alarm).addClass("notSet").unbind("click").css({"color":defaultColor,"border-color":defaultColor,"visibility":"visible"});
        clearInterval(ringingAlarms[alarmNumber]);
    }

    function showRinging(alarmNumber) {
        var visibility = "hidden";
        ringingAlarms[alarmNumber] = setInterval(function() {
            visibility = (visibility === "hidden" ? "visible" : "hidden");
            $("#alarmText"+(alarmNumber+1)).css("visibility",visibility);
        },300);
    }
});
