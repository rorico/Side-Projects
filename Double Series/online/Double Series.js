var speed = 500;
var games = 0;

//game parts
var greenwin = 0;
var bluewin = 0;
var ties = 0;

var maxCards = 108;
var handLength = 7;

var hands = [];
var handLengths = [];
var cardsleft = maxCards - 4 * handLength - 1;
var cardsPlayed = [];

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
    new_uri += "//" + loc.host + "/websocket";
    connection = new socket(new_uri);
    connection.onerror = function (error) {
        console.log(error);
    };

    connection.onclose = function () {
        var message = "Connection to server closed";
        $("body").append("<div id='msg'>" + message + "</div>");
        var leftOffset = ($("body").innerWidth() - $("#msg").outerWidth())/2;
        var topOffset = ($("body").innerHeight() - $("#msg").outerHeight())/2;
        $("#msg").css("left",leftOffset).css("top",topOffset);
    }

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
                            changeBoard(x,y,points[x][y]);
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

            if (data.linesDone) {
                linesDone = linesDone;
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

                var team = getTeam(data.player);
                playCard(data.player,team,data);
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
            if (data.hand) {
                hands[me] = data.hand;
            }
            if (data.handLengths) {
                handLengths = data.handLengths;
            }
            newPlayers();
            newGame();
            if (data.nextPlayer !== undefined) {
                if (data.nextPlayer === me) {
                    playHuman(me,getTeam(me));
                } else {
                    $("#p" + data.nextPlayer).addClass("myTurn" + getTeam(data.nextPlayer));
                }
            }
            break;
        }
    };
}

function playData(player,result) {
    var data = {type:"play",player:player,result:result};
    connection.send(JSON.stringify(data));
}

function getPercentage(num,den) {
    return num + " (" + ((num/den)*100).toFixed(2) + "%)";
}