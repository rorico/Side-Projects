var now = new Date();
var startTime = 700;        //7AM
var endTime = 1900;         //7PM
var nowTimeOffset = 50;     //for showing now bar
var weekMode = false;

$( "#datepicker" ).datepicker({
    onSelect: function(dateText) {
        if (weekMode) {
            showWeek($( "#datepicker" ).datepicker("getDate"));
        } else {
            changeDate($( "#datepicker" ).datepicker("getDate"));
        }
    },
    dateFormat: "DD MM d, yy"
});
$( "#datepicker" ).datepicker("setDate", now);
showSchedule('#currentDay', now);

function showSchedule(container,date) {
    var today = todaySchedule(date);    //function in scheduleInfo.js
    now = new Date();
    if (sameDay(date,now)) {
        nowTimeOffset = 50 * !weekMode;
        $(container).prepend("<div id='nowHolder'><div id='now'></div></div>");
        showNow();
    }
    if (today.length==0) {
        $(container).append("<div class='class' style='height:599px'><p style='top:285px'>No Classes Today</p></div>");
    } else {
        
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
            if (weekMode) {
                html += classCode+" - "+classType+"<br />"+location;
            } else {
                html += classCode+" "+classInfo+" - "+classType+"<br />"+location;
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

function sameDay(day1,day2) {
    return day1.getDate()==day2.getDate()&&day1.getMonth()==day2.getMonth()&&day1.getYear()==day2.getYear();
}

function showNow() {
    if ($('#now').size()>0) {
        now = new Date();
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
    }
});

$('#showWeek').click(weekView);
$('#next').click(next);
$('#prev').click(prev);

function weekView() {
    var date = $( "#datepicker" ).datepicker("getDate");
    weekMode = !weekMode;
    if (weekMode) {
        $('#showWeek').val("Show Day");
        showWeek(date);
    } else {
        $('#showWeek').val("Show Week");
        changeDate(date);
    }
}

function next() {
    var date = $( "#datepicker" ).datepicker("getDate");
    if (weekMode) {
        date.setDate(date.getDate() + 7);
        showWeek(date);
    } else {
        date.setDate(date.getDate() + 1);
        changeDate(date);
    }
    $( "#datepicker" ).datepicker("setDate",date);
}

function prev() {
    var date = $( "#datepicker" ).datepicker("getDate");
    if (weekMode) {
        date.setDate(date.getDate() - 7);
        showWeek(date);
    } else {
        date.setDate(date.getDate() - 1);
        changeDate(date);
    }
    $( "#datepicker" ).datepicker("setDate",date);
}

function setToday() {
    now = new Date();
    $( "#datepicker" ).datepicker("setDate",now);
    if (weekMode) {
        showWeek(now);
    } else {
        changeDate(now);
    }
}

function changeDate(date) { //single day
    $('#container').empty();
    $('#container').append("<div id='currentDay' class='day'></div>");
    showSchedule("#currentDay",date);
}

function showWeek(date){
    $('#container').empty();
    var start = date.getDay()-1;
    date.setDate(date.getDate()-start);    //set to monday
    for (var i = 0 ; i<5 ; i++){
        $('#container').append("<div id='D"+i+"' class='day'></div>");
        showSchedule('#D'+i, date);
        date.setDate(date.getDate()+1);
    }
    var length = $('#calendar').width();
    $('.class').width((length-100)/5-2);
    $('.placeholder').width((length-100)/5);
    $('#now').width((length-100)/5);
    showNow();
}