const helper = require("./gameFunctions.js");
const constants = require("./constants.js");

//settings
var maxGame = 1000;
var speed = 500;
var human = [false,false,false,false];
var checkValid = true;
var playerAIs = [];
var defaultAI = getAI("playRandom");

//game parts
var board = [];
var deck = [];
var games = 0;
var nextPlayer = 0;
var greenwin = 0;
var bluewin = 0;
var ties = 0;

var maxCards = 108;
var handLength = 7;

var pointworth = [];
var points = [];
var hands = [];
var handLengths = [];
var blueLines = 0;
var greenLines = 0;
var cardsleft = maxCards - 4 * handLength - 1;
var cardsPlayed = [];
var gameEnd = false;
var winner = -1;

//start
createBoard();
helper.setUp(getInfo());

exports.getInfo = getInfo;
exports.getAllInfo = getAllInfo;
exports.human = human;
exports.getHand = getHand;
exports.checkValid = checkValid;
exports.newGame = newGame;
exports.setAI = setAI;
exports.play = play;

//since there are primitive types, need to refresh everything called
function getInfo() {
    return {
        board:board,
        points:points,
        blueLines:blueLines,
        greenLines:greenLines,
        cardsPlayed:cardsPlayed,
        cardsleft:cardsleft,
        handLengths:handLengths
    };
}

function getAllInfo() {
    return {
        board:board,
        points:points,
        blueLines:blueLines,
        greenLines:greenLines,
        bluewin:bluewin,
        greenwin:greenwin,
        games:games,
        cardsPlayed:cardsPlayed,
        cardsleft:cardsleft,
        handLengths:handLengths
    };
}

function getHand(player) {
    return hands[player];
}

function setAI(playerList,AIname) {
    for (var i = 0 ; i < playerList.length ; i++) {
        //create a seperate closure for each player
        var AI = getAI(AIname);
        if (AI) {
            playerAIs[playerList[i]] = AI;
        }
    }
}

function getAI(AIname) {
    try {
        var AI = require("./" + AIname);
        if (AI.setup) {
            AI.setup(getInfo());
        }
        return AI;
    } catch (err) {
        console.log(err);
    }
}

function play(player,play) {
    if (player === undefined) {
        player = nextPlayer;
        var team = helper.getTeam(player);
        var hand = hands[player];
        //return is [action,card,[x,y]]  action: 1 = add, 0 = replaceCard, -1 = removeJ, 2 = add and finish line
        var AI = playerAIs[player];
        var AIplay = AI && AI.play ? AI.play : defaultAI.play;
        play = AIplay(hand,team,getInfo());
    } else if (player !== nextPlayer) {
        console.log("not your turn");
    }
    //the play is checked in here
    return processTurn(player,play);
}

function processTurn(player,play) {
    //play object will change, but not used outside the function
    var ret = {};
    var team = helper.getTeam(player);
    var hand = hands[player];
    var action = play.action;
    var card = play.card;
    var position = play.position;
    var x = position ? position[0] : -1;
    var y = position ? position[1] : -1;
    var finishedLines = play.finishedLines;
    if (checkValid && !checkValidPlay(player,action,card,x,y,team,finishedLines)) {
        console.log("error playing: player:",player,"cards:",hand,"team:",team,"play:",play);
        ret.status = -1;
    } else {
        var replace = false;
        switch (action) {
        case constants.PLAY_REPLACE:
            //do nothing here
            replace = true;
            break;
        case constants.PLAY_REMOVE:
            break;
        case constants.PLAY_ADD: //same check for both
        case constants.PLAY_FINISH:
            //need to finish before checking, or will get same lines
            var check = helper.checker(x,y,team,finishedLines);
            if (check.length) {
                var checkLines = chooseFinishLine(check);
                if (action === constants.PLAY_FINISH) {
                    play.finishedLines.concat(checkLines);
                } else {
                    play.action = constants.PLAY_FINISH;
                    play.finishedLines = checkLines;
                }
            }
            break;
        }
        playCard(player,play);

        ret.status = 1; //this may be overriten later
        
        var all = play;   //used to tell everyone what happened this turn
        ret.all = all;
        all.player = player;
        all.cardPlayed = hands[player][card];

        cardsPlayed.push(all);
        ret.newCard = drawCard(player,card,team,replace);
        if (ret.newCard === undefined) {
            all.handSize = handLengths[player];
        }

        if (gameEnd) {
            ret.status = 3;
            ret.winner = winner;
        }

        if (ret.status === 1) {
            //get player who plays next
            if (replace) {
                nextPlayer = player;
            } else {
                nextPlayer = (player+1) % 4;
            }

            //if nextHand is empty, keep going
            for (var i = 0 ; i < 4 ; i++) {
                if (hands[nextPlayer].length) {
                    break;
                } else {
                    nextPlayer = (nextPlayer+1) % 4;
                }
            }
            all.nextPlayer = nextPlayer;
            if (human[nextPlayer]) {
                //means waiting for player next turn
                ret.status = 2;
            }
        }
    }
    return ret;
}

function playCard(player,play) {
    var position = play.position;
    var x = position ? position[0] : -1;
    var y = position ? position[1] : -1;
    var team = helper.getTeam(player);
    switch (play.action) {
    case constants.PLAY_REPLACE:
        //do nothing here
        break;
    case constants.PLAY_REMOVE:
        removePoint(x,y);
        break;
    case constants.PLAY_ADD:
        addPoint(x,y,team);
        break;
    case constants.PLAY_FINISH:
        addPoint(x,y,team);
        finishLines(play.finishedLines,team);
        checkGameDone();
        break;
    }
}

//updates gameEnd if game is done
function checkGameDone() {
    if (greenLines >= 2) {
        winner = 3;
        greenwin++;
        games++;
        gameEnd = true;
    } else if (blueLines >= 2) {
        winner = 1;
        bluewin++;
        games++;
        gameEnd = true;
    }
}

function checkValidPlay(player,action,cardIndex,x,y,team,finishedLines) {
    if (gameEnd) {
        return false;
    }
    if (nextPlayer !== player) {
        return false;
    }
    var card = hands[player][cardIndex];
    switch (action) {
    case constants.PLAY_REPLACE: //throw away card
        if (card === 0 || card === -1) {
            return false;
        }
        if (helper.cardOptions(card).length) {
            return false;
        }
        break;
    case constants.PLAY_REMOVE: //remove J
        if (card !== -1) {
            return false;
        }
        if (points[x][y] !== 4 - team) {
            return false;
        }
        break;
    case constants.PLAY_FINISH: //add and finish line
        if (!finishedLines) {
            return false;
        }
        for (var i = 0 ; i < finishedLines.length ; i++) {
            var line = finishedLines[i];
            //has to include current point
            var hasPoint = false;
            var slope = [-1,-1];
            for (var j  = 0 ; j < line.length ; j++) {
                var point = line[j];
                if (x===point[0] && y===point[1]) {
                    hasPoint = true;
                } else if (points[point[0]][point[1]] !== team) {
                    //can't check current point, maybe not updated yet
                    return false;
                }
                //check the line is all in the same line
                if (j) {
                    var prevPoint = line[j - 1];
                    var thisSlope = [point[0] - prevPoint[0],point[1] - prevPoint[1]];
                    if (j !== 1 && !(thisSlope[0] === slope[0] && thisSlope[1] === slope[1])) {
                        return false;
                    }
                    slope = thisSlope;
                }
            }
            if (!hasPoint) {
                return false;
            }
            //check the line has correct length
            if ((line.length - 1*hasPoint) % 4) {
                return false;
            }
        }
        //fall through and also check add
    case constants.PLAY_ADD: //add
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

//pick up new card, return value of newCard
function drawCard(player,card,team,replace) {
    if (cardsleft > 0) {
        cardsleft--; //0 index
        hands[player][card] = deck[cardsleft];
        return hands[player][card];
    } else {
        hands[player].splice(card,1);
        handLengths[player]--;
        checkNoCards();
        //returns nothing
    }
}

//updates gameEnd if no cards left to play is done
function checkNoCards() {
    for (var i = 0 ; i < hands.length ; i++) {
        if (hands[i].length) {
            return;
        }
    }
    //no cards left
    gameEnd = true;
    winner = 0;
    ties++;
}

//default choose, picks randomly
function chooseFinishLine(lines) {
    var chosen = [];
    for (var i = 0 ; i < lines.length ; i++) {
        var line = lines[i];
        if (line.length > 5) {
            var random = Math.floor(Math.random() * (line.length - 5));
            chosen.push(line.slice(random,random + 5));
        } else if (line.length === 5) {
            chosen.push(line);
        }
    }
    return chosen;
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
    cardsleft = maxCards;
    //4 players
    for (var i = 0 ; i < 4 ; i++) {
        hands[i] = deck.slice(cardsleft - handLength,cardsleft);
        handLengths[i] = handLength;
        cardsleft -= handLength;
    }
    cardsPlayed = [];
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
}

//changes team to given team of card played
function addPoint(x,y,team) {
    points[x][y] = team;
}

//creates a line
function finishLines(lines,team) {
    for (var i = 0 ; i < lines.length ; i++) {
        var line = lines[i];
        for (var j = 0 ; j < line.length ; j++) {
            var x = line[j][0];
            var y = line[j][1];
            points[x][y] = team + 1;
            pointworth[x][y]++;
        }
        if (team === 1) {
            blueLines++;
        } else if (team === 3){
            greenLines++;
        }  
    }
}