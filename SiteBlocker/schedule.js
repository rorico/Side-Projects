var test;
var alarms = [false,false,false,false,false];
var audio = new Audio('alarm.mp3');
var playAlarmCheck = false;

chrome.runtime.getBackgroundPage(function (backgroundPage) {
    test = backgroundPage;
    console.log(test);
    alarms = test.alarms;
    alarmTimes = test.alarmTimes;
    for (var i = 0 ; i < alarms.length ; i++) {
        if (alarms[i]) {
            showAlarm(alarmTimes[i],i);
        }
    }
});
function setTimer() {
    var delay = parseInt($('#setTimer').val());
    setAlarm(delay);
}

function setAlarm(delay) {
    
    var current = -1;
    for (var i = 0 ; i<alarms.length ;i++) {
        if (alarms[i]===false) {
            current = i;
            break;
        }
    }
    
    if (current!==-1) {
        var alarmTime = new Date();
        alarmTime.setMinutes(alarmTime.getMinutes()+delay);
        showAlarm(alarmTime,current,delay);
        var alarm = setTimeout(function(){
            alarms[current] = true;
            playAlarmCheck = true;
            playAlarm();
        },delay*60000);
        alarms[current] = alarm;
    }
}

function showAlarm(date,index) {
    var time = getTime(date);
    $('#alarm'+(index+1)).html("Alarm at "+time);
    $('#alarm'+(index+1)).parent().removeClass("notSet");
}

function removeAlarm(alarmNumber) {
    if (alarms[alarmNumber]!==false) {
        clearTimeout(alarms[alarmNumber]);
        alarms[alarmNumber] = false;
        $('#alarm'+(alarmNumber+1)).html("Not Set");
        $('#alarm'+(alarmNumber+1)).parent().addClass("notSet");
    }
}

function playAlarm() {
    setInterval(function(){
        if (playAlarmCheck) {
            audio.play();
        }
    },3000);
}

function getTime(date) {
    var hours = date.getHours();
    var suffix = " AM";
    if (hours>=13) {
        hours-=12;
        suffix = " PM";
    } else if (hours===12) {
        suffix = " PM";
    } else if (hours===0) {
        hours = 12;
    }
    var time = hours + ":" + ('0'+date.getMinutes()).slice(-2) + ":" + ('0'+date.getSeconds()).slice(-2) + suffix;
    return time;
}

function stopAlarm() {
    if (playAlarmCheck) {
        for (var i = 0 ; i<alarms.length ; i++) {
            if (alarms[i]===true) {
                removeAlarm(i);
            }
        }
        playAlarmCheck = false;
        audio.pause();
        audio.currentTime = 0;
    }
}

function snooze() {
    if (playAlarmCheck) {
        stopAlarm();
        setAlarm(5);
    }
}
$(window).keydown(function(e) {
    if (e.keyCode == 38) { //up key
        changeTime(1);
    } else if (e.keyCode == 40) { //down key
        changeTime(-1);
    }
});
function changeTime(change) {
    delay = parseInt($('#setTimer').val());
    if (change>0 || delay>0) {
        $('#setTimer').val(delay+change);
    }
}
var deletes = false;
var deleteCheck = [false,false,false,false,false,false];
$(window).keypress(function(e) {
    switch (e.keyCode) {
        case 110:        //n
            setToday();
            break;
        case 109:        //m
            weekView();
            break;
        case 44:        //,
            prev();
            break;
        case 46:        //.
            next();
            break;
        case 115:        //s
            setTimer();
            break;
        case 100:        //d
            deletes = true;
            break;
        case 97:        //a
            stopAlarm();
            break;
        case 120:        //x
            snooze();
            break;
        case 113:        //q
            setAlarm(5);
            break;
        case 119:        //w
            setAlarm(15);
            break;
        case 101:        //e
            setAlarm(30);
            break;
        case 114:        //r
            setAlarm(60);
            break;
        case 49:        //1
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:        //6
            i = e.keyCode-49;
            if (deletes && !deleteCheck[i]) {
                deleteCheck[i] = true;
                removeAlarm(i);
                break;
            }
        case 56:
        case 57:
        case 58:
        case 48://0
            changeTimer(e.keyCode-48);
            break;
        case 96:        //keypad 0
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:        //6
            i = e.keyCode-49;
            if (deletes && !deleteCheck[i]) {
                deleteCheck[i] = true;
                removeAlarm(i);
                break;
            }
        case 103:
        case 104:
        case 105:
            changeTimer(e.keyCode-96);
            break;
        
    }
});
$(window).keyup(function(e) {
    if(e.keyCode>=49 && e.keyCode<=55){
        deleteCheck[e.keyCode-49] = false;
    } else if (e.keyCode===68) {
        deletes = false;
    }
});
time = new Date();
currentTimer = "";
function changeTimer(digit) {
    now = new Date();
    if (now.getTime()-time.getTime()<1000) {
        currentTimer += digit.toFixed(0);
        $('#setTimer').val(currentTimer);
    } else {
        currentTimer = digit;
        $('#setTimer').val(currentTimer);
    }
    time = new Date();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
var dayToday = new Date();
var nowTimeOffset = 50;
var info = [[[["Th",1650,1733.3333333333333],"QNC 1502","Adam Neale",[new Date("Thu Jan 07 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 200A","- ECE Practice"],"SEM"]],[[["M",1350,1533.3333333333333],"CPH 1346","Oleg Michailovich",[new Date("Mon Jan 04 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 204A","- Numerical Methods 1"],"LAB"]],[[["M",950,1033.3333333333333],"MC 4020","Shahla Ali Akbari",[new Date("Mon Jan 04 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 205","- Adv Calculus (Elec.&Comp.Eng.)"],"LEC"],[["TTh",1050,1133.3333333333333],"MC 4020","Shahla Ali Akbari",[new Date("Tue Jan 05 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 205","- Adv Calculus (Elec.&Comp.Eng.)"],"LEC"],[["Th",1150,1233.3333333333333],"MC 4020","Shahla Ali Akbari",[new Date("Thu Jan 07 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Jan 07 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 205","- Adv Calculus (Elec.&Comp.Eng.)"],"LEC"],[["Th",1150,1233.3333333333333],"MC 4020","Shahla Ali Akbari",[new Date("Thu Jan 21 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Jan 21 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 205","- Adv Calculus (Elec.&Comp.Eng.)"],"LEC"],[["Th",1150,1233.3333333333333],"MC 4020","Shahla Ali Akbari",[new Date("Thu Feb 04 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Feb 04 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 205","- Adv Calculus (Elec.&Comp.Eng.)"],"LEC"],[["Th",1150,1233.3333333333333],"MC 4020","Shahla Ali Akbari",[new Date("Thu Feb 25 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Feb 25 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 205","- Adv Calculus (Elec.&Comp.Eng.)"],"LEC"],[["Th",1150,1233.3333333333333],"MC 4020","Shahla Ali Akbari",[new Date("Thu Mar 10 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Mar 10 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 205","- Adv Calculus (Elec.&Comp.Eng.)"],"LEC"],[["Th",1150,1233.3333333333333],"MC 4020","Shahla Ali Akbari",[new Date("Thu Mar 24 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Thu Mar 24 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 205","- Adv Calculus (Elec.&Comp.Eng.)"],"LEC"],[["W",1650,1733.3333333333333],"QNC 1502","Staff",[new Date("Wed Jan 06 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 205","- Adv Calculus (Elec.&Comp.Eng.)"],"TUT"]],[[["TWTh",950,1033.3333333333333],"MC 4020","Gordon Agnew",[new Date("Mon Jan 04 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 222","- Digital Computers"],"LEC"],[["Th",1150,1233.3333333333333],"MC 4020","Gordon Agnew",[new Date("Thu Jan 14 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Jan 14 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 222","- Digital Computers"],"LEC"],[["Th",1150,1233.3333333333333],"MC 4020","Gordon Agnew",[new Date("Thu Jan 28 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Jan 28 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 222","- Digital Computers"],"LEC"],[["Th",1150,1233.3333333333333],"MC 4020","Gordon Agnew",[new Date("Thu Feb 11 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Feb 11 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 222","- Digital Computers"],"LEC"],[["Th",1150,1233.3333333333333],"MC 4020","Gordon Agnew",[new Date("Thu Mar 03 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Mar 03 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 222","- Digital Computers"],"LEC"],[["Th",1150,1233.3333333333333],"MC 4020","Gordon Agnew",[new Date("Thu Mar 17 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Thu Mar 17 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 222","- Digital Computers"],"LEC"],[["Th",1150,1233.3333333333333],"MC 4020","Gordon Agnew",[new Date("Thu Mar 31 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Thu Mar 31 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 222","- Digital Computers"],"LEC"],[["T",1750,1833.3333333333333],"QNC 1502","Staff",[new Date("Tue Jan 05 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 222","- Digital Computers"],"TUT"],[["Th",1350,1633.3333333333333],"E2 2363","Staff",[new Date("Thu Jan 14 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Jan 14 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 222","- Digital Computers"],"LAB"],[["Th",1350,1633.3333333333333],"E2 2363","Staff",[new Date("Thu Jan 28 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Jan 28 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 222","- Digital Computers"],"LAB"],[["Th",1350,1633.3333333333333],"E2 2363","Staff",[new Date("Thu Feb 11 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Feb 11 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 222","- Digital Computers"],"LAB"],[["Th",1350,1633.3333333333333],"E2 2363","Staff",[new Date("Thu Mar 03 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Thu Mar 03 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 222","- Digital Computers"],"LAB"],[["Th",1350,1633.3333333333333],"E2 2363","Staff",[new Date("Thu Mar 17 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Thu Mar 17 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 222","- Digital Computers"],"LAB"],[["Th",1350,1633.3333333333333],"E2 2363","Staff",[new Date("Thu Mar 31 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Thu Mar 31 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 222","- Digital Computers"],"LAB"]],[[["TWTh",850,933.3333333333334],"MC 4020","David Nairn",[new Date("Mon Jan 04 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 240","- Electronic Circuits 1"],"LEC"],[["T",1650,1733.3333333333333],"QNC 1502","David Nairn",[new Date("Tue Jan 12 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Jan 12 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 240","- Electronic Circuits 1"],"LEC"],[["T",1650,1733.3333333333333],"QNC 1502","David Nairn",[new Date("Tue Jan 26 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Jan 26 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 240","- Electronic Circuits 1"],"LEC"],[["T",1650,1733.3333333333333],"QNC 1502","David Nairn",[new Date("Tue Feb 09 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Feb 09 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 240","- Electronic Circuits 1"],"LEC"],[["T",1650,1733.3333333333333],"QNC 1502","David Nairn",[new Date("Tue Mar 01 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Mar 01 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 240","- Electronic Circuits 1"],"LEC"],[["T",1650,1733.3333333333333],"QNC 1502","David Nairn",[new Date("Tue Mar 15 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Tue Mar 15 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 240","- Electronic Circuits 1"],"LEC"],[["T",1650,1733.3333333333333],"QNC 1502","David Nairn",[new Date("Tue Mar 29 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Tue Mar 29 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 240","- Electronic Circuits 1"],"LEC"],[["M",1550,1633.3333333333333],"QNC 1502","Staff",[new Date("Mon Jan 04 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 240","- Electronic Circuits 1"],"TUT"],[["W",1350,1633.3333333333333],"E2 3344","Staff",[new Date("Wed Jan 13 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Wed Jan 13 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 240","- Electronic Circuits 1"],"LAB"],[["W",1350,1633.3333333333333],"E2 3344","Staff",[new Date("Wed Jan 27 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Wed Jan 27 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 240","- Electronic Circuits 1"],"LAB"],[["W",1350,1633.3333333333333],"E2 3344","Staff",[new Date("Wed Feb 10 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Wed Feb 10 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 240","- Electronic Circuits 1"],"LAB"],[["W",1350,1633.3333333333333],"E2 3344","Staff",[new Date("Wed Mar 02 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Wed Mar 02 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 240","- Electronic Circuits 1"],"LAB"],[["W",1350,1633.3333333333333],"E2 3344","Staff",[new Date("Wed Mar 16 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Wed Mar 16 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 240","- Electronic Circuits 1"],"LAB"],[["W",1350,1633.3333333333333],"E2 3344","Staff",[new Date("Wed Mar 30 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Wed Mar 30 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 240","- Electronic Circuits 1"],"LAB"]],[[["MWF",1050,1133.3333333333333],"MC 4020","Ladan Tahvildari",[new Date("Mon Jan 04 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 250","- Algorithms & Data Structures"],"LEC"],[["T",1150,1233.3333333333333],"MC 4020","Ladan Tahvildari",[new Date("Tue Jan 05 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Jan 05 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 250","- Algorithms & Data Structures"],"LEC"],[["T",1150,1233.3333333333333],"MC 4020","Ladan Tahvildari",[new Date("Tue Jan 19 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Jan 19 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 250","- Algorithms & Data Structures"],"LEC"],[["T",1150,1233.3333333333333],"MC 4020","Ladan Tahvildari",[new Date("Tue Feb 02 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Feb 02 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 250","- Algorithms & Data Structures"],"LEC"],[["T",1150,1233.3333333333333],"MC 4020","Ladan Tahvildari",[new Date("Tue Feb 23 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Feb 23 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 250","- Algorithms & Data Structures"],"LEC"],[["T",1150,1233.3333333333333],"MC 4020","Ladan Tahvildari",[new Date("Tue Mar 08 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Mar 08 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 250","- Algorithms & Data Structures"],"LEC"],[["T",1150,1233.3333333333333],"MC 4020","Ladan Tahvildari",[new Date("Tue Mar 22 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Tue Mar 22 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 250","- Algorithms & Data Structures"],"LEC"],[["M",1650,1733.3333333333333],"QNC 1502","Staff",[new Date("Mon Jan 04 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 250","- Algorithms & Data Structures"],"TUT"],[["T",1350,1633.3333333333333],"RCH 108","Staff",[new Date("Tue Jan 12 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Jan 12 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 250","- Algorithms & Data Structures"],"LAB"],[["T",1350,1633.3333333333333],"RCH 108","Staff",[new Date("Tue Jan 26 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Jan 26 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 250","- Algorithms & Data Structures"],"LAB"],[["T",1350,1633.3333333333333],"RCH 108","Staff",[new Date("Tue Feb 09 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Feb 09 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 250","- Algorithms & Data Structures"],"LAB"],[["T",1350,1633.3333333333333],"RCH 108","Staff",[new Date("Tue Mar 01 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Mar 01 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 250","- Algorithms & Data Structures"],"LAB"],[["T",1350,1633.3333333333333],"RCH 108","Staff",[new Date("Tue Mar 15 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Tue Mar 15 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 250","- Algorithms & Data Structures"],"LAB"],[["T",1350,1633.3333333333333],"RCH 108","Staff",[new Date("Tue Mar 29 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Tue Mar 29 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 250","- Algorithms & Data Structures"],"LAB"]],[[["MF",850,933.3333333333334],"MC 4020","Karim Karim",[new Date("Mon Jan 04 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 290","- Eng Profession, Ethics, Law"],"LEC"],[["F",950,1033.3333333333333],"MC 4020","Karim Karim",[new Date("Mon Jan 04 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 290","- Eng Profession, Ethics, Law"],"LEC"],[["T",1150,1233.3333333333333],"MC 4020","Karim Karim",[new Date("Tue Jan 12 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Jan 12 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 290","- Eng Profession, Ethics, Law"],"LEC"],[["T",1150,1233.3333333333333],"MC 4020","Karim Karim",[new Date("Tue Jan 26 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Jan 26 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 290","- Eng Profession, Ethics, Law"],"LEC"],[["T",1150,1233.3333333333333],"MC 4020","Karim Karim",[new Date("Tue Feb 09 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Feb 09 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 290","- Eng Profession, Ethics, Law"],"LEC"],[["T",1150,1233.3333333333333],"MC 4020","Karim Karim",[new Date("Tue Mar 01 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Mar 01 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["ECE 290","- Eng Profession, Ethics, Law"],"LEC"],[["T",1150,1233.3333333333333],"MC 4020","Karim Karim",[new Date("Tue Mar 15 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Tue Mar 15 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 290","- Eng Profession, Ethics, Law"],"LEC"],[["T",1150,1233.3333333333333],"MC 4020","Karim Karim",[new Date("Tue Mar 29 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Tue Mar 29 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 290","- Eng Profession, Ethics, Law"],"LEC"],[["F",1550,1633.3333333333333],"E5 5106","Staff",[new Date("Fri Jan 08 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["ECE 290","- Eng Profession, Ethics, Law"],"TUT"]],[[["MWF",1150,1233.3333333333333],"MC 4020","Ryan Trelford",[new Date("Mon Jan 04 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["MATH 215","- Linear Alg for Engineering"],"LEC"],[["T",1650,1733.3333333333333],"QNC 1502","Ryan Trelford",[new Date("Tue Jan 05 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Jan 05 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["MATH 215","- Linear Alg for Engineering"],"LEC"],[["T",1650,1733.3333333333333],"QNC 1502","Ryan Trelford",[new Date("Tue Jan 19 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Jan 19 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["MATH 215","- Linear Alg for Engineering"],"LEC"],[["T",1650,1733.3333333333333],"QNC 1502","Ryan Trelford",[new Date("Tue Feb 02 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Feb 02 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["MATH 215","- Linear Alg for Engineering"],"LEC"],[["T",1650,1733.3333333333333],"QNC 1502","Ryan Trelford",[new Date("Tue Feb 23 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Feb 23 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["MATH 215","- Linear Alg for Engineering"],"LEC"],[["T",1650,1733.3333333333333],"QNC 1502","Ryan Trelford",[new Date("Tue Mar 08 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Tue Mar 08 2016 23:59:59 GMT-0500 (Eastern Standard Time)")],["MATH 215","- Linear Alg for Engineering"],"LEC"],[["T",1650,1733.3333333333333],"QNC 1502","Ryan Trelford",[new Date("Tue Mar 22 2016 00:00:00 GMT-0400 (Eastern Daylight Time)"),new Date("Tue Mar 22 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["MATH 215","- Linear Alg for Engineering"],"LEC"],[["M",1750,1833.3333333333333],"QNC 1502","Ryan Trelford",[new Date("Mon Jan 04 2016 00:00:00 GMT-0500 (Eastern Standard Time)"),new Date("Mon Apr 04 2016 23:59:59 GMT-0400 (Eastern Daylight Time)")],["MATH 215","- Linear Alg for Engineering"],"TUT"]],[]];
var startTime = 700; //7AM
var endTime = 1900; //7PM
//get info from parseScheduleData.html

$(function() {
    $( "#datepicker" ).datepicker({
        onSelect: function(dateText) {
            if ($('#button').val()=="Show Week") {
                changeDate($( "#datepicker" ).datepicker("getDate"));
            } else {
                showWeek($( "#datepicker" ).datepicker("getDate"));
            }
        },
        dateFormat: "DD MM d, yy"
    });
    $( "#datepicker" ).datepicker("setDate", new Date());
    //scheduleChanges();
    showSchedule('#currentDay', new Date(),true);
});
function weekView() {
    var date = $( "#datepicker" ).datepicker("getDate");
    if ($('#button').val()=="Show Week") {
        $('#button').val("Show Day");
        showWeek(date);
    } else {
        $('#button').val("Show Week");
        changeDate(date);
    }
}
function next() {
    var date = $( "#datepicker" ).datepicker("getDate");
    if ($('#button').val()=="Show Week") {
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
    if ($('#button').val()=="Show Week") {
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
    if ($('#button').val()=="Show Week") {
        changeDate(date);
    } else {
        showWeek(date);
    }
}

function scheduleChanges() {
}

function add(dayOfW,startT,endT,room,teacher,startD,endD,courseCode,courseInfo,type) {
    info.push([[[dayOfW,startT,endT],room,teacher,[startD,endD],[courseCode,courseInfo],type]])
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
            /*setTimeout(function(){
                showNow();
            },delay*1000+(6-now.getHours())*3600000+(59-now.getMinutes)*60000);
            return;*/
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
        checkAlarm(now);
        setTimeout(function(){
            showNow();
        },delay*1000);
    }
}
function checkAlarm(now) {
    if (now.getHours()>=22 || now.getHours()<=2) {
        if (now.getMinutes() % 30 === 0) {
            playAlarmCheck = true;
            playAlarm();
        }
    }
}