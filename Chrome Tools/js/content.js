console.log("created");
var blockScreen = $("<div id='chromeTools_block'></div>");
function block() {
	$("body").append(blockScreen);
	scheduleInit(blockScreen);
}

//don't change name, need this as cannot directly use background functions
function weekSchedule(dates,callback) {
	sendRequest("weekSchedule",dates,callback);
}

chrome.runtime.onMessage.addListener(function listener(a, b, c) {
    if (a.action === "block") {
        block();
    } else if (a.action === "unblock") {
        blockScreen.remove();
    }
});

//send requests to background
function sendRequest(action,input,callback) {
    chrome.runtime.sendMessage({
        from: "content",
        action: action,
        input: input
    },callback);
}