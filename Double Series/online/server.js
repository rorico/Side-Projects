const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
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
game.newGame();
var activePlayers = [];

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var player = getOpenPlayerSlot();
    activePlayers[player] = connection;

    var gameInfo = game.getAllInfo();
    gameInfo.type = "start";
    gameInfo.player = player;
    gameInfo.hand = game.getHand(player);


    connection.sendUTF(JSON.stringify(gameInfo));

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
        if (i === player) {
            activePlayers[i].sendUTF(prevPlayerInfo);
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

function startNewGame() {
    var newHands = game.newGame();
    sendNewGame(newHands);
    setTimeout(playCard,500);
}

function sendNewGame(hands) {
    var data = game.getAllInfo();
    data.type = "newGame";
    for (var i = 0 ; i < activePlayers.length ; i++) {
        data.hand = hands[i];
        var info = JSON.stringify(data);
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

function copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}