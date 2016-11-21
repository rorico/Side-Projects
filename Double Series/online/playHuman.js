function playHuman(player,team) {
    var hand = players[player];
    for (var card = 0 ; card < hand.length ; card++) {
        var cardEle = $("#p"+player+"_"+card);
        cardEle.addClass("choose");
        var options = [];
        //jacks, don't need to calculate possible for them at this stage
        if (hand[card] === 0 || hand[card] === -1) {
            cardEle.addClass("special");
        } else {
            options = cardOptions(hand[card]);
            //no possible moves for the card
            if (!options.length) {
                cardEle.addClass("special");
            } else {
                //show possible moves
                for (var side = 0 ; side < options.length ; side++) {
                    var x = options[side][0];
                    var y = options[side][1];
                    showChoose(player,team,card,PLAY_ADD,x,y);
                }
            }
        }
        //need to add event data because loop
        cardEle.click({card:card,options:options}, function(event) {
            clearHuman();
            var e = event.data;
            chooseCard(player,team,e.card,e.options);
        });
    }
}

function chooseCard(player,team,card,options) {
    var backButton = $("<div class='choose option' id='back'>BACK</div>");
    backButton.click(function() {
        clearHuman();
        playHuman(player,team);
    });
    $("#o"+player).append(backButton);

    var action = PLAY_ADD;
    if (players[player][card] === 0) {
        options = addJoptions();
    } else if (players[player][card] === -1) {
        action = PLAY_REMOVE;
        options = removeJoptions(team);
    } else if (!options.length) {     //useless card
        action = PLAY_REPLACE;
        var removeButton = $("<div class='choose option' id='remove'>REMOVE</div>");
        removeButton.click(function() {
            clearHuman();
            var ret = {
                card:card,
                action:action
            }
            choosePlay(player,ret);
        });
        $("#o"+player).append(removeButton);
    }
    
    for (var side = 0 ; side < options.length ; side++) {
        var x = options[side][0];
        var y = options[side][1];
        showChoose(player,team,card,action,x,y);
    }
}

function showChoose(player,team,card,action,x,y) {
    getPosition(x,y).addClass("choose").unbind()
    .click(function() {
        clearHuman();
        var ret = {
            card:card,
            action:action,
            position:[x,y]
        };
        var possible;
        if (action === PLAY_ADD && (addPoint(x,y,team),possible = checker(x,y,team),possible.length)) {
            showFinish(player,ret,possible);
        } else {
            choosePlay(player,ret);
        }
    });
}

function showFinish(player,ret,possible) {
    ret.action = PLAY_FINISH;
    var team = ret.team;
    var linesFinished = team === 1 ? blueLines : greenLines;
    var choose = [];
    //if play is going to finish the game, it doesn't matter what i picked
    if (possible.length >= 2 - linesFinished) {
        for (var i = 0 ; i < possible.length ; i++) {
            var line = possible[i];
            var random = Math.floor(Math.random() * (line.length - 5));
            choose.push(line.slice(random,random + 5));
        }
        finishLines(choose);
        clearHuman();
        ret.finishedLines = choose;
        choosePlay(player,ret);
    } else {
        var unFinished = 0;
        var startIndexes = [];
        for (var i = 0 ; i < possible.length ; i++) {
            var line = possible[i];
            var random = Math.floor(Math.random() * (line.length - 5));
            if (line.length === 5) {
                choose.push(line);
                showFinishLine(line,team);
            } else {
                unFinished++;

                var start = line.length - 5;
                var end = 5;
                showFinishLine(line.slice(start,end),team);
                for (var j = 0 ; j < line.length ; j = j === start - 1 ? end : j + 1) {
                    getPosition(line[j][0],line[j][1]).addClass("choose")
                    .click({line:line,i:j}, function(event) {
                        var e = event.data;
                        var poss = e.line;
                        if (e.i >= 5) {
                            var thisEnd = e.i + 1; //slice doesn't include current
                            showFinishLine(line.slice(end,thisEnd),team);
                            for (var j = end ; j < thisEnd ; j++) {
                                getPosition(poss[j][0],poss[j][1]).removeClass("choose").unbind();
                                getPosition(poss[j-5][0],poss[j-5][1]).removeClass("choose").unbind();
                            }
                            end = thisEnd;
                        } else {
                            showFinishLine(poss.slice(e.i,start),team);
                            for (var j = e.i ; j < start ; j++) {
                                getPosition(poss[j][0],poss[j][1]).removeClass("choose").unbind();
                                getPosition(poss[j+5][0],poss[j+5][1]).removeClass("choose").unbind();
                            }
                            start = e.i;
                        }
                        if (end - start >= 5) {
                            choose.push(poss.slice(start,end));
                            if (!--unFinished) {
                                clearHuman();
                                ret.finishedLines = choose;
                                choosePlay(player,ret);
                            }
                        }
                    });
                }
            }
        }
        //no choices
        if (!unFinished) {
            clearHuman();
            ret.finishedLines = choose;
            choosePlay(player,ret);
        }
    }
}

//clears clicks and classes that playHuman made
function clearHuman() {
    $(".choose").unbind("click");
    $(".special").removeClass("special");
    $(".choose").removeClass("choose");
    $(".option").remove();
}

function choosePlay(player,ret) {
    console.log(player,ret);
    playedCard = ret.card;
    playData(player,ret);
}