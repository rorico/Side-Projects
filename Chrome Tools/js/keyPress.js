var keyPressInit;
var addPhrase;
var addPhrases;
var addNumberListener;
(function() {
    //order matters in terms of what gets checked first
    //keep letters capitalized
    var phrases = [];
    var numberListeners = [];

    var currentPhrase = 0;
    var phraseIndex = 0;
    var allowMistakes = false;
    var deletes = false;
    keyPressInit = function(container,startPhrases) {
        phrases = startPhrases;
        container.prepend("<div id='chromeTools_keyPress'></div>");

        container.attr("tabindex",1).focus().keydown(function(e) {
            if (currentPhrase) {
                //get ascii value of next part
                if (e.keyCode === currentPhrase[0].charCodeAt(phraseIndex)) {
                    showHotkey(phraseIndex,true);
                    if (++phraseIndex === currentPhrase[0].length) {
                        $("#phrase").addClass("done");
                        var fnc = currentPhrase[1];
                        var hard = currentPhrase[2];
                        clearHotkey();
                        if (hard) {
                            double(fnc);
                        } else {
                            fnc();
                        }
                        disappearHotkey();
                    }
                } else {
                    showHotkey(phraseIndex,false);
                    if (!allowMistakes) {
                        clearHotkey();
                    }
                }
            } else  {
                var found = false;
                for (var i = 0 ; i < phrases.length ; i++) {
                    if (e.keyCode === phrases[i][0].charCodeAt(0)) {
                        if (phrases[i][0].length === 1) {
                            phrases[i][1]();
                        } else {
                            currentPhrase = phrases[i];
                            startShowHotkey(phrases[i][0],true);
                            phraseIndex = 1;
                        }
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    var num;
                    //check if is number key
                    if ((num = e.keyCode - 48,e.keyCode >= 48 && e.keyCode <= 57) ||
                        (num = e.keyCode - 96,e.keyCode >= 96 && e.keyCode <= 105)) {
                        for (var i = 0 ; i < numberListeners.length ; i++) {
                            if (!numberListeners[i][2]) {
                                numberListeners[i][0](num);
                                break;
                            }
                        }
                    } else {
                        for (var i = 0 ; i < numberListeners.length ; i++) {
                            if (numberListeners[i][1] && e.keyCode === numberListeners[i][1].charCodeAt(0)) {
                                numberListeners[i][2] = 0;
                                break;
                            }
                        }
                    }
                }
            }
        }).keyup(function(e) {
            for (var i = 0 ; i < numberListeners.length ; i++) {
                if (numberListeners[i][1] && e.keyCode === numberListeners[i][1].charCodeAt(0)) {
                    numberListeners[i][2] = 1;
                    break;
                }
            }
        });
    };

    addPhrase = function(phrase,funct,hard) {
        phrases.push([phrase,funct,hard]);
    };

    addPhrases = function(array) {
        phrases = phrases.concat(array);
    };

    addNumberListener = function(funct,combo) {
        if (combo) {
            numberListeners.push([funct,combo,1]);
        } else {
            numberListeners.push([funct]);
        }
    };

    function startShowHotkey(phrase,start) {
        var front = "<div id='phraseFront'>";
        var back = "<div id='phraseBack'>";
        for (var i = 0 ; i < phrase.length ; i++) {
            front += "<div id='phrase" + i + "' class='phrasePart'>" + phrase[i] + "</div>";
            back += "<div class='phrasePart'>" + phrase[i] + "</div>";
        }
        front += "</div>";
        back += "</div>";
        var html = "<div id='phrase'>" + front + back + "</div>";
        $("#chromeTools_keyPress").html(html);
        var fontSize = 100;
        var widthMargin = 40;    //don't want text to hug the sides
        var maxWidth = $("body").width() - widthMargin;
        if (maxWidth < $("#phraseFront").width()) {
            //shouldn't get stuck in an infinite loop
            fontSize = Math.floor(fontSize / ($("#phraseFront").width() / maxWidth));
            $(".phrasePart").css("font-size",fontSize);
        }
        //center display
        var leftOffset = ($("body").innerWidth() - $("#phraseFront").outerWidth())/2;
        var topOffset = ($("body").innerHeight() - $("#phraseFront").outerHeight())/2;
        $("#chromeTools_keyPress").css("left",leftOffset).css("top",topOffset);
        if (start) {
            $("#phrase0").addClass("filled");
        }
        disappearHotkey(1200);
    }

    function showHotkey(index,correct) {
        if (correct) {
            $("#phrase" + index).addClass("filled").removeClass("failed");
            disappearHotkey(1200);
        } else {
            $("#phrase" + index).addClass("failed");
            disappearHotkey(500);
        }
    }

    var disappearInterval;
    function disappearHotkey(time) {
        var opacity = 0.8;
        var delay = (time ? time / opacity / 100 : 15);
        $("#phrase").css("opacity",opacity);
        clearInterval(disappearInterval);
        if (!allowMistakes) {
            disappearInterval = setInterval(function() {
                opacity -= 0.01;
                $("#phrase").css("opacity",opacity);
                if (opacity <= 0) {
                    clearHotkey();
                }
            },delay);
        }
    }

    function clearHotkey() {
        currentPhrase = 0;
        phraseIndex = 0;
        allowMistakes = false;
    }

    function double(funct) {
        //add another test to actually call vip in background
        var random = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 0 ; i < 18 ; i++) {
            random += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        currentPhrase = [random,funct];
        allowMistakes = true;
        startShowHotkey(random,false);
    }
})();