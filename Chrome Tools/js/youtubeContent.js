var p;
var adSkip;
var inAd;
youtubeNewPage();

//youtube is special in that new urls don't actual reload page
//http://stackoverflow.com/a/18398921
document.addEventListener('transitionend', function(e) {
    if (e.target.id === 'progress') {
        // do stuff
        youtubeNewPage();
    }
});


function youtubeNewPage() {
    p = window.document.getElementsByTagName("video")[0];
    if (p) {
        p.onended = function() {
            if (inAd) {
                inAd = false;
            } else {
                sendRequest("youtubeEnd");
            }
        }
    }
    inAd = !!document.getElementsByClassName("videoAdUi")[0];
    adSkip = document.getElementsByClassName("videoAdUiSkipButton")[0];
}

function skipAd() {
    if (adSkip) {
        adSkip.click();
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

function getState() {
    if (inAd && adSkip) {
        //means in ad and can skip
        return "ad";
    }
    if (p.paused) {
        return "pause";
    }
    return "play";
}

function listen(c) {
    p.onplay = function() {
        c();
        p.onplay = null;
        window.onbeforeunload = null;
    };
    //don't really need to undo this, its right as the page ends
    window.onbeforeunload = c;
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
        case "getState":
            c(getState());
            break;
        case "listen":
            listen(c);
            return true;
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