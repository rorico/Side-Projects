var iframe;
(function() {
    var iframeId = "chromeTools_iframe";
    var width;
    var height = 0;
    iframe = init;

    function init(container,urls) {
        var html = "<div id='" + iframeId + "'>";
        for (var i = 0 ; i < urls.length ; i++) {
            html += "<iframe class='iframe' src=" + urls[i] + " tabindex='-1' sandbox='allow-same-origin allow-popups allow-forms allow-scripts' scrolling='no' ></iframe>";
        }
        html += "</div>";
        container.append(html);
        resize();
        //add responsiveness
        $(window).resize(resize);

        function resize() {
            var newWidth = Math.min(400,roundTo(container.width()/urls.length - 50,50));
            if (newWidth !== width) {
                width = newWidth;
                $(".iframe").width(width);
            }
            var last = container.children().last();
            var bottom = last.height() + last.offset().top;
            var maxHeight = (container.height() - bottom) * 2 + $("#" + iframeId).height();
            var newHeight = Math.min(500,roundTo(maxHeight - 120,50));
            if (newHeight !== height) {
                height = newHeight;
                $(".iframe").height(height);
            }
        }

        //some iframes take control once they load, stop that
        //http://stackoverflow.com/a/28932220
        $(document).one('focusout', function(){
            setTimeout(function(){
                if (document.activeElement instanceof HTMLIFrameElement) {
                    container.focus();
                }
            },0);
        });
    }

    function roundTo(num,round) {
        var div = num % round;
        if (div > round/2) {
            num += round;
        }
        return num - div;
    }
})();
