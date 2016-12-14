function block(type,info) {
	var blockScreen = $("<div id='chromeTools_block'></div>");
	$("body").append(blockScreen);
	if (type === "time") {
		timeLineInit(blockScreen,info);
		keyPressInit(blockScreen,keyPhrases);
	} else {
		scheduleInit(blockScreen);	
	}
}

function unblock() {
	$("#chromeTools_block").remove();
}

//don't change name, need this as cannot directly use background functions
function weekSchedule(dates,callback) {
	sendRequest("weekSchedule",dates,callback);
}

chrome.runtime.onMessage.addListener(function listener(a, b, c) {
	console.log(a,b,c);
    if (a.action === "block") {
        block(a.type,a.info);
    } else if (a.action === "unblock") {
        unblock();
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