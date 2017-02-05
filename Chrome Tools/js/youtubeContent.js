var p;
var ad;
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