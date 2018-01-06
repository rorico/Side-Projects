$(document).on("swipeleft",next);
$(document).on("swiperight",prev);
$(document).on("orientationchange",function(e){
    weekView(e.orientation === "landscape")
});
var doubleTap = 0;
// double click changes to today
$(document).on("vclick",function(e){
    var test = new Date();
    if (test - doubleTap > 300) {
        doubleTap = test;
    } else {
        e.preventDefault();
        setToday();
    }
});