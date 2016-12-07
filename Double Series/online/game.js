const helper = require("./gameFunctions");
const constants = require("./constants");
const board = require("./board");

//settings
var maxGame = 1000;
var speed = 500;
var human = [false,false,false,false];
var checkValid = true;
var playerAIs = [];
var defaultAI;

//game parts
var deck = [];
var games = 0;
var nextPlayer = 0;
var greenwin = 0;
var bluewin = 0;
var ties = 0;

var maxCards = 108;
var handLength = 7;

var hands = [];
var handLengths = [];
var cardsleft;
var cardsPlayed;
var gameEnd;
var winner;
var winningPlayer = -1;

var activePlayers = [];

//start
createDeck();
helper.setUp(board.getInfo());
//defaultAI = getAI("playRandom");
defaultAI = getAI("playBest");
newGame();

exports.setAI = setAI;
exports.addPlayer = addPlayer;



function addPlayer(connection) {
    var player = getOpenPlayerSlot();
    if (player !== -1) {
        activePlayers.push({player:player,conn:connection});
        human[player] = true;

        var gameInfo = getAllInfo();
        gameInfo.type = "start";
        gameInfo.player = player;
        gameInfo.hand = hands[player];

        connection.sendUTF(JSON.stringify(gameInfo));

        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                var query = JSON.parse(message.utf8Data);
                var type = query ? query.type : "";
                switch(type) {
                case "play":
                    playCard(query.player,query.result);
                    break;
                default:
                    break;
                }
            }
        });

        connection.on('close', function(connection) {
            removePlayer(player);
        });
    }
}

function getOpenPlayerSlot() {
    for (var i = 0 ; i < human.length ; i++) {
        if (!human[i]) {
            return i;
        }
    }
    return -1;
}

function removePlayer(player) {
    human[player] = false;
}

function playCard(player,result) {
    var ret = play(player,result);
    if (ret.status === -1) {
        console.log("something wrong with play");
    } else {
        if (ret.status === 2) {
            //waiting for player input
        } else if (ret.status === 1) {
            //calls with no parameters
            setTimeout(playCard,500);
        } else if (ret.status === 3) {
            sendEnd(ret.winner);
            setTimeout(startNewGame,1500);
        } else {
            console.log("something went wrong");
        }
        sendPlay(ret);
    }
}

function sendPlay(data) {
    //copy to not affect outside function
    var send = copyObject(data.all);
    var player = send.player;
    var newCard = data.newCard;

    send.type = "play";
    var info = JSON.stringify(send);

    send.newCard = newCard;
    var prevPlayerInfo = JSON.stringify(send);
    for (var i = 0 ; i < activePlayers.length ; i++) {
        console.log(activePlayers[i])
        if (activePlayers[i].player === player) {
            activePlayers[i].conn.sendUTF(prevPlayerInfo);
        } else {
            activePlayers[i].sendUTF(info);
        }
    }
}

function sendEnd(winner) {
    var data = {type:"end",winner:winner};
    var info = JSON.stringify(data);
    for (var i = 0 ; i < activePlayers.length ; i++) {
        activePlayers[i].conn.sendUTF(info);
    }
}

function startNewGame() {
    var newHands = newGame();
    sendNewGame(newHands);
    setTimeout(playCard,500);
}

function sendNewGame(hands) {
    var data = getAllInfo();
    data.type = "newGame";
    for (var i = 0 ; i < activePlayers.length ; i++) {
        data.hand = hands[i];
        var info = JSON.stringify(data);
        activePlayers[i].conn.sendUTF(info);
    }
}

function copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function getInfo() {
    var info = board.getInfo();
    info.cardsPlayed = cardsPlayed;
    info.cardsleft = cardsleft;
    info.handLengths = handLengths;
    return info;
}

function getAllInfo() {
    var info = getInfo();
    info.bluewin = bluewin;
    info.greenwin = greenwin;
    info.games = games;
    info.handLengths = handLengths;
    info.nextPlayer = nextPlayer;
    return info;
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
            AI.setup(board.getInfo());
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
        var AI = playerAIs[player];
        var AIplay = AI && AI.play ? AI.play : defaultAI.play;
        try {
            play = AIplay(hand,team,board.getInfo());
        } catch (err) {
            //this will stop everything
            console.log(err);
            //as to not break the next part
            play = {};
        }
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
        board.playCard(player,play);

        //add check to see if finished
        if (play.action === constants.PLAY_FINISH) {
            checkGameDone();
        }

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
            winningPlayer = player;
            //for allInfo - new player
            nextPlayer = -1;
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
        if (board.points[x][y] !== 4 - team) {
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
                } else if (board.points[point[0]][point[1]] !== team) {
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
            if (board.points[x][y] !== 0) {
                return false;
            }
        }
        break;
    default: //shouldn't get here
        return false;
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

//updates gameEnd if game is done
function checkGameDone() {
    if (board.linesDone[3] >= 2) {
        winner = 3;
        greenwin++;
        games++;
        gameEnd = true;
    } else if (board.linesDone[1] >= 2) {
        winner = 1;
        bluewin++;
        games++;
        gameEnd = true;
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

//-----------------game functions--------------//
function createDeck() {
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
    board.newGame();
    gameEnd = false;
    winner = -1;
    nextPlayer = (winningPlayer + 1) % 4;
    shuffle(deck);
    cardsleft = maxCards;
    //4 players
    for (var i = 0 ; i < 4 ; i++) {
        hands[i] = deck.slice(cardsleft - handLength,cardsleft);
        handLengths[i] = handLength;
        cardsleft -= handLength;
    }
    cardsPlayed = [];
    return hands;
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