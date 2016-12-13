var weekSchedule;
chrome.runtime.getBackgroundPage(function (backgroundPage) {
	//structure this way so it is similar to content script
    weekSchedule = function(dates,callback) {
    	callback(backgroundPage.weekSchedule(dates));
    };
    scheduleInit($("body"));
});