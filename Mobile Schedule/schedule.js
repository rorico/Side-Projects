var now = new Date();
var startTime = 700;        //7AM
var endTime = 1900;         //7PM
var nowTimeOffset = 50;     //for showing now bar
var weekMode = false;
var offset = 0;
var nowTimer = -1;

$("#datepicker").datepicker({
    onSelect: function(dateText) {
        if (weekMode) {
            showWeek($("#datepicker").datepicker("getDate"));
        } else {
            changeDate($("#datepicker").datepicker("getDate"));
        }
    },
    dateFormat: "DD MM d, yy"
});

//main
var weekMode = window.innerWidth > window.innerHeight;
setToday();

function showSchedule(container,date) {
    var today = todaySchedule(date);    //function in scheduleInfo.js
    now = new Date();
    if (sameDay(date,now)) {
        nowTimeOffset = 50 * !weekMode;
        $(container).prepend("<div id='nowHolder'><div id='now'></div></div>");
        clearTimeout(nowTimer);
        showNow();
    }

    if (!today.length) {
        addTimeSlot(container,"class",endTime - startTime,["No Classes Today"]);
    } else {
        addTimeSlot(container,"placeholder placeborder",0);
        var length = today[0][0][1] - startTime - 1;
        while (length > 100) {
            addTimeSlot(container,"placeholder placeborder",100);
            length -= 100;
        }
        addTimeSlot(container,"placeholder",length);
        for (var i = 0 ; i < today.length ; i++) {
            var start = today[i][0][1];
            var finish = today[i][0][2];
            var classType = today[i][3];
            var classCode = today[i][2][0];
            var className = today[i][2][1];
            var location = today[i][1];

            var height = finish - start + 1;
            var classInfo = [classCode + (weekMode ? "" : " " + className) + " - " + classType, location];
            addTimeSlot(container,"class " + classType,height,classInfo);

            var beginning = finish;
            var end = (i === today.length - 1 ? endTime : end = today[i+1][0][1] - 1);
            var next;
            while ((next = Math.floor((beginning+100)/100)*100)<=end) {
                length = next - beginning;
                addTimeSlot(container,"placeholder placeborder",length);
                beginning += length;
            }
            addTimeSlot(container,"placeholder",end-beginning);
        }
    }
    $(container).parent().append("<div id='side'></div>");
}

function addTimeSlot(container,classType,time,content) {
    //do no need to account for border as using box-sizing:border-box
    var height = time/2;
    var thisHeight = height + offset;
    offset = thisHeight % 1;
    thisHeight = Math.floor(thisHeight);

    var thisContent = "";
    if (content && content.length) {
        thisContent = "<p style='top:" + (thisHeight - 15.2 * content.length)/2 + "px'>" + content.join("<br />") + "</p>";
    }
    $(container).append("<div class='" + classType + "' style='height:" + thisHeight + "px'>" + thisContent + "</div>");
}

function sameDay(day1,day2) {
    var date1 = new Date(day1);
    var date2 = new Date(day2);
    return date1.getDate()==date2.getDate()&&date1.getMonth()==date2.getMonth()&&date1.getYear()==date2.getYear();
}

function showNow() {
    if ($("#now").size()) {
        now = new Date();
        if (now.getHours() < startTime/100 || now.getHours() >= endTime/100) {
            $("#now").css("display","none");
        } else {
            var text = (now.getHours())+":"+("0"+now.getMinutes()).slice(-2)+"AM";
            if (now.getHours()>=13) {
                text = (now.getHours()-12)+":"+("0"+now.getMinutes()).slice(-2)+"PM";
            } else if (now.getHours()==12) {
                text = (now.getHours())+":"+("0"+now.getMinutes()).slice(-2)+"PM";
            }
            var position = Math.floor((now.getHours() - (startTime)/100) * 50 + now.getMinutes()/1.2);
            $("#now").css("display","block");
            $("#now").text(text);
            $("#nowHolder").css("top",position);
            $("#nowHolder").css("left",-nowTimeOffset);
            var delay = 60000 - now.getSeconds()*1000 - now.getMilliseconds();
            nowTimer = setTimeout(function() {
                showNow();
            },delay);
        }
    }
}

$(window).keydown(function(e) {
    switch (e.keyCode) {
        case 78:        //n
            setToday();
            break;
        case 77:        //m
            weekView(!weekMode);
            break;
        case 188:        //,
            prev();
            break;
        case 190:        //.
            next();
            break;
    }
});

$("#next").click(next);
$("#prev").click(prev);

function weekView(mode) {
    weekMode = mode;
    var date = $("#datepicker").datepicker("getDate");
    if (weekMode) {
        $("#showWeek").val("Show Day");
        showWeek(date);
    } else {
        $("#showWeek").val("Show Week");
        changeDate(date);
    }
}

function next() {
    var date = $("#datepicker").datepicker("getDate");
    if (weekMode) {
        date.setDate(date.getDate() + 7);
        showWeek(date);
    } else {
        date.setDate(date.getDate() + 1);
        changeDate(date);
    }
    $("#datepicker").datepicker("setDate",date);
}

function prev() {
    var date = $("#datepicker").datepicker("getDate");
    if (weekMode) {
        date.setDate(date.getDate() - 7);
        showWeek(date);
    } else {
        date.setDate(date.getDate() - 1);
        changeDate(date);
    }
    $("#datepicker").datepicker("setDate",date);
}

function setToday() {
    now = new Date();
    $("#datepicker").datepicker("setDate",now);
    if (weekMode) {
        showWeek(now);
    } else {
        changeDate(now);
    }
}

function changeDate(date) { //single day
    $("#container").empty();
    $("#container").append("<div id='currentDay' class='day'></div>");
    showSchedule("#currentDay",date);
}

function showWeek(date) {
    $("#container").empty();
    var start = date.getDay()-1;
    date.setDate(date.getDate()-start);    //set to monday
    for (var i = 0 ; i<5 ; i++) {
        $("#container").append("<div id='D"+i+"' class='day'></div>");
        showSchedule("#D"+i, date);
        date.setDate(date.getDate()+1);
    }
    var width = ($("#calendar").width()-100) / 5;
    $(".class").width(width-2);
    $(".placeholder").width(width);
    $("#now").width(width);
    showNow();
}

function todaySchedule(date) {
    var today = [];
    for (var i = 0 ; i < scheduleInfo.length ; i++) {
        for (var j = 0 ; j < scheduleInfo[i][1].length ; j++) {
            for (var k = 0 ; k < scheduleInfo[i][1][j][1].length ; k++) {
                var thisInfo = scheduleInfo[i][1][j][1][k];
                if (sameDOW(date,thisInfo[0][0])&&isInRange(date,thisInfo[2])) {
                    today.push([thisInfo[0],thisInfo[1],scheduleInfo[i][0],scheduleInfo[i][1][j][0]]);
                }
            }
        }
    }
    today.sort(sort_by_date);
    return today;
}

/* used to add a timeslot somewhere, not used yet
function add(dayOfW,startT,endT,room,teacher,startD,endD,courseCode,courseInfo,type) {
    info.push([[[dayOfW,startT,endT],room,teacher,[startD,endD],[courseCode,courseInfo],type]])
}*/

function sameDOW(date,DOW) { //same day of week
    var dayOfWeek = (new Date(date)).getDay();
    var day = -1;
    switch(dayOfWeek) {
        case 1:
            day = "M";
            break;
        case 2:
            day = "T";
            break;
        case 3:
            day = "W";
            break;
        case 4:
            day = "Th";
            break;
        case 5:
            day = "F";
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

function sort_by_date(a,b) {
    if (a[0][1] < b[0][1]) return -1;
    if (a[0][1] > b[0][1]) return 1;
    return 0;
}