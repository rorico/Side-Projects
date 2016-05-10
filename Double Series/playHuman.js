function playHuman(player,value) {
    var options = getOptions(players[player]);
    for (var i = 0 ; i<players[player].length ; i++) {
        $('#p'+player+'_'+i).addClass('choose');
        if (options[i].length==0||options[i]==-1||options[i]==0) {
            $('#p'+player+'_'+i).addClass('special');
        }
        $('#p'+player+'_'+i).unbind('click');
        $('#p'+player+'_'+i).bind('click',{player:player,i:i,value:value}, function(event) {
            event.stopPropagation();
            $('.special').removeClass('special');
            $('.choose').unbind('click');
            $('.choose').removeClass('choose');
            chooseCard(event.data.player,event.data.i,event.data.value);
        });
    }
    for (var card = 0 ; card<options.length ; card++) {
        for (var side = 0 ; options[card]!=-1&&options[card]!=0&&side<options[card].length ; side++) {
            var x = options[card][side][0];
            var y = options[card][side][1];
            showChoose(player,x,y,value,card);
        }
    }
}
function chooseCard(player,card,value) {
    
    $('#o'+player).append("<div class='choose option' id='back'>BACK</div>");
    $('#back').bind('click',{player:player,value:value}, function(event) {
        $('.option').remove();
        $('.special').removeClass('special');
        $('.choose').unbind('click');
        $('.choose').removeClass('choose');
        playHuman(event.data.player,event.data.value);
    });
    options = getOptions([players[player][card]]);
    if (options[0]===0) {
        var options = [];
        options.push(addJR());
    }
    
    if (options[0]===-1) {
        var options = [];
        options.push(removeJR(value));
        for (var side = 0 ; side<options[0].length ; side++) {
            var x = options[0][side][0];
            var y = options[0][side][1];
            showChooseRemove(player,x,y,value,card);
        }
        return;
    }
    
    if (options[0].length===0) {
        $('#o'+player).append("<div class='choose option' id='remove'>REMOVE</div>");
        $('#remove').bind('click',{player:player,value:value,card:card}, function(event) {
            $('.option').remove();
            $('.special').removeClass('special');
            $('.choose').unbind('click');
            $('.choose').removeClass('choose');
            drawCard(event.data.player,event.data.card,event.data.value,true);
            playHuman(event.data.player,event.data.value);
        });
    }
    
    for (var side = 0 ; side<options[0].length ; side++) {
        var x = options[0][side][0];
        var y = options[0][side][1];
        showChoose(player,x,y,value,card);
    }
}
function showChoose(player,x,y,value,card) {
    var position = 10*x+y+1;
    if (animate) {
        $('#'+position).addClass('choose');
    }
    $('#'+position).unbind();
    $('#'+position).bind('click',{player:player,x:x,y:y,value:value,card:card}, function(event) {
        event.stopPropagation();
        $('.choose').unbind('click');
        $('.special').removeClass('special');
        $('.choose').removeClass('choose');
        $('.option').remove();
        chooseSide(event.data.player,event.data.x,event.data.y,event.data.value,event.data.card);
    });
}
function chooseSide(player,x,y,value,card) {
    changeValue(x,y,value);
    checker(x,y);
    drawCard(player,card,value);
    $('.hide').removeClass('hide');
    delayedStart(turnN+1,gameN);
}
function showChooseRemove(player,x,y,value,card) {
    var position = 10*x+y+1;
    if (animate) {
        $('#'+position).addClass('choose');
    }
    $('#'+position).unbind();
    $('#'+position).bind('click',{player:player,x:x,y:y,value:value,card:card}, function(event) {
        event.stopPropagation();
        $('.choose').unbind('click');
        $('.special').removeClass('special');
        $('.choose').removeClass('choose');
        $('.option').remove();
        chooseSideRemove(event.data.player,event.data.x,event.data.y,event.data.value,event.data.card);
    });
}
function chooseSideRemove(player,x,y,value,card) {
    value0(x,y);
    drawCard(player,card,value);
    $('.hide').removeClass('hide');
    delayedStart(turnN+1,gameN);
}