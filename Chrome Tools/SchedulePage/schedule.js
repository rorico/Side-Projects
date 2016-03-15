var alarms;
var playAlarmCheck;
var info;

chrome.runtime.getBackgroundPage(function (backgroundPage) {
    var background = backgroundPage;

    //schedule
    info = background.scheduleInfo;
    $( "#datepicker" ).datepicker({
        onSelect: function(dateText) {
            if ($('#showWeek').val()=="Show Week") {
                changeDate($( "#datepicker" ).datepicker("getDate"));
            } else {
                showWeek($( "#datepicker" ).datepicker("getDate"));
            }
        },
        dateFormat: "DD MM d, yy"
    });
    $( "#datepicker" ).datepicker("setDate", new Date());
    showSchedule('#currentDay', new Date(),true);

    //alarms
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
    sendRequest("setAlarm",delay); //cast to int
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
        case 78:        //n
            setToday();
            break;
        case 77:        //m
            weekView();
            break;
        case 188:        //,
            prev();
            break;
        case 190:        //.
            next();
            break;
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
            if(e.altKey){
                window.open(chrome.extension.getURL("/SchedulePage/Schedule.html"));
            } else {
                setAlarm(60);
            }
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
/////////////////////////////////////////////////////////////////////////////////////////////////////
var dayToday = new Date();
var nowTimeOffset = 50;
//var info is set by background
var startTime = 700; //7AM
var endTime = 1900; //7PM

$('#showWeek').click(weekView);
$('#next').click(next);
$('#prev').click(prev);
function weekView() {
    var date = $( "#datepicker" ).datepicker("getDate");
    if ($('#showWeek').val()=="Show Week") {
        $('#showWeek').val("Show Day");
        showWeek(date);
    } else {
        $('#showWeek').val("Show Week");
        changeDate(date);
    }
}
function next() {
    var date = $( "#datepicker" ).datepicker("getDate");
    if ($('#showWeek').val()=="Show Week") {
        date.setDate(date.getDate() + 1);
        $( "#datepicker" ).datepicker("setDate",date);
        changeDate(date);
    } else {
        date.setDate(date.getDate() + 7);
        $( "#datepicker" ).datepicker("setDate",date);
        showWeek(date);
    }
}
function prev() {
    var date = $( "#datepicker" ).datepicker("getDate");
    if ($('#showWeek').val()=="Show Week") {
        date.setDate(date.getDate() - 1);
        $( "#datepicker" ).datepicker("setDate",date);
        changeDate(date);
    } else {
        date.setDate(date.getDate() - 7);
        $( "#datepicker" ).datepicker("setDate",date);
        showWeek(date);
    }
}
function setToday() {
    var date = new Date();
    $( "#datepicker" ).datepicker("setDate",date);
    if ($('#showWeek').val()=="Show Week") {
        changeDate(date);
    } else {
        showWeek(date);
    }
}

function showSchedule(container,date,full) {
    var today = [];
    for (var i = 0 ; i < info.length ; i++) {
        for (var j = 0 ; j < info[i].length ; j++) {
            if (sameDOW(date,info[i][j][0][0])&&isInRange(date,info[i][j][3])) {
                today.push(info[i][j]);
            }
        }
    }
    if (sameDay(date,dayToday)) {
        if (full) {
            nowTimeOffset = 50;
        } else {
            nowTimeOffset = 0;
        }
        $(container).prepend("<div id='nowHolder'><div id='now'></div></div>");
        showNow();
    }
    if (today.length==0) {
        $(container).append("<div class='class' style='height:599px'><p style='top:285px'>No Classes Today</p></div>");
    } else {
        today.sort(sort_by_date);
        
        html = "<div class='placeholder placeborder' style='height:0px'></div>";
        var length = (today[0][0][1]-startTime)/2;
        while (length>50) {
            html += "<div class='placeholder placeborder' style='height:49px'></div>";
            length-=50;
        }
        html += "<div class='placeholder' style='height:"+(length-1) +"px'></div>";
        for (var i = 0 ; i < today.length ; i++) {
            var start = today[i][0][1];
            var finish = today[i][0][2];
            var classType = today[i][5];
            var classCode = today[i][4][0];
            var classInfo = today[i][4][1];
            var location = today[i][1];

            var height = (finish-start)/2-2 + 1;
            html += "<div class='class "+classType+"' style='max-height:"+height+"px;height:"+height+"px'><p style='top:"+(height-30.4)/2+"px'>";
            if (full) {
                html += classCode+" "+classInfo+" - "+classType+"<br />"+location;
            } else {
                html += classCode+" - "+classType+"<br />"+location;
            }
            html += "</p></div>";

            var beginning = finish;
            var end = endTime;
            if (i!=today.length-1) {
                end = today[i+1][0][1];
            }
            var next;
            while ((next = Math.floor((beginning+100)/100)*100)<=end) {
                var length = next-beginning;
                html += "<div class='placeholder placeborder' style='height:"+(length/2-1)+"px'></div>";
                beginning += length;
            }
            html += "<div class='placeholder' style='height:"+((end-beginning)/2-1)+"px'></div>";
        }
        $(container).append(html);
    }
    $(container).parent().append("<div id='side'></div>");
    
}
function changeDate(date) { //single day
    $('#container').empty();
    $('#container').append("<div id='currentDay' class='day'></div>");
    showSchedule("#currentDay",date,true);
}
function showWeek(date){
    $('#container').empty();
    var start = date.getDay()-1;
    date.setDate(date.getDate()-start);    //set to monday
    for (var i = 0 ; i<5 ; i++){
        $('#container').append("<div id='D"+i+"' class='day'></div>");
        showSchedule('#D'+i, date,false);
        date.setDate(date.getDate()+1);
    }
    var length = $('#calendar').width();
    $('.class').width((length-100)/5-2);
    $('.placeholder').width((length-100)/5);
    $('#now').width((length-100)/5);
    showNow();
}
function sameDOW(date,DOW) { //same day of week
    var dayOfWeek = date.getDay();
    var day = -1;
    switch(dayOfWeek){
        case 1:
            day = 'M';
            break;
        case 2:
            day = 'T';
            break;
        case 3:
            day = 'W';
            break;
        case 4:
            day = 'Th';
            break;
        case 5:
            day = 'F';
            break;
    }
    if (DOW.indexOf(day) > -1) {
        if (day=="T"&&DOW[DOW.indexOf(day)+1]=="h") {
            return false;
        }
        return true;
    }
    return false;
}
function isInRange(date,range) {
    return (date>=range[0]&&date<=range[1]);
}
function sameDay(day1,day2) {
    return day1.getDate()==day2.getDate()&&day1.getMonth()==day2.getMonth()&&day1.getYear()==day2.getYear();
}
function sort_by_date(a,b) {
    if (a[0][1] < b[0][1]) return -1;
    if (a[0][1] > b[0][1]) return 1;
    return 0;
}
function showNow() {
    if ($('#now').size()>0) {
        var now = new Date();
        var delay = 60-now.getSeconds();
        var position = (now.getHours()-7)*50+now.getMinutes()/1.2;
        if (now.getHours()>=19||now.getHours()<=6) {
            $('#now').css('display','none');
        } else {
            if (now.getHours()>=13) {
                var text = (now.getHours()-12)+":"+('0'+now.getMinutes()).slice(-2)+"PM";
            } else if (now.getHours()==12) {
                var text = (now.getHours())+":"+('0'+now.getMinutes()).slice(-2)+"PM";
            } else {
                var text = (now.getHours())+":"+('0'+now.getMinutes()).slice(-2)+"AM";
            }
            $('#now').css('display','block');
            $('#now').text(text);
            $('#nowHolder').css('top',position);
            $('#nowHolder').css('left',-nowTimeOffset);
        }
        setTimeout(function(){
            showNow();
        },delay*1000);
    }
}