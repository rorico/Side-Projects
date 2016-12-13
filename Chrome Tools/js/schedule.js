var scheduleInit = (function() {

    var now = new Date();
    var startTime = 7 * 60;        //7AM
    var endTime = 19 * 60;         //7PM
    var nowTimeOffset = 50;     //for showing now bar
    var pxPerHr = 50;
    var weekMode = false;
    var offset = 0;
    var nowTimer = -1;
    return scheduleInit;

    function scheduleInit(container) {
        //accepts jquery object
        var header = "<div id='header'>" + 
                        "<input type='button' value='Prev' id='prev'>\n" + 
                        "<input type='text' id='datepicker'>\n" + 
                        "<input type='button' value='Next' id='next'>\n" + 
                        "<input type='button' value='Show Week' id='showWeek'>" + 
                        "</div>";

        var side = "<div class='timeline'>";
        var right1 = "<div class='timeline right'>";
        var right2 = "<div class='timeline right'>";
        for (var i = startTime ; i < endTime ; i += 60) {
            side += "<div class='timeslotBorder'></div>";
            right1 += "<div class='timeslotBorder'></div>";
            right2 += "<div class='half timeslotBorder'></div><div class='half halftimeslotBorder'></div>";
        }
        side += "<div class='bottom'></div></div>";
        right1 += "<div class='bottom'></div></div>";
        right2 += "<div class='bottom'></div></div>";

        var mid = "<div class='timeline number'><div class='half timeslotBorder'></div>";
        for (var i = (startTime/60) + 1 ; i < (endTime/60) ; i++) {
            mid += "<div>" + (i > 12 ? i - 12 : i) + "</div>";
        }
        mid += "<div class='half'></div><div class='bottom'></div></div>";

        var contain = "<div id='container'><div id='currentDay' class='day'></div></div>";
        var holder = "<div id='holder'>" + side + mid + right1 + right2 + contain + "</div>";

        var html = "<div id='chromeTools_calendar'>" + header + holder + "</div>";
        container.html(html);

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

        $("#showWeek").click(weekView);
        $("#next").click(next);
        $("#prev").click(prev);

        $("#datepicker").datepicker({
            onSelect: function(dateText) {
                if (weekMode) {
                    showWeek($("#datepicker").datepicker("getDate"));
                } else {
                    changeDate($("#datepicker").datepicker("getDate"));
                }
            },
            dateFormat: "DD MM d, yy"
        }).datepicker("setDate", now).datepicker("widget").detach().appendTo(container);
        //normally the widget is outside container, move inside

        changeDate(now);
    }

    function changeDate(date) { //single day
        showSchedule("#currentDay",[+date]);
    }

    function showWeek(date) {
        var dates = [];
        var start = date.getDay() - 1;
        date.setDate(date.getDate() - start);    //set to monday
        for (var i = 0 ; i<5 ; i++) {
            date.setDate(date.getDate() + 1);
            dates.push(+date);
        }
        showSchedule("#container", dates);
    }

    function showSchedule(container,dates) {
        weekSchedule(dates,function(info) {     //function set outside
            var all = $("<div></div>");
            now = new Date();
            for (var j = 0 ; j < dates.length ; j++) {
                var today = info[j];    //probably not the best variable name
                var holder = $("<div class='day'></div>");
                if (sameDay(dates[j],now)) {
                    nowTimeOffset = 50 * !weekMode;
                    holder.prepend("<div id='nowHolder'><div id='now'></div></div>");
                    clearTimeout(nowTimer);
                    showNow();
                }
                if (!today.length) {
                    addTimeSlot(holder,"placeholder placeborder",endTime - startTime,["No Classes Today"]);
                    addTimeSlot(holder,"placeholder placeborder",1);
                } else {
                    addPlaceholder(holder,startTime,today[0][0][1]);
                    for (var i = 0 ; i < today.length ; i++) {
                        var start = today[i][0][1];
                        var finish = today[i][0][2];
                        var classType = today[i][3];
                        var classCode = today[i][2][0];
                        var className = today[i][2][1];
                        var location = today[i][1];

                        var height = finish - start;
                        var classInfo = [classCode + (weekMode ? "" : " " + className) + " - " + classType, location];
                        addTimeSlot(holder,"class " + classType,height,classInfo);

                        var beginning = finish;
                        var end = (i === today.length - 1 ? endTime : today[i+1][0][1]);
                        addPlaceholder(holder,beginning,end);
                    }
                    addTimeSlot(holder,"placeholder placeborder",0);
                }
                all.append(holder).append("<div id='side'></div>");
            }
            $(container).html(all);
            if (weekMode) {
                var width = Math.floor(($("#chromeTools_calendar").width() - 100) / dates.length);
                $(".class").outerWidth(width);
                $(".placeholder").outerWidth(width);
                $("#now").outerWidth(width);
                clearTimeout(nowTimer);
                showNow();
            }
        });
    }

    function addPlaceholder(container,start,end) {
        while (start < end) {
            var nextHour = Math.floor((start + 60)/60) * 60;
            var next = nextHour < end ? nextHour : end;
            var length = next - start;
            var cls = "placeholder";
            if (start % 60 === 0) {
                cls += " placeborder";
            }
            addTimeSlot(container,cls,length);
            start += length;
        }
    }

    function addTimeSlot(container,classType,time,content) {
        //do no need to account for border as using box-sizing:border-box
        var height = time/(60/pxPerHr);
        var thisHeight = height + offset;
        offset = thisHeight % 1;
        thisHeight = Math.floor(thisHeight);

        var thisContent = "";
        if (content && content.length) {
            thisContent = "<p style='top:" + (thisHeight - 15.2 * content.length)/2 + "px'>" + content.join("<br />") + "</p>";
        }
        container.append("<div class='" + classType + "' style='height:" + thisHeight + "px'>" + thisContent + "</div>");
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

    function weekView() {
        var date = $("#datepicker").datepicker("getDate");
        weekMode = !weekMode;
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
})();