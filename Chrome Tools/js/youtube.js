var youtubeVideoNames = [];

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
            var query = {url:["*://*.youtube.com/*", "*://youtube.com/*"]};
            //if current page is blocked, add it to current list
            //sorta hacky, defined in siteBlocker
            if (url !== "Blocked") {
                query.active = false;
            }
            chrome.tabs.query(query, function(tabs) {
                //if tabs is empty, nothing to play anyways
                var states = [];
                var numAd = 0;
                var numPause = 0;

                var cnt = 0;
                var num = tabs.length;
                for (var i = 0 ; i < num ; i++) {
                    var tab = tabs[i];
                    var data = {action:"getState"};

                    chrome.tabs.sendMessage(tab.id,data,tabCallback(i));
                }

                function tabCallback(i) {
                    return function(state) {
                        states[i] = state;
                        if (state === "ad") {
                            numAd++;
                        } else if (state === "play") {
                            numPause++;
                        }
                        cnt++;
                        if (cnt === num) {
                            action();
                        }
                    };
                }

                function action() {
                    if (numAd) {
                        for (var i = 0 ; i < num ; i++) {
                            if (states[i] === "ad") {
                                var tab = tabs[i];
                                var data = {action:"skipAd"};
                                chrome.tabs.sendMessage(tab.id,data);
                            }
                        }
                    } else if (numPause) {
                        emptyList();
                        for (var i = 0 ; i < num ; i++) {
                            if (states[i] === "play") {
                                var tab = tabs[i];
                                var data = {action:"pause"};

                                chrome.tabs.sendMessage(tab.id,data);
                                addTab(tab.id,tab.title);
                            }
                        }
                        sendRequest("youtube");
                    } else {
                        playAll();
                        sendRequest("youtube");
                    }
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

    function emptyList() {
        youtubeVideoIds = [];
        youtubeVideoNames = [];
    }

    function playAll() {
        for (var i = 0 ; i < youtubeVideoIds.length ; i++) {
            play(youtubeVideoIds[i]);
        }
        emptyList();
    }

    function play(tabId) {
        var data = {action:"play"};
        chrome.tabs.sendMessage(tabId,data);
    }

    function youtubeEnd(tab) {
        //add to list only if empty, or thing before was added this way
        //property that gets overwritten when array is restarted
        if (youtubeVideoIds.ended || !youtubeVideoIds.length) {
            emptyList();
            addTab(tab.id,tab.title);
            sendRequest("youtube");
            youtubeVideoIds.ended = true;
            chrome.tabs.sendMessage(tab.id,{action:"listen"},function() {
                if (youtubeVideoIds.ended && youtubeVideoIds[0] === tab.id) {
                    emptyList();
                }
            });
        }
    }
})();