var currentBlock;   //holds current block type, as well as if block or going to be blocked
var blockId = "chromeTools_block";
var fullWait = false;
var hidden = false;
var updateInfo;

var blockScreen = $("<div id='" + blockId + "'></div>");
$("body").append(blockScreen);

function prepare(type,info) {
    if (type === "time") {
        if (typeof timeLineInit === "undefined" || typeof keyPressInit === "undefined" || typeof iframe === "undefined") {
            console.log(type + " content script missing");
        } else {
            //check if other parts of this block are already made
            if (type !== currentBlock) {
                keyPressInit(blockScreen);
                timeLineInit(blockScreen,info);
                iframe(blockScreen,info.iframeUrls);
            } else {
                iframeUpdate(info.iframeUrls,info.delay);
            }
        }
    }
    currentBlock = type;
}

function block(type,info,callback) {
    //assuming this is run on chrome
    var full = document.webkitFullscreenElement;
    if (full) {
        //can't append to iframes, so just force close fullscreen
        if (full.tagName === "IFRAME") {
            document.webkitExitFullscreen();
        } else {
            blockScreen.detach().appendTo(full);
            //trigger resize event for blocking things
            $(window).trigger("resize");
            //don't make more than 1 listener
            if (!fullWait) {
                fullWait = true;
                $(document).one("webkitfullscreenchange",function() {
                    fullWait = false;
                    if (!hidden) {
                        blockScreen.detach().appendTo("body").focus();
                        //trigger resize event for blocking things
                        $(window).trigger("resize");
                    }
                });
            }
        }
    }
    if (type === "time") {
        if (typeof timeLineInit === "undefined" || typeof keyPressInit === "undefined" || typeof iframe === "undefined") {
            console.log(type + " content script missing");
        } else {
            //assume this has been prepared first
            timeLineUpdate(info);
        }
    } else {
        if (typeof scheduleInit === "undefined") {
            console.log(type + " content script missing");
        } else {
            if (type !== currentBlock) {
                scheduleInit(blockScreen);
            }
        }
    }
    currentBlock = type;
    blockScreen.addClass("display").focus();
    callback(true);
    return false;
}

function unblock() {
    $("#" + blockId).removeClass("display").blur();
    hidden = true;
}

//don't change name, need this as cannot directly use background functions
function weekSchedule(dates,callback) {
    sendRequest("weekSchedule",dates,callback);
}

chrome.runtime.onMessage.addListener(function listener(a, b, c) {
    switch (a.action) {
        case "prepare":
            prepare(a.type,a.info);
            break;
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