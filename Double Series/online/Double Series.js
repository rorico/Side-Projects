//start of ingame controls
$('#speed').val(speed);
$('#speed').keyup(function () {
    var thisSpeed = $(this).val();
    if (!isNaN(thisSpeed)) {
        speed = thisSpeed;
    }
});
$(window).keydown(function(e) {
    if (e.keyCode == 38) { //up key
        speed++;
        $('#speed').val(speed);
    } else if (e.keyCode == 40&&speed>0) { //down key
        speed--;
        $('#speed').val(speed);
    }
});
for (var i = 0 ; i < human.length ; i++) {
    if (human[i]) {
        $('input[name='+(i+1)+'][value=human]').attr('checked','checked');
    } else {
        $('input[name='+(i+1)+'][value=computer]').attr('checked','checked');
    }
}
$('input[type=radio]').on('change',function() {
    event.stopPropagation();
    if (this.value=="human") {
        human[this.name-1] = true;
    } else if (this.value=="computer") {
        human[this.name-1] = false;
    }
});
$('input[type=radio]').click(function() {
    event.stopPropagation();
});

var keepgoing = true;       //allows for pauses anywhere in code
var gameN = 0;
var turnN = 0;
var pauseable = true;
var unpauseable = false;
$(window).keypress(function(e) {
    if (e.keyCode === 0 || e.keyCode === 32) { //spacebar
        pause();
    }
});

function pause() {
    if (pauseable) {
        keepgoing = !keepgoing;
        if (keepgoing) {
            $('#pause').css('display','none');
            if (unpauseable) {
                unpauseable = false;
                delayedStart(turnN,gameN);
            }
        } else {
            $('#pause').css('display','block');
        }
    }
}

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
var animate = true;
var info = {board:board};

var PLAY_REPLACE = 0;
var PLAY_REMOVE = -1;
var PLAY_ADD = 1;
var PLAY_FINISH = 2;

var me;
var playedCard = -1;


$(document).ready(function() {
    createBoard();
    newGame();
    //delayedStart(0,0);
});

var socket = window.WebSocket || window.MozWebSocket;
var loc = window.location, new_uri;
if (loc.protocol === "https:") {
    new_uri = "wss:";
} else {
    new_uri = "ws:";
}
new_uri += "//" + loc.host;
var connection = new socket(new_uri);
connection.onerror = function (error) {
    console.log(error);
};

connection.onmessage = function (message) {
    var data = JSON.parse(message.data);
    switch (data.type) {
    case "start":
        if (data.player === undefined) {
            alert("something went very wrong");
        } else {
            me = data.player;
            if (data.hand) {
                players[me] = data.hand;
            }
            showHands();
        }
        if (data.cardsPlayed) {
            for (var i = 0 ; i < data.cardsPlayed.length ; i++) {
                var card = data.cardsPlayed[i];
                var position = card.position;
                var x = position ? position[0] : -1;
                var y = position ? position[1] : -1;
                var team = (card.player % 2) * 2 + 1;
                $("#card_played").prepend("<div class='c"+team+"'>"+changeToCards(card.cardPlayed)+"</div>");
                switch (card.action) {
                case PLAY_REPLACE:
                    //do nothing here
                    break;
                case PLAY_REMOVE:
                    removePoint(x,y);
                    break;
                case PLAY_ADD:
                    addPoint(x,y,team);
                    break;
                case PLAY_FINISH:
                    addPoint(x,y,team);
                    finishLines(card.finishedLines,team);
                    break;
                }
            }
        }
        if (data.myTurn) {
            playHuman(me,(me % 2) * 2 + 1);
        }
        break;
    case "play":
        if (data.player === undefined) {
            alert("something went very wrong");
        } else {
            if (data.player === me) {
                if (data.newCard === undefined) {
                    alert("something went very wrong");
                } else {
                    players[me][playedCard] = data.newCard;
                    $('#p'+me+'_'+playedCard).html(changeToCards(data.newCard));
                }
            }
            var position = data.position;
            var x = position ? position[0] : -1;
            var y = position ? position[1] : -1;
            var team = (data.player % 2) * 2 + 1;
            switch (data.action) {
            case PLAY_REPLACE:
                //do nothing here
                break;
            case PLAY_REMOVE:
                removePoint(x,y);
                break;
            case PLAY_ADD:
                addPoint(x,y,team);
                break;
            case PLAY_FINISH:
                addPoint(x,y,team);
                finishLines(data.finishedLines,team);
                break;
            }
            var card = data.cardPlayed;
            $("#card_played").prepend("<div class='c"+team+"'>"+changeToCards(card)+"</div>");
            if (data.myTurn) {
                setTimeout(function() {
                    playHuman(me,(me % 2) * 2 + 1);
                },speed);
            }
        }
        break;
    case "end":
        switch (data.winner) {
            case 0:
                ties++;
                break;
            case 1:
                bluewin++;
                break;
            case 3:
                greenwin++;
                break;
        }
        gameN++;
        var totalGames = gameN;// + 1;  //0-index
        $('#bluewin').text(bluewin);
        $('#greenwin').text(greenwin);
        $('#ties').text(ties);
        $('#blueP').text(getPercentage(bluewin,totalGames));
        $('#greenP').text(getPercentage(greenwin,totalGames));
        $('#tieP').text(getPercentage(ties,totalGames));
        break;
    }
}

function playData(player,result) {
    var data = {type:"play",player:player,result:result};
    connection.send(JSON.stringify(data));
}

function playCard(player,team,result) {
    var hand = players[player];
    var action = result[0];
    var card = result[1];
    var place = result[2];
    var x = place[0];
    var y = place[1];
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
    if (!replace) {
        turnN++;
    }
    cardsPlayed.push([player,action,players[player][card],[x,y]]);
    drawCard(player,card,team,replace);
    return [true,players[player][card]];
}

function getPercentage(num,den) {
    return ((num/den)*100).toFixed(2) + "%";
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
/*function checker(x,y,team) {
    //var team = points[x][y];
    var linesFinished = team === 1 ? blueLines : greenLines;
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
        if (lines.length >= 4) {
            if (!changed) {
                finishLine([[x,y]],team);
                changed = true;
            }

            if (lines.length % 4 === 0) {
                finishLine(lines,team);
                linesFinished += lines.length / 4;
            } else {
                //assume lines needed is only 2
                if (linesFinished) {
                    //pick a line at random
                    var random = Math.floor(Math.random() * (lines.length - 3));
                    finishLine(lines.slice(random,random + 4),team);
                    linesFinished++;
                } else if (ret.length) {
                    //pick a line at random
                    var random = Math.floor(Math.random() * (lines.length - 3));
                    finishLine(lines.slice(random,random + 4),team);

                    //pick a line at random
                    var random = Math.floor(Math.random() * (ret.length - 3));
                    finishLine(ret.slice(random,random + 4),team);
                    linesFinished += 2;
                    ret = [];
                } else {
                    ret = lines;
                }
            }
        }
    }
    if (team === 1) {
        blueLines = linesFinished;
    } else if (team === 3){
        greenLines = linesFinished;
    }
    return ret;
}*/

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

    //create board display
    var cnt = 1;
    for (var i = 0 ; i < board.length ; i++) {
        $('#board').append('<tr id =board'+i+'></tr>');
        for (var j = 0 ; j < board[i].length ; j++) {
            $('#board'+i).append('<td class="v'+points[i][j]+'" id="'+cnt+'">'+changeToCards(board[i][j])+'</td>');
            cnt++;
        }
    }
}

//restart game
function newGame() {
    for (var row = 0 ; row < 10 ; row++) {
        for ( var col = 0 ; col < 10 ; col++) {
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
    showHands();
    
    for (var i = 1 ; i <= 100 && animate; i++) {
        $('#'+i).removeClass();
        $('#'+i).addClass('v0');
    }
    currentPlayer = 0;
    pastPlayer = -1;
    pastCardIndex = -1;
    pastCard = -2;
    if (animate) {
        $('#card_played').empty();
    }
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

function getPosition(x,y) {
    return $("#" + (10*x + y + 1));
}

//changes a team to 0 because of remove J
function removePoint(x,y) {
    points[x][y] = 0;
    getPosition(x,y).removeClass().addClass();
}

//changes team to given team of card played
function addPoint(x,y,team) {
    points[x][y] = team;
    getPosition(x,y).removeClass("v0").addClass("v"+team);
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
            showFinishPoint(x,y,team);
        }
        if (team === 1) {
            blueLines++;
        } else if (team === 3){
            greenLines++;
        }
    }
}

function showFinishLine(line,team) {
    for (var i = 0 ; i < line.length ; i++) {
        showFinishPoint(line[i][0],line[i][1],team);
    }
}

function showFinishPoint(x,y,team) {
    getPosition(x,y).removeClass("v" + team).addClass("v"+(team+1));
}

//shows Hand on board
function showHands() {
    $("#p0").empty();
    $("#p1").empty();
    $("#p2").empty();
    $("#p3").empty();
    for (var i = 0 ; i < players.length ; i++) {
        for (var j = 0 ; j < players[i].length ; j++) {
            $("#p"+i).append("<div id='p"+i+"_"+j+"'>"+changeToCards(players[i][j])+"</div>");
        }
    }
}

var nextTurn;
function animateHand(player,card,remove,replace) {
    if (nextTurn) {
        nextTurn();
        nextTurn = undefined;
    }

    $('#p'+player+'_'+card).addClass('raise');

    nextTurn = function() {
        if (remove) {
            $('#p'+player+'_'+card).removeClass('raise');
            var size = players[player].length;
            $('#p'+player+'_'+size).remove();
            for (var i = card ; i < size ; i++) {
                $('#p'+player+'_'+i).html(changeToCards(players[player][i]));
            }
        } else {
            $('#p'+player+'_'+card).removeClass('raise');
            $('#p'+player+'_'+card).html(changeToCards(players[player][card]));
        }
    };
    //want to update quicker as will have to use hand again
    if (replace) {
        nextTurn();
        nextTurn = undefined;
    }
}

function showWorth() {
    for (var x = 0 ; x < 10; x++) {
        for (var y = 0 ; y < 10; y++) {
            getPosition(x,y).removeClass().addClass("v0").text(pointworth[x][y]);
        }
    }
    $("#values").append(JSON.stringify(pointworth));
}

function hideHands(player) {
    for (var i = 0 ; i < players.length ; i++) {
        if (i === player) {
            continue;
        }
        for (var j = 0 ; j<players[i].length; j++) {
            $('#p'+i+'_'+j).addClass('hide');
        }
    }
}

//change card numbers to corresponding card in game
function changeToCards(number) {
    switch (number) {
        case -1:
            return "J -";
        case 0:
            return "J +";
        case 1:
            return "&#9734";
        case 2:
            return "10 &#9825";
        case 3:
            return "9 &#9825";
        case 4:
            return "8 &#9825";
        case 5:
            return "7 &#9825";
        case 6:
            return "7 &#9827";
        case 7:
            return "8 &#9827";
        case 8:
            return "9 &#9827";
        case 9:
            return "10 &#9827";
        case 10:
            return "10 &#9824";
        case 11:
            return "K &#9825";
        case 12:
            return "6 &#9825";
        case 13:
            return "5 &#9825";
        case 14:
            return "4 &#9825";
        case 15:
            return "4 &#9827";
        case 16:
            return "5 &#9827";
        case 17:
            return "6 &#9827";
        case 18:
            return "K &#9827";
        case 19:
            return "10 &#9671";
        case 20:
            return "9 &#9824";
        case 21:
            return "6 &#9824";
        case 22:
            return "Q &#9825";
        case 23:   
            return "3 &#9825";
        case 24:   
            return "2 &#9825";
        case 25:   
            return "2 &#9827";
        case 26:   
            return "3 &#9827";
        case 27:   
            return "Q &#9827";
        case 28:   
            return "6 &#9671";
        case 29:
            return "9 &#9671";
        case 30:
            return "8 &#9824";
        case 31:
            return "5 &#9824";
        case 32:
            return "3 &#9824";
        case 33:
            return "Q &#9824";
        case 34:
            return "A &#9825";
        case 35:
            return "A &#9827";
        case 36:
            return "Q &#9671";
        case 37:
            return "3 &#9671";
        case 38:
            return "5 &#9671";
        case 39:
            return "8 &#9671";
        case 40:
            return "7 &#9824";
        case 41:  
            return "4 &#9824";
        case 42:  
            return "2 &#9824";
        case 43:  
            return "A &#9824";
        case 44:  
            return "K &#9824";
        case 45:  
            return "K &#9671";
        case 46:  
            return "A &#9671";
        case 47:  
            return "2 &#9671";
        case 48:  
            return "4 &#9671";
        case 49:  
            return "7 &#9671";
        default:
            return "-2";
    }
}

function showPlaces(player) {
    $('.possible').removeClass('possible');
    var options = getOptions(players[player]);
    for (var card = 0 ; card < options.length ; card++) {
        for (var side = 0 ; side < options[card].length ; side++) {
            var position = options[card][side][0]*10 + options[card][side][1] + 1;
            $('#'+position).addClass('possible');
        }
    }
}