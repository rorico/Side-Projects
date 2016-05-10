function play(player,value){
    var options = getOptions(players[player]);
    var card = Math.floor(Math.random()*options.length);
    var useless = hasUselessCard(options);
    if (useless!==false) {
        return [0,useless,[-1,-1]];
    }
    if (options[card]===0){
        optionsJ = addJR();
        var side = Math.floor(Math.random()*optionsJ.length);
        var x = optionsJ[side][0];
        var y = optionsJ[side][1];
        return [1,card,[x,y]];
    } else if(options[card]===-1) {
        optionsJR = removeJR(value);
        if (optionsJR.length===0) {
            return play(player,value);
        }
        var side = Math.floor(Math.random()*optionsJR.length);
        var x = optionsJR[side][0];
        var y = optionsJR[side][1];
        return [-1,card,[x,y]];
    } else {
        var side = Math.floor(Math.random()*options[card].length);
        var x = options[card][side][0];
        var y = options[card][side][1];
        return [1,card,[x,y]];
    }
}