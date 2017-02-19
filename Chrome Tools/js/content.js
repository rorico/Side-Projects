var currentBlock;   //holds current block type, as well as if block or going to be blocked
var blockId = "chromeTools_block";
var fullWait = false;

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
    if (blockScreen) {
        //assuming this is run on chrome
        var full = document.webkitFullscreenElement;
        if (full) {
            //can't append to iframes, so just force close fullscreen
            if (full.tagName === "IFRAME") {
                document.webkitExitFullscreen();
            } else {
                blockScreen.detach().appendTo(full);
                //don't make more than 1 listener
                if (!fullWait) {
                    fullWait = true;
                    $(document).one("webkitfullscreenchange",function() {
                        fullWait = false;
                        if (currentBlock) {
                            blockScreen.detach().appendTo("body").focus();
                            if (currentBlock === "time") {
                                timeLineResize();
                            }
                        }
                    });
                }
            }
        }
        return blockType(blockScreen,type,info,callback);
    }
    return false;
}

//only helper function for block
function blockType(blockScreen,type,info,callback) {
    currentBlock = type;
    if (type === "time") {
        if (typeof timeLineInit === "undefined" || typeof keyPressInit === "undefined") {
            console.log(type + " content script missing");
        } else {
            keyPressInit(blockScreen);
            timeLineInit(blockScreen,info);
        }
    } else {
        if (typeof scheduleInit === "undefined") {
            console.log(type + " content script missing");
        } else {
            scheduleInit(blockScreen);
        }
    }

    callback(true);
    return false;
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