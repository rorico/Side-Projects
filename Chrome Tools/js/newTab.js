chrome.runtime.getBackgroundPage(function (backgroundPage) {
	var blockId = "chromeTools_block";
    blockScreen = $("<div id='" + blockId + "'></div>");
    $("body").append(blockScreen);
    keyPressInit(blockScreen);
    var container = timeLineInit(blockScreen,backgroundPage);
    blockScreen.append("<br />")
    iframe(container,backgroundPage.iframeUrls);
});