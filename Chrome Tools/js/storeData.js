var storeData;
var getData;
(function() {
    var suf = "s";
    var indexSuf = "Indexes";
    var metaSuf = "Meta";
    storeData = function(name,data) {
        var storeName = name + suf;
        chrome.storage.sync.get(storeName, function(items) {
            if (chrome.runtime.lastError) {
                log(chrome.runtime.lastError);
                return;
            }

            var info = items[storeName] || [];
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
                setObj[storeName] = info;
                chrome.storage.sync.set(setObj, function() {
                    if (chrome.runtime.lastError) {
                        if (chrome.runtime.lastError.message === "QUOTA_BYTES quota exceeded") {
                            moveData(name,info,data);
                        }
                        log(chrome.runtime.lastError);
                        return;
                    }
                });
            }
        });
    };

    getData = function(name,callback) {
        var indexName = name + indexSuf;
        var metaName = name + metaSuf;
        chrome.storage.sync.get([indexName,metaName], function(item) {
            if (chrome.runtime.lastError) {
                log(chrome.runtime.lastError);
                return;
            }
            var indexes = item[indexName] || [];
            var metaData = items[metaName] || {};
            if (metaData.sync) {
                indexes = indexes.slice(metaData.sync[0],metaData.sync[1]);
            }
            indexes.push(name + suf);
            chrome.storage.sync.get(indexes, callback);
        });
    };

    function moveData(name,info,data) {
        var indexName = name + indexSuf;
        var metaName = name + metaSuf;
        chrome.storage.sync.get([indexName,metaName], function(items) {
            if (chrome.runtime.lastError) {
                log(chrome.runtime.lastError);
                return;
            }
            var indexes = items[indexName] || [];
            var dataName = name + "_" + indexes.length;
            indexes.push(dataName);

            var setObj = {indexes:indexes};
            setObj[indexName] = indexes;
            setObj[metaName] = metaData;
            setObj[name + suf] = [];
            setObj[dataName] = info;
            chrome.storage.sync.set(setObj, function() {
                if (chrome.runtime.lastError) {
                    log(chrome.runtime.lastError);
                    return;
                }
            });
            storeData(name,data);


            //move older things to localStorage - unlimited storage
            var metaData = items[metaName] || {};

            //hold [start,end] values, end is 1 more than largest
            if (!metaData.sync) {
                metaData.sync = [0,indexes.length];
            }
            metaData.sync[1]++;
            //limit to 5 blocks of data
            var overflow = metaData.sync[1] - metaData.sync[0] - 5;
            if (size > 0) {
                if (!metaData.local) {
                    metaData.local = [0,0];
                }
                metaData.local[1] += size;
                var remove = indexes.slice(metaData[0],metaData[0] + size);
                metaData.sync[0] += size;
                chrome.storage.sync.get(remove, function(removedItems) {
                    if (chrome.runtime.lastError) {
                        log(chrome.runtime.lastError);
                        return;
                    }
                    chrome.storage.local.set(removedItems,function() {
                        if (chrome.runtime.lastError) {
                            log(chrome.runtime.lastError);
                            return;
                        }
                    });
                    chrome.storage.sync.remove(remove,function()) {
                        if (chrome.runtime.lastError) {
                            log(chrome.runtime.lastError);
                            return;
                        }
                    }
                });
            }
        });
    }
})();