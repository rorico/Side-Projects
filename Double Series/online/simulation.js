const game = require("./game");

var sendData = function(info) {
    console.log(info);
};

game.setSettings({
    speed:0,
    maxGame:1000,
    checkValid:false
});

game.setAI([1,3],"playBest")
game.setAI([0,2],"playRandom")

var player = {
    lvl:5,
    //setup:sendData,
    //onNewGame:sendData,
    //onPlay:sendData,
    onEndGame:sendData,
    onAllDone:function(info) {
        console.log(info);
        process.stdin.pause();
    }
};



var res = game.addSpectator(player);
if (res.success) {
    //keep process running
    process.stdin.resume();
} else {
    console.log("couldn't add simulation");
}

