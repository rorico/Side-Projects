var storeData;
var getData;
(function() {
    var suf = "s";
    var indexSuf = "Indexes";
    var metaSuf = "Meta";
    storeData = function(name,data) {
        var storeName = name + suf;
        get(storeName, function(items) {
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
                set(setObj,function() {
                    //if total data is too large, move things into local storage
                    //would like to change the way this is done, but this seems alright
                    if (chrome.runtime.lastError && chrome.runtime.lastError.message === "QUOTA_BYTES quota exceeded") {
                        moveData(name,info,data);
                    }
                });
            }
        });
    };

    getData = function(name,callback) {
        var indexName = name + indexSuf;
        var metaName = name + metaSuf;
        get([indexName,metaName], function(item) {
            var indexes = item[indexName] || [];
            var metaData = item[metaName] || {};
            if (metaData.sync) {
                indexes = indexes.slice(metaData.sync[0],metaData.sync[1]);
            }
            indexes.push(name + suf);
            get(indexes, callback);
        });
    };

    function moveData(name,info,data) {
        var indexName = name + indexSuf;
        var metaName = name + metaSuf;
        get([indexName,metaName], function(items) {
            var indexes = items[indexName] || [];
            var dataName = name + "_" + indexes.length;
            indexes.push(dataName);

            var setObj = {indexes:indexes};
            setObj[indexName] = indexes;
            setObj[metaName] = metaData;
            setObj[name + suf] = [];
            setObj[dataName] = info;
            set(setObj);
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
            if (overflow > 0) {
                if (!metaData.local) {
                    metaData.local = [0,0];
                }
                metaData.local[1] += overflow;
                var removeIndexes = indexes.slice(metaData[0],metaData[0] + overflow);
                metaData.sync[0] += overflow;
                get(removeIndexes, function(removedItems) {
                    setLocal(removedItems);
                    remove(removeIndexes);
                });
            }
        });
    }

    function set(obj,callback) {
        chrome.storage.sync.set(obj,function() {
            if (!storageError() && typeof callback === "function") {
                callback();
            }
        });
    }

    function setLocal(obj,callback) {
        chrome.storage.local.set(obj,function() {
            if (!storageError() && typeof callback === "function") {
                callback();
            }
        });
    }

    function get(list,callback) {
        chrome.storage.sync.get(list, function(items) {
            if (!storageError() && typeof callback === "function") {
                callback(items);
            }
        });
    }

    function remove(list,callback) {
        chrome.storage.sync.remove(remove,function() {
            if (!storageError() && typeof callback === "function") {
                callback();
            }
        });
    }

    function storageError() {
        if (chrome.runtime.lastError) {
            log(chrome.runtime.lastError.message);
            return true;
        }
        return false;
    }
})();