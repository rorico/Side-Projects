function playRandom(player,value) {
    var options = getOptions(players[player]);
    var useless = hasUselessCard(options);
    if (useless !== -1) {
        return [0,useless,[-1,-1]];
    }
    var action = 1;
    var card = Math.floor(Math.random()*options.length);
    var spots = options[card];
    if (spots === 0){
        spots = addJR();
    } else if (options[card] === -1) {
        spots = removeJR(value);
        if (!spots.length) {
            //have to choose another card, just change cards
            return playRandom(player,value);
        }
        var action = -1;
    }
    var side = Math.floor(Math.random()*spots.length);
    var x = spots[side][0];
    var y = spots[side][1];
    return [action,card,[x,y]];
}