var blockScreen = $("<div></div>");
blockScreen.css("height","100%");
blockScreen.css("width","100%");
blockScreen.css("z-index","999");
blockScreen.css("display","table");
blockScreen.css("position","fixed");
blockScreen.css("top","0");
blockScreen.css("left","0");
blockScreen.css("background-color","white");
blockScreen.css("text-align","center");
var text = $("<div>Blocked</div>");
text.css("display","table-cell");
text.css("vertical-align","middle");
text.css("font-size","100px");
blockScreen.html(text);
$("body").append(blockScreen);

chrome.runtime.onMessage.addListener(function listener(a, b, c) {
    console.log(a,b,c);
    if (a.action === "unblock") {
        chrome.runtime.onMessage.removeListener(listener);
        blockScreen.remove();
    }
});