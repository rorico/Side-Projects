function boardDisplay() {
    //create board display

    var cnt = 1;

    var display = $("<table><tr><td></td><td id='topPlayer'></td><td id='card_played'></td></tr>" + 
                    "<tr><td id='leftPlayer'></td><td id='board'></td><td id='rightPlayer'></td></tr>" + 
                    "<tr><td id='blueData'></td><td id='botPlayer'></td><td id='greenData'></td></tr>" + 
                    "<tr><td></td><td id='options'></td><td></td></tr></table>");
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
}

function playerHtml(player) {
    return "<div class='playerTitle'>Player " + (player + 1) + "</div><div class='hand' id='p" + player + "'>" + cardHtml(player) + "</div>";
}

function newPlayers() {
    for (var player = 0 ; player < hands.length ; player++) {
        $("#p" + player).html(cardHtml(player));
    }
}

function cardHtml(player) {
    var html = "";
    if (player === me) {
        for (var i = 0 ; i < hands[player].length ; i++) {
            html += "<div id='p" + player + "_" + i + "'>" + changeToCards(hands[player][i]) + "</div>";
        }
    } else {
        //should be defined, but assume 7 incase
        var handLength = handLengths[player] === undefined ? 7 : handLengths[player];
        for (var i = 0 ; i < handLength ; i++) {
            html += "<div></div>";
        }
    }
    return html;
}

function cardHistorySetup() {
    $("#card_played").append("<div id='placeholder' class='block'><div id='cardHolder'></div></div>");
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

function newGameDisplay() {
    for (var i = 1 ; i <= 100 ; i++) {
        $("#"+i).removeClass();
        $("#"+i).addClass("v0");
    }
    $("#cardHolder").empty();
    //may want to move this somewhere else
    cardsPlayed = [];
}

function getPosition(x,y) {
    return $("#" + (10*x + y + 1));
}

function changeBoard(x,y,val) {
    getPosition(x,y).removeClass().addClass("v" + val);
}

function showFinishLine(line,team) {
    for (var i = 0 ; i < line.length ; i++) {
        showFinishPoint(line[i][0],line[i][1],team);
    }
}

function showFinishPoint(x,y,team) {
    getPosition(x,y).removeClass("v" + team).addClass("v"+(team+1));
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