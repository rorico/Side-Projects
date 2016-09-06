$("#convert").click(function() {
    var info = $('#input').val();
    //note, cannot store date objects, so convert to timestamp
    chrome.storage.sync.set({'scheduleInfo': parseData(info)});
    //reset input
    $('#input').val("");
});

function parseData(text) {
    var info = [];
    var beginning = "University of Waterloo";
    var end = "Printer Friendly Page";
    var classTypes = ["SEM","TUT","LAB","LEC"];
    var content = text.substring(text.indexOf(beginning) + beginning.length,text.indexOf(end));
    var courses = content.split("Exam Information");
    for (var i = 0 ; i < courses.length ; i++) {
        var courseInfo = [];
        var lines = courses[i].split("\n");
        var courseName=[];
        var type = "";
        for (var j = 0 ; j < lines.length ; j++) {
            var line = lines[j];
            if (/^[A-Z].+$/.test(line)) {
                var courseParts = line.split(" ");
                var courseCode = courseParts[0] + " " + courseParts[1];
                var courseDescription = "";
                for (var word = 2 ; word < courseParts.length - 1 ; word++) {
                    courseDescription += courseParts[word]+" ";
                }
                courseDescription += courseParts[courseParts.length - 1];
                courseName = [courseCode,courseDescription];
                break;
            }
        }
        for (var j = 0 ; j < lines.length ; j++) {
            for (var k = 0 ; k < classTypes.length ; k++) {
                if (lines[j] == classTypes[k]) {
                    type = classTypes[k];
                    break;
                }
            }
            if (/^[MTWTFh]{1,6} \d{1,2}:.+$/.test(lines[j])) {
                courseInfo.push([getClassLength(lines[j]),lines[j+1],lines[j+2],parseDate(lines[j+3]),courseName,type]);
                j+=4;
            }
        }
        info.push(courseInfo);
    }
    return info;
}

function parseDate(date) {
    var returnValues = [];
    var dates = date.split(" - ");
    for (var i = 0 ; i < dates.length ; i++) {
        var dateparts = dates[i].split("/");
        //MM/DD/YYYY
        if (i==1) {
            returnValues.push(+new Date(dateparts[2],dateparts[0]-1,dateparts[1],23,59,59,999));
        } else {
            returnValues.push(+new Date(dateparts[2],dateparts[0]-1,dateparts[1]));
        }
    }
    return returnValues;
}

function getClassLength(range) {
    var words = range.split(" ");
    var startValue = parseTime(words[1]);
    var endValue = parseTime(words[3]);
    return [words[0],startValue,endValue];
}

function parseTime(time) {
    var timeParts = time.split(":");
    var timeHour = timeParts[0];
    var timeValue = timeHour * 100;
    if (timeParts[1].indexOf("PM")>-1&&timeParts[0]!="12") {
        timeValue+=1200;
    }
    timeParts[1]=timeParts[1].slice(0,-2); //remove pm/am
    timeValue+=((timeParts[1])/(0.6));
    return timeValue;
}