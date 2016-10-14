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
//var pointworth = [[58,64,77,91,128,129,82,77,72,55],[76,84,96,137,162,133,106,92,95,56],[87,98,126,155,193,184,147,147,113,84],[93,128,149,158,196,215,187,152,135,95],[130,151,169,190,234,248,222,172,150,127],[118,145,178,220,255,248,211,175,147,130],[87,124,154,209,238,226,181,161,123,100],[68,94,124,166,178,191,178,151,98,88],[62,90,94,112,133,157,129,104,82,64],[50,61,60,78,102,113,86,85,57,50]];
//var pointworth = [[1050,878,938,928,1209,1089,656,536,479,437],[1159,1255,1202,1480,1468,1462,1092,719,622,449],[1421,1524,1806,1733,1714,1620,1379,1187,705,537],[1639,2062,2229,2122,1875,1848,1596,1315,1075,644],[2055,2235,2431,2331,1975,1992,1603,1435,1268,1039],[1906,2357,2635,2791,2776,2352,1857,1587,1438,1327],[1220,1914,2271,2663,2624,2358,1912,1604,1313,1014],[984,1304,2068,2280,2431,2298,1887,1651,1089,918],[835,1217,1289,1853,2134,2015,1684,1279,1126,844],[800,947,1057,1206,1783,1630,1169,1009,841,940]];
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

$(document).ready(function() {
    createBoard();
    newGame();
    delayedStart(0,0);
});

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
            hideHands(player);
            showCardWorth(cardWorth(getOptions(hand),team,true));
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
        $('#bluewin').text(bluewin);
        $('#greenwin').text(greenwin);
        $('#ties').text(ties);
        $('#blueP').text(getPercentage(bluewin,totalGames));
        $('#greenP').text(getPercentage(greenwin,totalGames));
        $('#tieP').text(getPercentage(ties,totalGames));
        
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
    var hand = players[player];
    var action = result[0];
    var card = result[1];
    var place = result[2];
    var x = place[0];
    var y = place[1];
    if (checkValid) {
        if (!checkValidPlay(action,hand[card],x,y,team,result[3])) {
            console.log("player:",player,"cards:",hand,"team:",team,"play:",result);
            return;
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
    cardsPlayed.push([players[player][card],[x,y]]);
    drawCard(player,card,team,replace);
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
        pause();
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


function sort_arrays(a,b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    if (a[1] < b[1]) return -1;
    if (a[1] > b[1]) return 1;
    return 0;
}
function sort_by_number(a,b) {
    if (a[2] < b[2]) return -1;
    if (a[2] > b[2]) return 1;
    return 0;
}

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
            var i = x*10 + y + 1;
            $('#'+i).removeClass();
            $('#'+i).addClass('v0');
            $('#'+i).text(pointworth[x][y]);
        }
    }
    showArray(pointworth,"#values");
}

function isEqual(array1,array2) {
    for (var i = 0 ; i < array1.length ; i++) {
        if (Array.isArray(array1[i])) {
            if (!isEqual(array1[i],array2[i])) 
                return false;
        } else {
            if (array1[i] !== array2[i]){
                return false;
            }
        }
    }
    return true;
}

function showArray(data,container) {
    if (Array.isArray(data)) {
        $(container).append('[');
        for (var i = 0 ; i < data.length ; i++) {
            showArray(data[i],container);
            if (i !== data.length-1) {
                $(container).append(',');
            }
        }
        $(container).append(']');
    } else if (typeof data.getMonth === 'function') {
        $(container).append('new Date("'+data+'")');
    } else if (typeof data === 'string') {
        $(container).append('"'+data+'"');
    } else {
        $(container).append(data);
    }
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