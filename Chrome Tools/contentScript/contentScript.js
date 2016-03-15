var inputMode = false;
var inputBufferTime = 10000;
var inputStartTime = new Date() - inputBufferTime;
var deletes = false;

var time = new Date() - 1000;
var currentTimer = "5";
function changeTimer(digit) {
    var now = new Date();
    if (now-time<1000) {
        currentTimer += digit.toFixed(0);
    } else {
        currentTimer = digit;
    }
    time = new Date();
}
$(window).keydown(function(e) {
    switch (e.keyCode) {
        case 83:        //s
            sendRequest("setAlarm",+currentTimer); //cast to int
            break;
        case 68:        //d
            deletes = true;
            break;
        case 65:        //a
            sendRequest("stopAlarm");
            break;
        case 88:        //x
            sendRequest("snooze");
            break;
        case 81:        //q
            if(e.altKey){
                inputStartTime = new Date();                    //turn on input
            } else {
                sendRequest("setAlarm",5);
            }
            break;
        case 87:        //w
            if(e.altKey){
                inputStartTime = new Date() - inputBufferTime;  //turn off input
            } else {
                sendRequest("setAlarm",15);
            }
            break;
        case 69:        //e
            sendRequest("setAlarm",30);
            break;
        case 82:        //r
            if(e.altKey){
                window.open(chrome.extension.getURL("/SchedulePage/Schedule.html"));
            } else {
                sendRequest("setAlarm",60);
            }
            break;
        case 48:        //0
        case 49:        //1
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:        //5
            i = e.keyCode-49;
            if (deletes) {
                sendRequest("removeAlarm",i);
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
            i = e.keyCode-49;
            if (deletes) {
                sendRequest("removeAlarm",i);
                break;
            }
        case 102:        //6
        case 103:
        case 104:
        case 105:
            changeTimer(e.keyCode-96);
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
    if (new Date() - inputStartTime < inputBufferTime){
        chrome.runtime.sendMessage({
            action: action,
            input: input
        });
    }
}