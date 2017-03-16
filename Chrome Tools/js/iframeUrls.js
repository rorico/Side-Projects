var iframeUrls;
setIframeUrls();
function setIframeUrls() {
    chrome.storage.sync.get("iframeUrls", function(items) {
        if (chrome.runtime.lastError) {
            log(chrome.runtime.lastError);
        }
        if (items.iframeUrls) {
            iframeUrls = items.iframeUrls;

            //workaround for sameorigin problem
            chrome.webRequest.onHeadersReceived.addListener(function(e) {
                var headers = e.responseHeaders || [];
                for (var i = headers.length - 1 ; i >= 0 ; i--) {
                    var header = headers[i].name.toLowerCase();
                    if (header === "x-frame-options" || header === "frame-options") {
                        headers.splice(i,1);
                    }
                }
                return {
                    responseHeaders: headers
                }
            }, {
                urls: iframeUrls,
                types: ["sub_frame"]
            }, ["blocking", "responseHeaders"]);
        } else {
            iframeUrls = [];
        }
    });
}