var youtubeVideos = [];
var youtube = (function() {
    return youtube;

    function youtube(index,c) {
        if (typeof index === "number") {
            play(youtubeVideos.splice(index,1)[0]);
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
                    var callback = (function(id) {
                        return function(stopped) {
                            if (stopped) {
                                if (paused) {
                                    youtubeVideos.push(id);
                                } else {
                                    youtubeVideos = [id];
                                }
                                paused = true;
                            }
                            cnt++;
                            if (cnt === num) {
                                c();
                                if (!paused) {
                                    playAll();
                                }
                            }
                        };
                    })(tab.id);

                    chrome.tabs.sendMessage(tab.id,data,callback);
                }
            });
        }
    }

    function playAll() {
        for (var i = 0 ; i < youtubeVideos.length ; i++) {
            play(youtubeVideos[i]);
        }
        youtubeVideos = [];
    }

    function play(tabId) {
        var data = {action:"play"};
        chrome.tabs.sendMessage(tabId,data);
    }
})();