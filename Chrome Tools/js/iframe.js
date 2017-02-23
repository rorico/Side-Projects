function iframe(container,urls) {
    var html = "<div>";
    for (var i = 0 ; i < urls.length ; i++) {
        html += "<iframe class='iframe' src=" + urls[i] + " tabindex='-1' sandbox='allow-same-origin allow-popups allow-forms allow-scripts' scrolling='no' ></iframe>";
    }
    html += "</div>";
    container.append(html);
    var width = Math.min(400,(container.width() - 100)/urls.length);
    //want to get height programitically, will do for now
    $(".iframe").width(width).height(500);

    //some iframes take control once they load, stop that
    //http://stackoverflow.com/a/28932220
    $(document).one('focusout', function(){
        setTimeout(function(){
            if (document.activeElement instanceof HTMLIFrameElement) {
                container.focus();
            }
        },0);
    })
}
