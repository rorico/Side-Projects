function getPlayer() {
    return window.document.getElementsByTagName("video")[0];
}

function pause() {
    var p = getPlayer();
    if (!p.paused) {
        p.pause();
        return true;
    }
    return false;
}

function play() {
    var p = getPlayer();
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