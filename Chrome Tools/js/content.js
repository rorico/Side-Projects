var currentBlock;   //holds current block type, as well as if block or going to be blocked
var blockId = "chromeTools_block";

function block(type,info,callback) {
    var blockScreen;
    if (currentBlock) {
        if (type !== currentBlock) {
            blockScreen = $("#" + blockId).empty();
        }
    } else {
        blockScreen = $("<div id='" + blockId + "'></div>");
        $("body").append(blockScreen);
    }
    return blockScreen ? blockType(blockScreen,type,info,callback) : false;
}

//only helper function for block
function blockType(blockScreen,type,info,callback) {
    currentBlock = type;
    var funct = function() {
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
    };

    var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    if (isFullScreen) {
        $(document).one("webkitfullscreenchange mozfullscreenchange fullscreenchange",function() {
            if (currentBlock) {
                callback(true);
                funct();
            } else {
                //probably means that page was unblocked
                callback(false);
            }
        });
        return true;
    } else {
        funct();
        return false;
    }
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
    switch (a.action) {
        case "block":
            return block(a.type,a.info,c);
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