var storeData;
var getData;
(function() {
    var suf = "s";
    var indexSuf = "Indexes";
    storeData = function(name,data) {
        chrome.storage.sync.get(name, function(items) {
            if (chrome.runtime.lastError) {
                log(chrome.runtime.lastError);
                return;
            }

            var info = items[name] || [];
            //approximately the max size per item, slightly smaller
            //for some reason the limit is around 7700 instead of 8192, be much lower to be sure
            //can check getBytesInUse, but seems unnecessary
            var limit = 7000;
            //if the new entry is larger than it can possibly be stored, shouldn't ever happen
            //to make sure we don't get into an infinite loop
            if (JSON.stringify(data).length > limit) {
                log("can't store the following, too large:");
                log(data);
            } else if (JSON.stringify(info).length + JSON.stringify(data).length > limit) {
                moveData(name,info,data);
            } else {
                info.push(data);
                var setObj = {};
                setObj[name + suf] = info;
                chrome.storage.sync.set(setObj, function() {
                    if (chrome.runtime.lastError) {
                        log(chrome.runtime.lastError);
                        return;
                    }
                });
            }
        });
    };

    getData = function(name,callback) {
        var indexName = name + indexSuf;
        chrome.storage.sync.get(indexName, function(item) {
            if (chrome.runtime.lastError) {
                log(chrome.runtime.lastError);
                return;
            }
            var indexes = item[indexName] || [];
            indexes.push(name + suf);
            chrome.storage.sync.get(indexes, callback);
        });
    };

    function moveData(name,info,data) {
        var indexName = name + indexSuf;
        chrome.storage.sync.get(indexName, function(items) {
            if (chrome.runtime.lastError) {
                log(chrome.runtime.lastError);
                return;
            }
            var indexes = items[indexName] || [];
            var dataName = name + "_" + indexes.length;
            indexes.push(dataName);
            var setObj = {indexes:indexes};
            setObj[indexName] = indexes;
            setObj[name + suf] = [];
            setObj[dataName] = data;
            chrome.storage.sync.set(setObj, function() {
                if (chrome.runtime.lastError) {
                    log(chrome.runtime.lastError);
                    return;
                }
            });
            storeData(name,data);
        });
    }
})();