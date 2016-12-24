var currentBlock;
var blockId = "chromeTools_block";

function block(type,info) {
    var blockScreen;
    if (currentBlock) {
        if (type !== currentBlock) {
            blockScreen = $("#" + blockId).empty();
            blockType(blockScreen,type,info);
        }
    } else {
        blockScreen = $("<div id='" + blockId + "'></div>");
        $("body").append(blockScreen);
        blockType(blockScreen,type,info);
    }
}

//only helper function for block
function blockType(blockScreen,type,info) {
    if (type === "time") {
        if (typeof timeLineInit === "undefined" || typeof keyPressInit === "undefined") {
            console.log(type + " content script missing");
        } else {
            timeLineInit(blockScreen,info);
            keyPressInit(blockScreen,keyPhrases);
        }
    } else {
        if (typeof scheduleInit === "undefined") {
            console.log(type + " content script missing");
        } else {
            scheduleInit(blockScreen);
        }
    }
    currentBlock = type;
}

function unblock() {
    $("#" + blockId).remove();
    currentBlock = "";
}

//don't change name, need this as cannot directly use background functions
function weekSchedule(dates,callback) {
    sendRequest("weekSchedule",dates,callback);
}

chrome.runtime.onMessage.addListener(function listener(a, b, c) {
    console.log(a,b,c);
    switch (a.action) {
        case "block":
            block(a.type,a.info);
            break;
        case "unblock":
            unblock();
            break;
        case "ping":
            var blockTypes = {
                time:typeof timeLineInit !== "undefined",
                schedule:typeof scheduleInit !== "undefined"
            };
            c(blockTypes);
            break;
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