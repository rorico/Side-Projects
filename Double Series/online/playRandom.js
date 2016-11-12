var helpers = require("./helper.js");
var getOptions = helpers.getOptions;
var hasUselessCard = helpers.hasUselessCard;
var addJoptions = helpers.addJoptions;
var removeJoptions = helpers.removeJoptions;

exports.play = playRandom;

function playRandom(hand,value,info) {
    helpers.setUp(info);
    var options = getOptions(hand,info);
    var useless = hasUselessCard(options);
    if (useless !== -1) {
        return [0,useless,[-1,-1]];
    }
    var action = 1;
    var card = Math.floor(Math.random()*options.length);
    var spots = options[card];
    if (spots === 0){
        spots = addJoptions();
    } else if (options[card] === -1) {
        spots = removeJoptions(value);
        if (!spots.length) {
            //have to choose another card, just change cards
            return playRandom(hand,value,info);
        }
        var action = -1;
    }
    var side = Math.floor(Math.random()*spots.length);
    var x = spots[side][0];
    var y = spots[side][1];
    return [action,card,[x,y]];
}