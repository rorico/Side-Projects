var youtube = (function() {
    var pausedVideos = [];
    return youtube;

    function youtube() {
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
                                pausedVideos.push(id);
                            } else {
                                pausedVideos = [id];
                            }
                            paused = true;
                        }
                        cnt++;
                        if (cnt === num && !paused) {
                            play();
                        }
                    };
                })(tab.id);

                chrome.tabs.sendMessage(tab.id,data,callback);
            }
        });
    }
    function play() {
        for (var i = 0 ; i < pausedVideos.length ; i++) {
            var data = {action:"play"};
            chrome.tabs.sendMessage(pausedVideos[i],data);
        }
        pausedVideos = [];
    }
})();