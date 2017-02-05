var p;
var ad;
var inAd;
youtubeNewPage();

function youtubeNewPage() {
    p = window.document.getElementsByTagName("video")[0];
    if (p) {
        p.onended = function() {
            if (inAd) {
                sendRequest("youtubeEnd");
            }
        }
    }
    inAd = false;
    ad = document.getElementsByClassName("videoAdUiSkipButton")[0];
    inAd = !!ad;
}

function skipAd() {
    if (inAd) {
        ad.click();
        inAd = false;
        return true;
    }
    return false;
}

function pause() {
    if (!p.paused) {
        p.pause();
        return true;
    }
    return false;
}

function play() {
    if (p.paused) {
        p.play();
        return true;
    }
    return false;
}

chrome.runtime.onMessage.addListener(function listener(a, b, c) {
    switch (a.action) {
        case "pause":
            c(pause());
            break;
        case "play":
            c(play());
            break;
        case "skipAd":
            c(skipAd());
            break;
        case "youtubeNewPage":
            youtubeNewPage();
            break;
    }
});

//send requests to background
function sendRequest(action,input) {
    chrome.runtime.sendMessage({
        from: "content",
        action: action,
        input: input
    });
}