function getPlayer() {
    //admittedly, this is quite sketchy, but the proper way is so much more complicated
    var p = window.document.getElementsByClassName("ytp-play-button")[0];
    if (p) {
        var paused = p.attributes["aria-label"].value === "Play";
        return {obj:p,paused:paused};
    }
}

function pause() {
    var ret = getPlayer();
    if (ret) {
        if (!ret.paused) {
            ret.obj.click();
            return true;
        }
    }
    return false;
}

function play() {
    var ret = getPlayer();
    if (ret) {
        if (ret.paused) {
            ret.obj.click();
            return true;
        }
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