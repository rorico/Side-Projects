var p;
init();

//youtube is special in that new urls don't actual reload page
//http://stackoverflow.com/a/18398921
document.addEventListener('transitionend', function(e) {
    if (e.target.id === 'progress') {
        // do stuff
        init();
    }
});

function init() {
    p = window.document.getElementsByTagName("video")[0];
    if (p) {
        p.onended = function() {
            sendRequest("youtubeEnd");
        }
    }
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