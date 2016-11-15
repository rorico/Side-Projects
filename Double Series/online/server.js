const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const WebSocketServer = require("websocket").server;

var mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".ico": "image/x-icon"
};
var port = 8082;

var server = http.createServer(function(request, response) {
    var svrUrl = url.parse(request.url);
    var filename = svrUrl.path;
    if (filename === "/game") {
        filename = "Double Series.html";
    }
    filename = path.basename(filename.replace(/\%20/g," "));
    fs.access(filename, function(err) {
        if (err) {
            console.log(err);
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.end("Hello World\n");
        } else {
            response.writeHead(200, {"Content-Type": mimeTypes[path.extname(filename)]});
            var fileStream = fs.createReadStream(filename);
            fileStream.pipe(response);
        }
    });
}).listen(port,function() {
    console.log("Server running at http://localhost:" + port);
});


var wsServer = new WebSocketServer({
    httpServer: server
});

const game = require("./game.js");
game.newBoard();
game.newGame();
var waitingFor = 0;
var activePlayers = [];

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var player = getOpenPlayerSlot();
    activePlayers[player] = connection;

    var myTurn = player === waitingFor ? true : false;
    connection.sendUTF(JSON.stringify({type:"start",player:player,hand:game.players[player],cardsPlayed:game.cardsPlayed,myTurn:myTurn}));

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var query = JSON.parse(message.utf8Data);
            var type = query ? query.type : "";
            var ret = "";
            switch(type) {
            case "play":
                playCard(query.player,query.result);
                ret = "OK";
                break;
            default:
                ret = "NOK";
                break;
            }
        }
    });

    connection.on('close', function(connection) {
        removeHumanPlayer(player);
    });
});

function playCard(player,result) {
    var ret = game.play(player,result);
    if (ret.status === -1) {
        console.log("something wrong with play");
    } else {
        //only set if waiting for player, so reset
        waitingFor = -1;
        if (ret.status === 2) {
            waitingFor = ret.nextPlayer;
        } else if (ret.status === 1) {
            //calls with no parameters
            setTimeout(playCard,500);
        } else if (ret.status === 3) {
            sendEnd(ret.winner);
        } else {
            console.log("something went wrong");
        }
        sendPlay(ret.player,ret.play,ret.newCard);
    }
}

function sendPlay(player,result,newCard) {
    var data = {type:"play",player:player,play:result};
    var info = JSON.stringify(data);
    
    data.myTurn = true;
    var nextPlayerInfo = JSON.stringify(data);
    //if nextPlayer is this player, will be given allData
    data.newCard = newCard;
    if (player !== waitingFor) {
        data.myTurn = false;
    }
    var allData = JSON.stringify(data);
    for (var i = 0 ; i < activePlayers.length ; i++) {
        if (i === player) {
            activePlayers[i].sendUTF(allData);
        } else if (i === waitingFor) {
            activePlayers[i].sendUTF(nextPlayerInfo);
        } else {
            activePlayers[i].sendUTF(info);
        }
    }
}

function sendEnd(winner) {
    var data = {type:"end",winner:winner};
    var info = JSON.stringify(data);
    for (var i = 0 ; i < activePlayers.length ; i++) {
        activePlayers[i].sendUTF(info);
    }
}

function getOpenPlayerSlot() {
    var human = game.human;
    for (var i = 0 ; i < human.length ; i++) {
        if (!human[i]) {
            human[i] = true;
            return i;
        }
    }
    return -1;
}

function removeHumanPlayer(player) {
    var human = game.human;
    human[player] = false;
}
