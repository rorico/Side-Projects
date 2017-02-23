chrome.runtime.getBackgroundPage(function (backgroundPage) {
	var blockId = "chromeTools_block";
    blockScreen = $("<div id='" + blockId + "'></div>");
    $("body").append(blockScreen);
    keyPressInit(blockScreen);
    timeLineInit(blockScreen,backgroundPage);
    iframe(blockScreen,backgroundPage.iframeUrls);
});