var speed = 500;
var games = 0;

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
var hands = [];
var handLengths = [];
var blueLines = 0;
var greenLines = 0;
var cardsleft = maxCards - 4 * handLength - 1;
var cardsPlayed = [];
var gameEnd = false;
var animate = true;
var info = {board:board};

var me;
var playedCard = -1;
var connection;

$(document).ready(function() {
    createBoard();
    startConnection();
});

function startConnection() {
    var socket = window.WebSocket || window.MozWebSocket;
    var loc = window.location, new_uri;
    if (loc.protocol === "https:") {
        new_uri = "wss:";
    } else {
        new_uri = "ws:";
    }
    new_uri += "//" + loc.host;
    connection = new socket(new_uri);
    connection.onerror = function (error) {
        console.log(error);
    };

    connection.onmessage = function (message) {
        var data = JSON.parse(message.data);
        console.log(data);
        switch (data.type) {
        case "start":
            if (data.player === undefined) {
                alert("something went very wrong");
            } else {
                me = data.player;
                if (data.hand) {
                    hands[me] = data.hand;
                }
            }
            if (data.handLengths) {
                handLengths = data.handLengths;
            }
            createPlayers();

            if (data.points) {
                points = data.points;
                for (var x = 0 ; x < points.length ; x++) {
                    for (var y = 0 ; y < points[x].length ; y++) {
                        if (points[x][y]) {
                            getPosition(x,y).removeClass("v0").addClass("v" + points[x][y]);
                        }
                    }
                }
            }
            if (data.cardsPlayed) {
                cardsPlayed = data.cardsPlayed;
                if (cardsPlayed.length) {
                    for (var i = 0 ; i < cardsPlayed.length ;i++) {
                        var card = cardsPlayed[i];
                        var team = getTeam(card.player);
                        addCardPlayed(card,team);
                    }
                }
            }
            if (data.blueLines) {
                blueLines = blueLines;
            }
            if (data.greenLines) {
                greenLines = greenLines;
            }
            if (data.games) {
                games = data.games;
                if (data.bluewin) {
                    bluewin = data.bluewin;
                    $("#bluewin").text(getPercentage(bluewin,games));
                }
                if (data.greenwin) {
                    greenwin = data.greenwin;
                    $("#greenwin").text(getPercentage(greenwin,games));
                }
            }
            if (data.nextPlayer !== undefined) {
                if (data.nextPlayer === me) {
                    playHuman(me,getTeam(me));
                } else {
                    $("#p" + data.nextPlayer).addClass("myTurn" + getTeam(data.nextPlayer));
                }
            }
            break;
        case "play":
            if (data.player === undefined) {
                alert("something went very wrong");
            } else {
                if (data.player === me) {
                    if (data.newCard === undefined) {
                        hands[me].splice(playedCard,1);
                        var size = hands[me].length;
                        $("#p"+me+"_"+size).remove();
                        for (var i = playedCard ; i < size ; i++) {
                            $("#p"+me+"_"+i).html(changeToCards(hands[me][i]));
                        }
                    } else {
                        hands[me][playedCard] = data.newCard;
                        $("#p"+me+"_"+playedCard).html(changeToCards(data.newCard));
                    }
                } else {
                    $("#p" + data.player).removeClass("myTurn" + getTeam(data.player));
                    if (data.handSize !== undefined) {
                        //assume handSize drops by 1
                        $("#p" + data.player + " div").first().remove();
                        //doesn't matter which is removed
                    }
                }

                playCard(data.player,data);
                var team = getTeam(data.player);
                addCardPlayed(data,team);
                if (data.nextPlayer !== undefined) {
                    if (data.nextPlayer === me) {
                        setTimeout(function() {
                            playHuman(me,getTeam(me));
                        },speed);
                    } else {
                        $("#p" + data.nextPlayer).addClass("myTurn" + getTeam(data.nextPlayer));
                    }
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
            games++;
            $("#bluewin").text(getPercentage(bluewin,games));
            $("#greenwin").text(getPercentage(greenwin,games));
            break;
        case "newGame":
            break;
        }
    };
}

function playData(player,result) {
    var data = {type:"play",player:player,result:result};
    connection.send(JSON.stringify(data));
}

function playCard(player,play) {
    var position = play.position;
    var x = position ? position[0] : -1;
    var y = position ? position[1] : -1;
    var team = getTeam(player);
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
        break;
    }
}

function getPercentage(num,den) {
    return num + " (" + ((num/den)*100).toFixed(2) + "%)";
}

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

    var display = $("<table><tr><td></td><td id='topPlayer'></td><td id='card_played'></td></tr>" + 
                    "<tr><td id='leftPlayer'></td><td id='board'></td><td id='rightPlayer'></td></tr>" + 
                    "<tr><td id='blueData'></td><td id='botPlayer'></td><td id='greenData'></td></tr></table>");
    $("#game").append(display);


    var html = "";
    for (var i = 0 ; i < board.length ; i++) {
        html += "<tr>";
        for (var j = 0 ; j < board[i].length ; j++) {
            html += "<td class='v" + points[i][j] + "' id='" + cnt  +"'>" + changeToCards(board[i][j]) + "</td>";
            cnt++;
        }
        html += "</tr>";
    }
    $("#board").html(html);

    $("#blueData").html("Blue<br /><span id='bluewin'>0 (0.00%)</span>");
    $("#greenData").html("Green<br /><span id='greenwin'>0 (0.00%)</span>");
    cardHistorySetup();
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
    hands = [player1,player2,player3,player4];
    showHands();
    
    for (var i = 1 ; i <= 100 && animate; i++) {
        $("#"+i).removeClass();
        $("#"+i).addClass("v0");
    }
    currentPlayer = 0;
    pastPlayer = -1;
    pastCardIndex = -1;
    pastCard = -2;
    if (animate) {
        $("#card_played").empty();
    }
    cardsPlayed = [];
    cardsleft = maxCards - 4 * handLength - 1;
    blueLines = 0;
    greenLines = 0;
}

function getPosition(x,y) {
    return $("#" + (10*x + y + 1));
}

function cardHistorySetup() {
    $("#card_played").append("<div id='placeholder' class='block'><div id='cardHolder'></div></div>")
    $("#cardHolder").hover(function(){
        $("#cardHolder").css("maxHeight","250px");
    },function(){
        $("#cardHolder").css("maxHeight","40px").scrollTop(0);
    });
}

function addCardPlayed(obj,team) {
    $("#cardHolder").prepend(cardPlayedEle(obj,team));
}

function cardPlayedEle(obj,team) {
    var card = $("<div class='c"+team+" block'>"+changeToCards(obj.cardPlayed)+"</div>");
    var position = obj.position;
    card.hover(function(){
        $("body").append("<div class='hide'></div>");
        $("#card_played").addClass("show");
        getPosition(position[0],position[1]).addClass("show");
    },function(){
        $(".hide").remove();
        $(".show").removeClass("show");
    });
    return card;
}

//changes a team to 0 because of remove J
function removePoint(x,y) {
    points[x][y] = 0;
    getPosition(x,y).removeClass().addClass("v0");
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
function showHand(player) {
    $("#p" + player).empty();
    for (var j = 0 ; j < hands[player].length ; j++) {
        $("#p"+player).append("<div id='p"+player+"_"+j+"'>"+changeToCards(hands[player][j])+"</div>");
    }
}

//shows Hand on board
function showHands(me) {
    for (var i = 0 ; i < handLengths.length ; i++) {
        if (i === me) {
            continue;
        }
        for (var j = 0 ; j < handLengths[i] ; j++) {
            $("#p"+i).append("<div></div>");
        }
    }
}

//shows Hand on board
function createPlayers() {
    var currentPlayer = me;
    $("#botPlayer").html(playerHtml(me));
    currentPlayer = (currentPlayer + 1) % 4;
    $("#rightPlayer").html("<div class='boardSide sideHolder'><div id='rightSide' class='rotate270'>" + playerHtml(currentPlayer) + "</div></div>");
    currentPlayer = (currentPlayer + 1) % 4;
    $("#topPlayer").html("<div class='sideHolder'><div class='rotate180'>" + playerHtml(currentPlayer) + "</div></div>");
    currentPlayer = (currentPlayer + 1) % 4;
    $("#leftPlayer").html("<div class='boardSide sideHolder'><div id='leftSide' class='rotate90'>" + playerHtml(currentPlayer) + "</div></div>");

    var height = $("#botPlayer").height();
    var width = $("#botPlayer").width();

    $(".boardSide").width(height).height(width);
    $("#rightSide").width(width).height(height);
    $("#leftSide").width(width).height(height);

    //only bot has options, add this after to not affect the widths
    $("#botPlayer").append("<div id='o" + me + "'></div>");
}

function playerHtml(player) {
    var cardHtml = "";
    if (player === me) {
        for (var i = 0 ; i < hands[player].length ; i++) {
            cardHtml += "<div id='p" + player + "_" + i + "'>" + changeToCards(hands[player][i]) + "</div>";
        }
    } else {
        //should be defined, but assume 7 incase
        var handLength = handLengths[player] === undefined ? 7 : handLengths[player];
        for (var i = 0 ; i < handLength ; i++) {
            cardHtml += "<div></div>";
        }
    }
    return "<div class='playerTitle'>Player " + (player + 1) + "</div><div class='hand' id='p" + player + "'>" + cardHtml + "</div>";
}

//for showing statistics of what points is used to win
function showWorth() {
    for (var x = 0 ; x < 10; x++) {
        for (var y = 0 ; y < 10; y++) {
            getPosition(x,y).removeClass().addClass("v0").text(pointworth[x][y]);
        }
    }
    $("#values").append(JSON.stringify(pointworth));
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