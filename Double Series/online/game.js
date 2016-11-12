const fs = require("fs");
//settings
var maxGame = 1000;
var speed = 00;
var human = [false,false,false,false];
var showMoves = false;
var checkValid = true;


var playBlue;
var playGreen;
var playerAIs = [,,,];

setAI([0,1,2,3],"playRandom");
/*
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
    return playRandom(player,3);
    //return playHybrid(player,3);
    //return playAI(player,3,true);
    //return playBest(player,3,true);
    //return playAIphil(player,3,true);
    //return playSides(player,3,true);
    //return playWorth(player,3,true);      //currently doesn't work
}*/


var keepgoing = true;       //allows for pauses anywhere in code
var gameN = 0;
var turnN = 0;
var pauseable = true;
var unpauseable = false;
//game parts
var board = [];
var deck = [];
var greenwin = 0;
var bluewin = 0;
var ties = 0;

var maxCards = 108;
var handLength = 7;

var pointworth = [];
var points = [];
var players = [];
var blueLines = 0;
var greenLines = 0;
var cardsleft = maxCards - 4 * handLength - 1;
var cardsPlayed = [];
var gameEnd = false;
var animate = false;
var info = {
    board:board,
    points:points,
    blueLines:blueLines,
    greenLines:greenLines,
    cardsPlayed:cardsPlayed,
    cardsleft:cardsleft,
    getOptions:getOptions
};

var PLAY_REPLACE = 0;
var PLAY_REMOVE = -1;
var PLAY_ADD = 1;
var PLAY_FINISH = 2;
exports.startGame = function() {
    createBoard();
    newGame();
    //delayedStart(0,0);
}
exports.human = human;
exports.checkValid = checkValid;
exports.cardsPlayed = cardsPlayed;
exports.board = board;
exports.players = players;
exports.newBoard = createBoard;
exports.newGame = newGame;
exports.start = delayedStart;
exports.playCard = playCard;
exports.setAI = setAI;
exports.play = playAI;
function playAI() {
    var player = turnN % 4;
    var team = ((player%2)*2) + 1;    //1 for players 1 and 3, 3 for 2 and 4
    var hand = players[player];
    var ret = {};
    if (human[player]) {
        ret.status = 2;
        ret.player = player;
    } else {
        //return is [action,card,[x,y]]  action: 1 = add, 0 = replaceCard, -1 = removeJ, 2 = add and finish line

        console.log(playerAIs);
        console.log(playerAIs[player]);
        var result = playerAIs[player](hand,team,info);
        var play = playCard(player,team,result);
        ret.player = player;
        ret.status = 1;
        ret.play = result;
        ret.newCard = play[1];
        ret.nextPlayer = play[2];
    }
    return ret;
}

function setAI(playerList,AIname) {
    console.log("test");
    try {
        var test = require("./" + AIname + ".js");
        console.log(test);
        var AI = require("./" + AIname + ".js").play;
        console.log(AI);
        for (var i = 0 ; i < playerList.length ; i++) {
            playerAIs[playerList[i]] = AI;
            /*if (player % 2 === 1) {
                playBlue = AI;
            } else {
                playGreen = AI;
            }*/
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
    console.log("end");
}


exports.test = function() {
    console.log(animate);
}

function start(turn,game) {
    pauseable = true;
    if (turn < maxCards && greenLines<2 && blueLines<2 && keepgoing && !gameEnd) {
        gameN = game;
        turnN = turn;
        var player = turn % 4;
        var team = ((player%2)*2) + 1;    //1 for players 1 and 3, 3 for 2 and 4
        var hand = players[player];

        if (human[player]) {
            keepgoing = true;
            pauseable = false;
            playHuman(player,team);
            return;
        } else {
            if (hand.length) {
                var AI;
                if (team === 1) {
                    AI = playBlue;
                } else if (team === 3) {
                    AI = playGreen;
                }
                var result = AI(hand); //return is [action,card,[x,y]]  action: 1 = add, 0 = replaceCard, -1 = removeJ, 2 = add and finish line
                //results checked here
                playCard(player,team,result);
                //would like another way to do this
                if (result[0] === PLAY_REPLACE) {
                    turn--;
                }
            }
        }
        delayedStart(turn+1,game);
    } else if (!keepgoing) {       //pauses
        gameN = game;
        turnN = turn;
        unpauseable = true;
        $('#pause').css('display','block');
    } else if (gameEnd) {         //this allows for game ends shown at 0 speed
        gameEnd = false;
        newGame();
        delayedStart(0,game+1);
    } else {                //end game
        if (greenLines >= 2){
            greenwin++;
        } else if (blueLines >= 2){
            bluewin++;
        } else {
            ties++;
        }
        gameN = game;
        turnN = turn;
        var totalGames = game + 1;  //0-index
        
        if (totalGames < maxGame) {
            setTimeout(function(){
                gameEnd = true;
                start(turn,game);
            },speed*3);
        } else {
            pauseable = false;
            showWorth();
        }
    }
}

function getPercentage(num,den) {
    return ((num/den)*100).toFixed(2) + "%";
}

function delayedStart(turn,game) {
    if (speed <= 0) {
        start(turn,game);
    } else {
        setTimeout(function(){
            start(turn,game);
        },speed);
    }
}

function playCard(player,team,result) {
    console.log(player,team,result);
    var hand = players[player];
    var action = result[0];
    var card = result[1];
    var place = result[2];
    var x = place[0];
    var y = place[1];
    if (checkValid) {
        if (!checkValidPlay(action,hand[card],x,y,team,result[3])) {
            pause();
            console.log("player:",player,"cards:",hand,"team:",team,"play:",result);
            return [false,-2];
        }
    }
    var replace = false;
    switch (action) {
    case PLAY_REPLACE:
        //do nothing here
        replace = true;
        break;
    case PLAY_REMOVE:
        removePoint(x,y);
        break;
    case PLAY_ADD:
        addPoint(x,y,team);
        checker(x,y);
        break;
    case PLAY_FINISH:
        addPoint(x,y,team);
        var finishedLine = result[3];
        for (var i = 0 ; i < finishedLine.length ; i++) {
            finishLine(finishedLine[i][0],finishedLine[i][1]);
        }
        finishLine(x,y,team);
        break;
    }
    var nextPlayer;
    if (replace) {
        nextPlayer = player;
    } else {
        turnN++;
        nextPlayer = (player+1) % 4;
    }
    cardsPlayed.push([player,action,players[player][card],[x,y]]);
    drawCard(player,card,team,replace);
    return [true,players[player][card],nextPlayer];
}

function checkValidPlay(action,card,x,y,team,finishedLine) {
    switch (action) {
    case PLAY_REPLACE: //throw away card
        if (card === 0 || card === -1) {
            return false;
        }
        if (cardOptions(card).length) {
            return false;
        }
        break;
    case PLAY_REMOVE: //remove J
        if (card !== -1) {
            return false;
        }
        if (points[x][y] !== 4 - team) {
            return false;
        }
        break;
    case PLAY_FINISH: //add and finish line
        for (var i = 0 ; i < finishedLine.length ; i++) {
            if (points[finishedLine[i][0]][finishedLine[i][1]] !== team) {
                return false;
            }
        }
        //fall through and also check add
    case PLAY_ADD: //add
        if (card !== 0) {
            if (points[x][y] !== 0) {
                return false;
            }
        }
        break;

    default: //shouldn't get here
        return false;
        break;
    }
    return true;
}

//remove or refactor
function noDelay() {
    animate = false;
    for (var j = 0 ; j < maxGame ; j++) {
        for ( var i = 0 ; i < 104 && greenLines<2 && blueLines<2 && keepgoing && gameEnd ; i++){
            switch (i%4) {
                case 0:
                    playBlue(0);
                    break;
                case 1:
                    playGreen(1);
                    break;
                case 2:
                    playBlue(2);
                    break;
                case 3:
                    playGreen(3);
                    break;
            }
        }
        if (greenLines>=2){
            greenwin++;
        } else if (blueLines>=2){
            bluewin++;
        } else {
            ties++;
        }
        gameN=j;
        turnN=i;
        $('#bluewin').text(bluewin);
        $('#greenwin').text(greenwin);
        $('#ties').text(ties);
        $('#blueP').text(((bluewin/(j+1))*100).toFixed(2)+"%");
        $('#greenP').text(((greenwin/(j+1))*100).toFixed(2)+"%");
        $('#tieP').text(((ties/(j+1))*100).toFixed(2)+"%");
        newGame();
    }
    showWorth();
}

//array of options that player can play
//Output [card][side][row x, col y]
function getOptions(cards) {
    var options = [];
    for ( var k = 0 ; k < cards.length ; k++) {
        var sides = [];
        var card = cards[k];
        //if jacks, just push jacks
        if (card === 0 || card === -1) {
            sides = card;
        } else {
            sides = cardOptions(card);
        }
        options.push(sides);
    }
    return options;
}

//returns x,y coordinates for the card, does not work with Js
function cardOptions(card) {
    var possible = [];
    if (card === 1) {
        possible = [[0,0],[0,9],[9,0],[9,9]];
    } else if (card < 10) {
        possible = [[0,card-1],[9,10-card]];
    } else {
        var x = Math.floor(card/10);
        var y = card % 10;
        possible = [[x,y],[9-x,9-y]];
    }
    var sides = [];
    for ( var i = 0 ; i < possible.length ; i++ )
    {
        if (points[possible[i][0]][possible[i][1]]===0) {
            sides.push([possible[i][0],possible[i][1]]);
        }
    }
    return sides;
}

//pick up new card
function drawCard(player,card,team,replace) {
    if (animate) {
        $("#card_played").prepend("<div class='c"+team+"'>"+changeToCards(players[player][card])+"</div>");
    }
    if (showMoves) {
        showPlaces(player);
    }
    var remove = false;
    if (cardsleft !== -1) {
        players[player][card] = deck[cardsleft];
        cardsleft--;
    } else {
        players[player].splice(card,1);
        remove = true;
    }
    if (animate) {
        animateHand(player,card,remove,replace);
    }
}

//checks if lines is won and turns them over
//if can finish multiple, finishes all
function checker(x,y) {
    var team = points[x][y];
    checkDirection(x,y,1,1,team);
    checkDirection(x,y,1,0,team);
    checkDirection(x,y,0,1,team);
    checkDirection(x,y,1,-1,team);
}

function checkDirection(x,y,dirX,dirY,team) {
    var tnp = [];

    var checkUp = true;
    var checkDown = true;
    
    var cnt = 0;
    
    var xUp = x;
    var xDown = x;
    var yUp = y;
    var yDown = y;
    
    for (var i = 1 ; i < 5 ; i++) {
        xUp += dirX;
        yUp += dirY;
        if (!outOfBounds(xUp,yUp) && checkUp && points[xUp][yUp]===team) {
            cnt++;
            tnp.push([xUp,yUp]);
        } else {
            checkUp = false;
        }

        xDown -= dirX;
        yDown -= dirY;
        if (!outOfBounds(xDown,yDown) && checkDown && points[xDown][yDown]===team) {
            cnt++;
            tnp.push([xDown,yDown]);
        } else {
            checkDown = false;
        }
    }
    if (cnt === 8) {
        if (team === 1) {
            blueLines += 2;
        } else if (team === 3){
            greenLines += 2;
        }
        finishLine(x,y,team);
        for (var i = 0 ; i < 8 ; i++){
            finishLine(tnp[i][0],tnp[i][1],team);
        }
    } else if (cnt >= 4) {
        if (team === 1) {
            blueLines++;
        } else if (team === 3){
            greenLines++;
        }
        finishLine(x,y,team);
        for (var i = 0 ; i < 4 ; i++){
            finishLine(tnp[i][0],tnp[i][1],team);
        }
    }
}

function outOfBounds(x,y) {
    return x > 9 || x < 0 || y > 9 || y < 0;
}

//-----------auxilary functions-------------------//
//position of Add J, -1 if none
function hasAdd(player) {
    for (var i = 0 ; i < player.length ; i++){
        if (player[i] === 0) {
            return i;
        }
    }
    return -1;
}

//position of Remove J, -1 if none
function hasRemove(player) {
    for (var i = 0 ; i < player.length ; i++){
        if (player[i] === -1) {
            return i;
        }
    }
    return -1;
}

function hasOnlyJ(player) {
    for (var i = 0 ; i < player.length ; i++){
        if (player[i]!==-1 && player[i]!==0) {
            return false;
        }
    }
    return true;
}

function hasOnlyRemoveJ(player) {
    for (var i = 0 ; i < player.length ; i++){
        if (player[i] !== -1) {
            return false;
        }
    }
    return true;
}

//has a useless card
function hasUselessCard(options) {
    for (var i = 0 ; i < options.length ; i++){
        //if J, length will be undefined
        if (options[i].length === 0) {
            return i;
        }
    }
    return -1;
}

//---------------------------------------------//

//-----------------game functions--------------//
//creates board and deck
function createBoard() {
    //creates indexes for rows 1 - 5
    for (var row = 0 ; row < 5 ; row++) {
        var rowinfo = [];
        var pointsrow = [];
        var pointworthrow = [];
        for (var col = 1 ; col <= 10 ; col++) {
            if (row === 0) {
                if (col === 1 || col === 10) {
                    rowinfo.push(1);
                    pointsrow.push(0);
                    pointworthrow.push(0);
                } else {
                    rowinfo.push(col);
                    pointsrow.push(0);
                    pointworthrow.push(0);
                }
            } else {
                rowinfo.push(10*row + col - 1);
                pointsrow.push(0);
                pointworthrow.push(0);
            }
        }
        board.push(rowinfo);
        points.push(pointsrow);
        pointworth.push(pointworthrow);
    }

    //copies a reverse of rows 1 - 5
    for (var i = 0 ; i < 5 ; i++) {
        board.push(board[4-i].slice().reverse());
        points.push(points[4-i].slice());
        pointworth.push(pointworth[4-i].slice());
    }

    //creates deck with 4 add Js, 4 remove Js, 4 corner pieces, and 2 of each other card
    for (var i = 2 ; i < 50 ; i++) {
        deck.push(i);
        deck.push(i);
    }
    for (var i = 0 ; i < 4 ; i++) {
        deck.push(1);
        deck.push(0);
        deck.push(-1);
    }
    
}

//restart game
function newGame() {
    for (var row = 0 ; row < 10 ; row++) {
        for (var col = 0 ; col < 10 ; col++) {
            points[row][col]=0;
        }
    }

    shuffle(deck);
    var player1 = [];
    var player2 = [];
    var player3 = [];
    var player4 = [];
    for (var i = maxCards - handLength ; i < maxCards ; i++) {
        player1.push(deck[i]);
    }
    for (var i = maxCards - 2 * handLength ; i < maxCards - handLength ; i++) {
        player2.push(deck[i]);
    }
    for (var i = maxCards - 3 * handLength ; i < maxCards - 2 * handLength ; i++) {
        player3.push(deck[i]);
    }
    for (var i = maxCards - 4 * handLength ; i < maxCards - 3 * handLength ; i++) {
        player4.push(deck[i]);
    }
    players = [player1,player2,player3,player4];
    //change this later
    exports.players = players;
    currentPlayer = 0;
    pastPlayer = -1;
    pastCardIndex = -1;
    pastCard = -2;
    cardsPlayed = [];
    cardsleft = maxCards - 4 * handLength - 1;
    blueLines = 0;
    greenLines = 0;
}


//shuffle deck
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;
  
    // While there remain elements to shuffle...
    while (currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

//changes a team to 0 because of remove J
function removePoint(x,y) {
    points[x][y] = 0;
        var position = 10*x + y + 1;
        if (animate) {
        $('#'+position).removeClass();
        $('#'+position).addClass('v0');
        }
}

//changes team to given team of card played
function addPoint(x,y,team) {
    points[x][y] = team;
        var position = 10*x + y + 1;
        if (animate) {
        $('#'+position).removeClass('v0');
        $('#'+position).addClass('v'+team);
        }
}

//creates a line
function finishLine(x,y,team) {
    points[x][y] = team + 1;
    pointworth[x][y]++;
        var position = 10*x + y + 1;
        if (animate) {
        $('#'+position).removeClass('v'+team);
        $('#'+position).addClass('v'+(team+1));
        }
}