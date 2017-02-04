var youtubeVideoNames = [];
var youtube = (function() {
    var youtubeVideoIds = [];
    return youtube;

    function youtube(index,c) {
        if (typeof index === "number") {
            play(youtubeVideoIds.splice(index,1)[0]);
            youtubeVideoNames.splice(index,1);
            c();
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
                    var callback = (function(id,title) {
                        //remove ending - YouTube
                        title = title.substr(0,title.lastIndexOf(" - YouTube"));
                        return function(stopped) {
                            if (stopped) {
                                if (paused) {
                                    youtubeVideoIds.push(id);
                                    youtubeVideoNames.push(title)
                                } else {
                                    youtubeVideoIds = [id];
                                    youtubeVideoNames = [title];
                                }
                                paused = true;
                            }
                            cnt++;
                            if (cnt === num) {
                                c();
                                sendRequest("youtube");
                                if (!paused) {
                                    playAll();
                                }
                            }
                        };
                    })(tab.id,tab.title);

                    chrome.tabs.sendMessage(tab.id,data,callback);
                }
            });
        }
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
})();