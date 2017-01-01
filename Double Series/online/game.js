const newHelper = require("./boardHelper");
const constants = require("./constants");
const newBoard = require("./board");

module.exports = function() {
    var ret = {};

    //settings
    var board = newBoard();
    var helper = newHelper(board.points);
    var maxGame = 1000;
    var speed = 500;
    var checkValid = true;
    var defaultAI = "playBest";
    var maxNumHumanPlayers = 4;

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

    ret.setSettings = function(obj) {
        for (var setting in obj) {
            var val = obj[setting];
            switch (setting) {
                case "maxGame":
                    maxGame = val;
                    break;
                case "speed":
                    speed = val;
                    break;
                case "checkValid":
                    checkValid = val;
                    break;
                case "maxNumHumanPlayers":
                    maxNumHumanPlayers = val;
                    break;
            }
        }
    };

    //this iife generally controls the flow of the game
    (function() {
        var players = [];
        var spectators = [];
        var activePlayers = 0;
        var nextPlayTimer = -1;
        var recentLeave = -1;

        ret.addHuman = addHuman;
        ret.addSpectator = addSpectator;
        ret.setAI = setAI;
        ret.spaces = function() {
            return {activePlayers:activePlayers,maxNumHumanPlayers:maxNumHumanPlayers};
        };

        //start
        createDeck();
        initializeDefaultAI();

        newGame();

        function initializeDefaultAI() {
            setAI([0,1,2,3],defaultAI);
        }

        function setAI(playerList,AIname) {
            try {
                var constructor = require("./AI/" + AIname);
                for (var i = 0 ; i < playerList.length ; i++) {
                    var player = playerList[i];
                    addPlayer(player,constructor,false);
                }
            } catch (err) {
                console.log(err);
            }
        }

        function addHuman(playerObj) {
            var ret = {};
            var player = recentLeave === -1 ? getOpenPlayerSlot() : recentLeave;
            recentLeave = -1;
            if (player !== -1 && addPlayer(player,playerObj,true)) {
                ret.success = true;
                ret.remove = function() {
                    removePlayer(player);
                };

                activePlayers++;
                if (player === nextPlayer) {
                    //this will stop the currently running AI
                    clearTimeout(nextPlayTimer);
                    playNext();
                } else if (activePlayers === 1) {
                    //this means this is only player
                    playNext();
                }
            } else {
                ret.success = false;
            }
            return ret;
        }

        //returns true on success
        function addPlayer(player,playerConstructor,human) {
            var gameInfo = getAllInfo();
            gameInfo.type = "start";
            gameInfo.player = player;
            gameInfo.team = helper.getTeam(player);
            gameInfo.hand = hands[player];
            try {
                var playerObj = playerConstructor(gameInfo);
                playerObj.human = human;
                if (typeof playerObj.play !== "function") {
                    return false;
                }
                if (!human) {
                    //not sure if this will work;
                    //wrap AI play to be callback, don't want to change the way AI returns
                    var AIplay = playerObj.play;
                    playerObj.play = function(hand,team,info,callback) {
                        var startTime;
                        if (speed) {
                            startTime = +new Date();
                        }
                        var result = AIplay(hand,team,info);
                        if (speed) {
                            setTimeout(function() {
                                callback(result);
                            },speed - new Date() + startTime);
                        } else {
                            callback(result);
                        }
                    };
                }
                players[player] = playerObj;
                return true;
            } catch (err) {
                console.log(err.stack);
                return false;
            }
        }

        function getOpenPlayerSlot() {
            for (var player = 0 ; player < players.length ; player++) {
                if (!players[player].human) {
                    return player;
                }
            }
            return -1;
        }

        function addSpectator(spectateObj,level) {
            //this is only used for simulation, so a lot things are missing - remove, etc
            var ret = {};
            spectators.push(spectateObj);

            //from addPlayer
            var gameInfo = getAllInfo();
            gameInfo.type = "start";
            if (spectateObj.setup) {
                spectateObj.setup(JSON.stringify(gameInfo));
            }

            ret.success = true;

            activePlayers++;
            if (activePlayers === 1) {
                //this means this is only player
                playNext();
            }

            return ret;
        }

        function removePlayer(player) {
            if (players[player].human) {
                setAI([player],defaultAI);
            }
            activePlayers--;
            recentLeave = player;
            setTimeout(function() {
                if (recentLeave === player) {
                    recentLeave = -1;
                }
            },5000);

            if (activePlayers) {
                if (nextPlayer === player) {
                    nextPlayTimer = setTimeout(playNext,speed * 10);
                }
            } else {
                //stop game if no one is playing
                clearTimeout(nextPlayTimer);
            }
        }

        function playNext() {
            var player = nextPlayer;
            var team = helper.getTeam(player);
            var hand = hands[player];
            try {
                players[player].play(hand,team,board.getInfo(),function(result) {
                    playCard(player,result);
                });
            } catch (err) {
                //this will stop everything
                console.log(err.stack);
                //may want to change AI to something else
            }
        }

        function playCard(player,result) {
            if (!result) {
                //so to not destroy processTurn, will be caught later
                result = {};
            }
            var ret = processTurn(player,result);
            if (ret.status === -1) {
                console.log("something wrong with play");
            } else {
                if (ret.status === 1) {
                    playNext();
                } else if (ret.status === 3) {
                    sendEnd(ret.winner);
                    setTimeout(startNewGame,speed * 3);
                } else {
                    console.log("something went wrong");
                }
                sendPlay(ret);
            }
        }

        function startNewGame() {
            if (games < maxGame) {
                newGame();
                sendNewGame();
                playNext();
            } else {
                sendAllDone();
            }
        }

        function sendPlay(data) {
            //copy to not affect outside function
            var send = copyObject(data.all);
            var newCard = data.newCard;

            send.type = "play";
            for (var player = 0 ; player < players.length ; player++) {
                var onPlay = players[player].onPlay;
                if (onPlay) {
                    if (player === send.player) {
                        send.newCard = newCard;
                        onPlay(send);
                        delete send.newCard;
                    } else {
                        onPlay(send);
                    }
                }
            }

            for (var i = 0 ; i < spectators.length ; i++) {
                var spectator = spectators[i];
                var onPlay = spectator.onPlay;
                if (onPlay) {
                    if (spectator.lvl >= 5 || spectator.lvl === send.player) {
                        send.newCard = newCard;
                        onPlay(send);
                        delete send.newCard;
                    } else {
                        onPlay(send);
                    }
                }
            }
        }

        function sendEnd(winner) {
            var data = {type:"end",winner:winner};
            for (var player = 0 ; player < players.length ; player++) {
                if (players[player].onEndGame) {
                    players[player].onEndGame(data);
                }
            }
            for (var i = 0 ; i < spectators.length ; i++) {
                var onEndGame = spectators[i].onEndGame;
                if (onEndGame) {
                    onEndGame(data);
                }
            }
        }


        function sendNewGame() {
            var data = getAllInfo();
            data.type = "newGame";
            for (var player = 0 ; player < players.length ; player++) {
                if (players[player].onNewGame) {
                    data.hand = hands[player];
                    players[player].onNewGame(data);
                }
            }
            for (var i = 0 ; i < spectators.length ; i++) {
                var onNewGame = spectators[i].onNewGame;
                if (onNewGame) {
                    onNewGame(data);
                }
            }
        }

        function sendAllDone() {
            var data = {type:"allDone",bluewin:bluewin,greenwin:greenwin,ties:ties,games:games};
            for (var player = 0 ; player < players.length ; player++) {
                if (players[player].onAllDone) {
                    players[player].onAllDone(data);
                }
            }
            for (var i = 0 ; i < spectators.length ; i++) {
                var onAllDone = spectators[i].onAllDone;
                if (onAllDone) {
                    onAllDone(data);
                }
            }
        }

        function copyObject(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    })();

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
            board.playCard(player,team,play);

            //add check to see if finished
            if (play.action === constants.PLAY_FINISH) {
                checkGameDone();
            }

            ret.status = 1;     //this may be overriten later

            var all = play;     //used to tell everyone what happened this turn
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
            if (helper.outOfBounds(x,y)) {
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
                    if (helper.outOfBounds(point[0],point[1])) {
                        return false;
                    }
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
            if (helper.outOfBounds(x,y)) {
                return false;
            }
            if (board.points[x][y] !== 0) {
                return false;
            }
            if (card !== 0) {
                if (board.board[x][y] !== card) {
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
        games++;
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
    return ret;
}