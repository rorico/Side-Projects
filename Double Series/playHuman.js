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
        options = addJR();
    } else if (players[player][card] === -1) {
        action = PLAY_REMOVE;
        options = removeJR(team);
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
    var position = 10*x + y + 1;
    var positionEle = $('#'+position);
    positionEle.addClass('choose');
    positionEle.unbind();
    positionEle.bind('click',{player:player,team:team,card:card,action:action,x:x,y:y}, function(event) {
        clearHuman();
        var e = event.data;
        choosePlay(e.player,e.team,e.card,e.action,e.x,e.y);
    });
}

//clears clicks and classes that playHuman made
function clearHuman() {
    $('.choose').unbind('click');
    $('.special').removeClass('special');
    $('.choose').removeClass('choose');
    $('.option').remove();
}

function choosePlay(player,team,card,action,x,y) {
    var result = [action,card,[x,y]];
    playCard(player,team,result);
    //if replacing card, stay on this turn
    if (action === PLAY_REPLACE) {
        playHuman(player,team);
    } else {
        $('.hide').removeClass('hide');
        delayedStart(turnN+1,gameN);
    }
}