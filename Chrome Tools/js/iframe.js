var iframe;
var iframeUpdate;
(function() {
    var iframeId = "chromeTools_iframe";
    var width;
    var height = 0;
    var loading = [];
    var loadingTime = 2000; //2 secs

    iframe = init;
    iframeUpdate = update;

    function init(container,background) {
        var urls = background.iframeUrls;
        //create foundation for iframes
        var html = "<div id='" + iframeId + "'>";
        for (var i = 0 ; i < urls.length ; i++) {
            html += "<div id='frame" + i + "'></div>";
        }
        html += "</div>";
        container.append(html);
        updateUrls(urls,true);
        resize();
        return {
            resize: resize,
            update: update
        }
        //add responsiveness
        $(window).resize(resize);

        function resize() {
            var newWidth = Math.min(400,roundTo(container.width()/urls.length - 120,50));
            if (newWidth !== width) {
                width = newWidth;
                $("#" + iframeId + " .iframe").width(width);
            }
        }
    }

    function update(background) {
        updateUrls(background.iframeUrls,background.delay);
    }

    //second argument can be empty
    function updateUrls(urls,time) {
        //hide first, then when they are loaded, move them up
        for (var i = 0 ; i < urls.length ; i++) {
            if (!loading[i]) {
                updateUrl(urls[i],i,time);
            }
        }
    }

    //time is earliest time until block
    function updateUrl(url,i,time) {
        //hide until loaded, unless nothing there in the first place
        var holder = $("#frame" + i);
        var show = !holder.children().length;
        var cls = show ? "" : " hidden";

        var ele = $("<iframe class='iframe" + cls + "' src=" + url + " tabindex='-1' sandbox='allow-same-origin allow-popups allow-forms allow-scripts' scrolling='no' ></iframe>");
        holder.append(ele);

        var loadTime = Math.max(loadingTime,time);
        //the reason I don't go off the event, is that some internal js still runs to load page
        //run on the last of the two
        loading[i] = true;
        var loaded = false;
        var onloaded = function() {
            //some iframes take control once they load, stop that
            //http://stackoverflow.com/a/28932220
            $(document).on('focusout', function(){
                setTimeout(function(){
                    var ele = document.activeElement;
                    if (ele instanceof HTMLIFrameElement && ele.getAttribute("src") === url) {
                        ele.blur();
                        //assume parent is container
                        $("#" + iframeId).parent().focus();
                        $(document).off('focusout');
                    }
                },0);
            });

            if (!loaded) {
                loaded = true;
                return;
            }
            loading[i] = false;
            if (!show) {
                $("#frame" + i).children().each(function() {
                    var that = $(this);
                    if (that.hasClass("hidden")) {
                        that.removeClass("hidden");
                        that.width(width);
                    } else {
                        that.remove();
                    }
                });
            }
        }

        ele.load(onloaded);
        setTimeout(onloaded,loadingTime);
    }

    function roundTo(num,round) {
        var div = num % round;
        if (div > round/2) {
            num += round;
        }
        return num - div;
    }
})();
