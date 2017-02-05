var youtubeVideoNames = [];

//called in siteBlocker.js
function youtubeTabUpdated(tabId) {
    //this is copied and hard coded, probably won't change anytime soon, so oh well
    if (if (new RegExp("^" + "*://*.youtube.com/*".replace(/\./g,"\\.").replace(/\*/g, ".*") + "$").test(url))) {
        var data = {action:"newPage"};
        chrome.tabs.sendMessage(tabId,data);
    }
}

(function() {
    var youtubeVideoIds = [];

    addMessageListener({
        "youtube": function(a) {
            youtube(a.input);
        },
        "youtubeEnd": function(a,b) {
            youtubeEnd(b.tab);
        }
    });

    function youtube(index) {
        if (typeof index === "number") {
            play(youtubeVideoIds.splice(index,1)[0]);
            youtubeVideoNames.splice(index,1);
        } else {
            //get all youtube tabs that isn't the current one
            chrome.tabs.query({url:["*://*.youtube.com/*", "*://youtube.com/*"],active:false}, function(tabs) {
                //if tabs is empty, nothing to play anyways
                var cnt = 0;
                var num = tabs.length;
                var paused = false;
                for (var i = 0 ; i < num ; i++) {
                    var tab = tabs[i];
                    var data = {action:"pause"};

                    chrome.tabs.sendMessage(tab.id,data,callback(tab.id,tab.title));
                }

                function callback(id,title) {
                    return function(stopped) {
                        if (stopped) {
                            //idea is if none are paused, don't reset list, only reset on first
                            if (!paused) {
                                youtubeVideoIds = [];
                                youtubeVideoNames = [];
                            }
                            addTab(id,title);
                            paused = true;
                        }
                        cnt++;
                        if (cnt === num) {
                            if (!paused) {
                                playAll();
                            }
                            sendRequest("youtube");
                        }
                    };
                }
            });
        }
    }

    function addTab(id,title) {
        //remove ending - YouTube
        title = title.substr(0,title.lastIndexOf(" - YouTube"));
        youtubeVideoIds.push(id);
        youtubeVideoNames.push(title);
    }

    function playAll() {
        for (var i = 0 ; i < youtubeVideoIds.length ; i++) {
            play(youtubeVideoIds[i]);
        }
        youtubeVideoIds = [];
        youtubeVideoNames = [];
    }

    function play(tabId) {
        var data = {action:"play"};
        chrome.tabs.sendMessage(tabId,data);
    }

    //only add the ending video if nothing there
    function youtubeEnd(tab) {
        if (!youtubeVideoIds.length) {
            addTab(tab.id,tab.title);
            sendRequest("youtube");
        }
    }
})();