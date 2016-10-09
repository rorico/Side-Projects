//settings
var maxGame = 1000;
var speed = 00;
var human = [false,false,false,false];
var showMoves = false;
//game play
function playBlue(player) {
    //return playRandom(player,1);
    //return playHybrid(player,1);
    //return playAI(player,1,true);
    return playBest(player,1,true);
    //return playAIphil(player,1,true);
    //return playSides(player,1,true);
    //return playWorth(player,1,true);      //currently doesn't work
}
function playGreen(player) {
    //return playRandom(player,3);
    //return playHybrid(player,3);
    //return playAI(player,3,true);
    return playBest(player,3,true);
    //return playAIphil(player,3,true);
    //return playSides(player,3,true);
    //return playWorth(player,3,true);      //currently doesn't work
}
