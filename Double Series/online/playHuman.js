function playHuman(player,team) {
    var hand = players[player];
    for (var card = 0 ; card < hand.length ; card++) {
        var cardEle = $('#p'+player+'_'+card);
        cardEle.addClass('choose');
        var options = [];
        //jacks, don't need to calculate possible for them at this stage
        if (hand[card] === 0 || hand[card] === -1) {
            cardEle.addClass('special');
        } else {
            options = cardOptions(hand[card]);
            //no possible moves for the card
            if (!options.length) {
                cardEle.addClass('special');
            } else {
                //show possible moves
                for (var side = 0 ; side < options.length ; side++) {
                    var x = options[side][0];
                    var y = options[side][1];
                    showChoose(player,team,card,PLAY_ADD,x,y);
                }
            }
        }
        cardEle.bind('click',{player:player,team:team,card:card,options:options}, function(event) {
            clearHuman();
            var e = event.data;
            chooseCard(e.player,e.team,e.card,e.options);
        });
    }
}

function chooseCard(player,team,card,options) {
    var backButton = $("<div class='choose option' id='back'>BACK</div>");
    backButton.bind('click',{player:player,team:team}, function(event) {
        clearHuman();
        var e = event.data;
        playHuman(e.player,e.team);
    });
    $('#o'+player).append(backButton);

    var action = PLAY_ADD;
    if (players[player][card] === 0) {
        options = addJoptions();
    } else if (players[player][card] === -1) {
        action = PLAY_REMOVE;
        options = removeJoptions(team);
    } else if (!options.length) {     //useless card
        action = PLAY_REPLACE;
        var removeButton = $("<div class='choose option' id='remove'>REMOVE</div>");
        removeButton.bind('click',{player:player,team:team,card:card,action:action}, function(event) {
            clearHuman();
            var e = event.data;
            //x,y doesn't matter
            choosePlay(e.player,e.team,e.card,e.action,-1,-1);
        });
        $('#o'+player).append(removeButton);
    }
    
    for (var side = 0 ; side < options.length ; side++) {
        var x = options[side][0];
        var y = options[side][1];
        showChoose(player,team,card,action,x,y);
    }
}

function showChoose(player,team,card,action,x,y) {
    getPosition(x,y).addClass("choose").unbind()
    .bind('click',{player:player,team:team,card:card,action:action,x:x,y:y}, function(event) {
        clearHuman();
        var e = event.data;
        var possible;
        if (action === PLAY_ADD && (addPoint(x,y,team),possible = checker(e.x,e.y,e.team),possible.length)) {
            showFinish(e.player,e.team,e.card,e.action,e.x,e.y,possible);
        } else {
            choosePlay(e.player,e.team,e.card,e.action,e.x,e.y);
        }
    });
}

function showFinish(player,team,card,action,x,y,possible) {
    var linesFinished = team === 1 ? blueLines : greenLines;
    var choose = [];
    if (possible.length >= 2 - linesFinished) {
        for (var i = 0 ; i < possible.length ; i++) {
            var line = possible[i];
            var random = Math.floor(Math.random() * (line.length - 5));
            choose.push(line.slice(random,random + 5));
        }
        finishLines(choose);
        var action = PLAY_FINISH;
        clearHuman();
        choosePlay(e.player,e.team,e.card,action,e.x,e.y,choose);
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
                    getPosition(line[j][0],line[j][1]).addClass('choose')
                    .bind('click',{player:player,team:team,card:card,action:action,x:x,y:y,line:line,i:j}, function(event) {
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
                                var action = PLAY_FINISH;
                                clearHuman();
                                choosePlay(e.player,e.team,e.card,action,e.x,e.y,choose);
                            }
                        }
                    });
                }
            }
        }
        if (!unFinished) {
            var action = PLAY_FINISH;
            clearHuman();
            choosePlay(player,team,card,action,x,y,choose);
        }
    }
}

//clears clicks and classes that playHuman made
function clearHuman() {
    $('.choose').unbind('click');
    $('.special').removeClass('special');
    $('.choose').removeClass('choose');
    $('.option').remove();
}

function choosePlay(player,team,card,action,x,y,finishedLine) {
    var result = [action,card,[x,y],finishedLine];
    playedCard = card;
    playData(player,result);
}