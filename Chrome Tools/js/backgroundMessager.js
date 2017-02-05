var addMessageListener;
(function() {
    var messageListeners = {};

    addMessageListener = function(obj) {
        //this doesn't allow removal, but not needed at least for now
        for (var prop in obj) {
            //i'm gonna assume this is a function
            messageListeners[prop] = obj[prop];
        }
    };

    chrome.runtime.onMessage.addListener(function(a, b, c) {
        //just to make sure there is no infinite loop
        if (a.from !== "background") {
            var funct = messageListeners[a.action];
            if (typeof funct === "function") {
                funct(a,b,c);
            }
        }
    });
})();

//for displaying in an open browser action
function sendRequest(action,input,content) {
    var data = {
        from: "background",
        action: action,
        input: input
    };

    chrome.runtime.sendMessage(data);
    return data;
}