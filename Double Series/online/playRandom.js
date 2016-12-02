var helpers = require("./helper.js");
var constants = require("./constants.js");
var getOptions = helpers.getOptions;
var hasUselessCard = helpers.hasUselessCard;
var addJoptions = helpers.addJoptions;
var removeJoptions = helpers.removeJoptions;

exports.play = playRandom;
exports.setup = setup;

function playRandom(hand,value,info) {
    var options = getOptions(hand,info);
    var useless = hasUselessCard(options);
    if (useless !== -1) {
        return {action:constants.PLAY_REPLACE,card:useless};
    }
    var action = constants.PLAY_ADD;
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
        action = constants.PLAY_REMOVE;
    }
    var side = Math.floor(Math.random()*spots.length);
    return {action:action,card:card,position:spots[side]};
}

function setup(info) {
    helper.setup(info);
}