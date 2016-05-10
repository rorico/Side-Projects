function playWorth(player,value,offensive) {
    var options = getOptions(players[player]);
    var useless = hasUselessCard(options);
    if (useless!==false) {
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
    
    var max = 0;
    var maxCard = -1;
    var maxSide = -1;
    for (var i = 0 ; i < best[1].length ; i++) {
        //for (var j = 0 ; j < best[1][i].length ; j++) {
            var card = best[1][i][0];
            var side = best[1][i][1];
            if (options[card][side]===0||options[card][side]===-1) {
                continue;
            }
            if (pointworth[options[card][side][0]][options[card][side][1]] > max) {
                max = pointworth[options[card][side][0]][options[card][side][1]];
                maxCard = card;
                maxSide = side;
            }
        //}
    }
    var x = options[maxCard][maxSide][0];
    var y = options[maxCard][maxSide][1];
    return [1,maxCard,[x,y]];
}
