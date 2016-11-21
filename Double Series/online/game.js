const fs = require("fs");
//settings
var maxGame = 1000;
var speed = 500;
var human = [false,false,false,false];
var checkValid = true;
var playerAIs = [];
var defaultAI = require("./playRandom.js").play;

//game parts
var board = [];
var deck = [];
var gameN = 0;
var turnN = 0;
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
var winner = -1;
var info = {
    board:board,
    points:points,
    blueLines:blueLines,
    greenLines:greenLines,
    cardsPlayed:cardsPlayed,
    cardsleft:cardsleft,
};

var PLAY_REPLACE = 0;
var PLAY_REMOVE = -1;
var PLAY_ADD = 1;
var PLAY_FINISH = 2;
exports.startGame = function() {
    createBoard();
    newGame();
    //delayedStart(0,0);
};
exports.human = human;
exports.checkValid = checkValid;
exports.cardsPlayed = cardsPlayed;
exports.board = board;
exports.players = players;
exports.newBoard = createBoard;
exports.newGame = newGame;
exports.setAI = setAI;
exports.play = play;

function setAI(playerList,AIname) {
    try {
        var AI = require("./" + AIname + ".js").play;
        for (var i = 0 ; i < playerList.length ; i++) {
            playerAIs[playerList[i]] = AI;
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

function play(player,result) {
    if (player === undefined) {
        player = turnN % 4;
        var team = ((player%2)*2) + 1;    //1 for players 1 and 3, 3 for 2 and 4
        var hand = players[player];
        //return is [action,card,[x,y]]  action: 1 = add, 0 = replaceCard, -1 = removeJ, 2 = add and finish line
        var AI = playerAIs[player];
        AI = AI ? AI : defaultAI;
        result = AI(hand,team,info);
    } else if (player !== turnN % 4) {
        console.log("not your turn");
    }
    //the play is checked in here
    return playCard(player,result);
}

function playCard(player,result) {
    var ret = {};
    var team = ((player%2)*2) + 1;    //1 for players 1 and 3, 3 for 2 and 4
    var hand = players[player];
    var action = result[0];
    var card = result[1];
    var place = result[2];
    var x = place[0];
    var y = place[1];
    var finishedLines = result[3];
    if (checkValid && !checkValidPlay(player,action,card,x,y,team,finishedLines)) {
        console.log("error playing: player:",player,"cards:",hand,"team:",team,"play:",result);
        ret.status = -1;
        //return [false,-2];
    } else {
        ret.status = 1; //this may be overriten later
        var all = {};   //used to tell everyone what happened this turn
        ret.all = all;
        all.player = player;
        all.cardPlayed = cardPlayed;
        var replace = false;
        switch (action) {
        case PLAY_REPLACE:
            //do nothing here
            replace = true;
            break;
        case PLAY_REMOVE:
            all.position = place;
            removePoint(x,y);
            break;
        case PLAY_ADD:
            all.position = place;
            addPoint(x,y,team);
            var check = checker(x,y,team);
            if (check.length) {
                action = PLAY_FINISH;
                var checkLines = chooseFinishLine(check);
                all.finishedLines = checkLines;
                finishLines(checkLines,team);
                checkGameDone();
                if (gameEnd) {
                    ret.status = 3;
                    all.winner = winner;
                }
            }
            break;
        case PLAY_FINISH:
            all.position = place;
            all.finishedLines = finishedLines;
            finishLines(finishedLines,team);
            //need to finish before checking, or will get same lines
            var check = checker(x,y,team);
            if (check.length) {
                var checkLines = chooseFinishLine(check);
                all.finishedLines.concat(checkLines);
                finishLines(chooseFinishLine(check),team);
            }
            checkGameDone();
            if (gameEnd) {
                ret.status = 3;
                all.winner = winner;
            }
            break;
        }
        all.action = action;
        var cardPlayed = players[player][card];
        all.cardPlayed = cardPlayed;
        cardsPlayed.push(all);//[player,action,cardPlayed,[x,y],finishedLine]);
        drawCard(player,card,team,replace);
        ret.newCard = players[player][card];

        //get player who plays next
        var nextPlayer;
        if (replace) {
            nextPlayer = player;
        } else {
            turnN++;
            nextPlayer = (player+1) % 4;
        }

        //if nextHand is empty, keep going
        for (var i = 0 ; i < 4 ; i++) {
            if (players[nextPlayer].length) {
                break;
            } else {
                turnN++;
                nextPlayer = (nextPlayer+1) % 4;
            }
        }
        ret.nextPlayer = nextPlayer;
        if (human[nextPlayer]) {
            //means waiting for player next turn
            ret.status = 2;
        }
    }
    return ret;
}

//updates gameEnd if game is done
function checkGameDone() {
    if (greenLines >= 2) {
        winner = 3;
        gameEnd = true;
    } else if (blueLines >= 2) {
        winner = 1;
        gameEnd = true;
    }
}

function checkValidPlay(player,action,cardIndex,x,y,team,finishedLines) {
    if (gameEnd) {
        return false;
    }
    if (turnN % 4 !== player) {
        return false;
    }
    var card = players[player][cardIndex];
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
    if (cardsleft !== -1) {
        players[player][card] = deck[cardsleft];
        cardsleft--;
    } else {
        players[player].splice(card,1);
        checkNoCards();
    }
}

//updates gameEnd if no cards left to play is done
function checkNoCards() {
    for (var i = 0 ; i < players.length ; i++) {
        if (players[i].length) {
            return;
        }
    }
    //no cards left
    gameEnd = true;
    winner = 0;
}

//checks if lines is won and turns them over
//if can finish multiple, finishes all
function checker(x,y,team) {
    var ret = [];
    var changed = false;
    var dirs = [
        [1,1],
        [1,0],
        [0,1],
        [1,-1]
    ];
    for (var i = 0 ; i < dirs.length ; i++) {
        var lines = checkDirection(x,y,dirs[i][0],dirs[i][1],team);
        if (lines.length === 9) {
            //2 lines, seperate them
            ret.push(lines.slice(0,5));
            ret.push(lines.slice(4,9));
        } else if (lines.length >= 5) {
            ret.push(lines);
        }
    }
    return ret;
}

function checkDirection(x,y,dirX,dirY,team) {
    var list = [[x,y]];

    var checkUp = true;
    var checkDown = true;
    
    var xUp = x;
    var xDown = x;
    var yUp = y;
    var yDown = y;
    
    for (var i = 1 ; i < 5 && checkUp; i++) {
        xUp += dirX;
        yUp += dirY;
        if (!outOfBounds(xUp,yUp) && points[xUp][yUp]===team) {
            list.push([xUp,yUp]);
        } else {
            checkUp = false;
        }
    }
    for (var i = 1 ; i < 5 && checkDown; i++) {
        xDown -= dirX;
        yDown -= dirY;
        if (!outOfBounds(xDown,yDown) && points[xDown][yDown]===team) {
            list.unshift([xDown,yDown]);
        } else {
            checkDown = false;
        }
    }
    return list;
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
    //change this later
    exports.cardsPlayed = cardsPlayed;
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