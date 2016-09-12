var scheduleInfo;
var date = new Date();
var today;
setScheduleInfo();
function setScheduleInfo() {
    chrome.storage.sync.get("scheduleInfo", function(items) {
        if (items.scheduleInfo) {
            scheduleInfo = items.scheduleInfo;
            today = todaySchedule(date);
        } else {
            scheduleInfo = [];
            today = [];
        }
    });
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