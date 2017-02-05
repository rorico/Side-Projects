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
            chrome.tabs.query({url:["*://*.youtube.com/*", "*://youtube.com/*"],active:false}, function(tabs) {
                //if tabs is empty, nothing to play anyways

                var adSkipped = false;
                eachTab(tabs,"skipAd",function(stopped,tab) {
                    if (stopped) {
                        //check if can skip ads first
                        adSkipped = true;
                    }
                }, function() {
                    if (!adSkipped) {
                        pauseAll(tabs);
                    }
                });


            });
        }
    }

    function pauseAll(tabs) {
        var paused = false;
        eachTab(tabs,"pause",function(stopped,tab) {
            if (stopped) {
                //idea is if none are paused, don't reset list, only reset on first
                if (!paused) {
                    youtubeVideoIds = [];
                    youtubeVideoNames = [];
                }
                addTab(tab.id,tab.title);
                paused = true;
            }
        }, function() {
            if (!paused) {
                playAll();
            }
        });
    }

    function eachTab(tabs,action,eachC,doneC) {
        var cnt = 0;
        var num = tabs.length;
        for (var i = 0 ; i < num ; i++) {
            var tab = tabs[i];
            var data = {action:action};

            chrome.tabs.sendMessage(tab.id,data,tabCallback(tab));
        }

        function tabCallback(id,title) {
            return function(stopped) {
                eachC(stopped,tab);
                cnt++;
                if (cnt === num) {
                    doneC();
                    sendRequest("youtube");
                }
            };
        }
    }

    var skipped = false;
            return function(stopped) {
                if (stopped) {
                    skipped = true;
                }
                cnt++;
                if (cnt === num) {
                    if (!skipped) {
                        playAll();
                    }
                    sendRequest("youtube");
                }
            };

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