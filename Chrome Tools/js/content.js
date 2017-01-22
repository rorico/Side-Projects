var currentBlock;
var blockId = "chromeTools_block";
var blockCallback;

function block(type,info) {
    var blockScreen;
    if (currentBlock) {
        if (type !== currentBlock) {
            blockScreen = $("#" + blockId).empty();
            return blockType(blockScreen,type,info);
        }
    } else {
        blockScreen = $("<div id='" + blockId + "'></div>");
        $("body").append(blockScreen);
        return blockType(blockScreen,type,info);
    }
    return false;
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
    var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    if (isFullScreen) {
        $(document).one("webkitfullscreenchange mozfullscreenchange fullscreenchange",function() {
            if (typeof blockCallback === "function") {
                blockCallback(true);
                blockCallback = undefined;
                //for keypress.js
                blockScreen.focus();
            }
        });
        return false;
    } else {
        return true;
    }
}

function unblock() {
    if (typeof blockCallback === "function") {
        blockCallback(false);
        blockCallback = undefined;
    }
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
            if (block(a.type,a.info)) {
                c(true);
            } else {
                blockCallback = c;
                return true;
            }
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