function playAI(player,value,offensive) {
    var options = getOptions(players[player]);
    var useless = hasUselessCard(options);
    if (useless !== -1) {
        return [0,useless,[-1,-1]];
    }
    var best = mostLines(options,value,offensive);

    //if best line is 4
    if (best[0]!==4) {

        //determines if has remove Jack
        var removePos = hasRemove(players[player]);
        if (removePos!==-1) {
            var options2 = removeJ(value);
            if (options2.length!==0) {
                var side = Math.floor(Math.random()*options2.length);
                var x = options2[side][0];
                var y = options2[side][1];
                return [-1,removePos,[x,y]];
            }  else if (hasOnlyRemoveJ(players[player])){
                options = removeJR(value);
                var side = Math.floor(Math.random()*options.length);
                var x = options[side][0];
                var y = options[side][1];
                return [-1,removePos,[x,y]];
            }
        }

        //determines if has add Jack
        var addPos = hasAdd(players[player]);
        if (addPos!==-1) {
            var options2 = addJ(value,offensive);
            if (options2.length!=0) {
                var side = Math.floor(Math.random()*options2.length);
                var x = options2[side][0];
                var y = options2[side][1];
                return [1,addPos,[x,y]];
            } else if (hasOnlyJ(players[player])){
                options = addJR();
                var side = Math.floor(Math.random()*options.length);
                var x = options[side][0];
                var y = options[side][1];
                return [1,addPos,[x,y]];
            }
        }
    }

    //determine what value to play
    //best[0] is longest line
    //best[1] is best play info
    //best[1][cards] is the cards that play the best line
    //best[1][card][0] is card
    //best[1][card][1] is side
    var random = Math.floor(Math.random()*best[1].length);
    var card = best[1][random][0];
    var side = best[1][random][1];

    //after the play
    var x = options[card][side][0];
    var y = options[card][side][1];
    return [1,card,[x,y]];
}