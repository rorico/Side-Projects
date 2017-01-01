const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const WebSocketServer = require("websocket").server;
const newGame = require("./game.js");

var mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".ico": "image/x-icon"
};
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8081,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";

//start with a game
var currentGameId = 2;
var activeGames = {"0":newGame()};

var server = http.createServer(function(request, response) {
    var svrUrl = url.parse(request.url);
    var filename = svrUrl.path;
    //paths with numbers in them correspond to specific games
    if (filename === "/game" || filename === "/" || activeGames.hasOwnProperty(filename.substring(1))) {
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
    console.log("Server running at http://" + ip + ":" + port);
});


var wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var query = request && request.resourceURL && request.resourceURL.query;
    var gameId = query.game;// ? query.game : 0;

    var messageHandler;
    var closeHandler;

    var sendData = function(info) {
        connection.sendUTF(JSON.stringify(info));
    };

    if (activeGames.hasOwnProperty(gameId)) {
        joinGame(activeGames[gameId]);
    } else {
        messageHandler = function(message) {
            var query = JSON.parse(message);
            var type = query ? query.type : "";
            switch(type) {
                case "getGames":
                    var list = [];
                    for (var gameId in activeGames) {
                        list.push([gameId,activeGames[gameId].spaces()]);
                    }
                    var ret = {type:"getGames",games:list};
                    sendData(ret);
                    break;
                case "joinGame":
                    if (activeGames.hasOwnProperty(query.gameId)) {
                        joinGame(activeGames[query.gameId]);
                    }
                    break;
                case "createGame":
                    var thisGame = newGame();
                    activeGames[currentGameId] = thisGame;
                    currentGameId++;
                    joinGame(thisGame);
                    break;
            }
        };
    }

    //these allow changes in the functions outside
    connection.on("message", function(message) {
        if (message.type === "utf8" && typeof messageHandler === "function") {
            messageHandler(message.utf8Data);
        }
    });

    connection.on("close", function() {
        if (typeof closeHandler === "function") {
            closeHandler();
        }
    });

    function joinGame(game) {
        var playCallback;

        var play = function(a,b,c,callback) {
            playCallback = callback;
        }

        var player = {
            play:play,
            onNewGame:sendData,
            onPlay:sendData,
            onEndGame:sendData
        };

        function playerObj(info) {
            sendData(info);
            return player;
        }
        //var res = game.addSpectator(player);
        var res = game.addHuman(playerObj);
        if (res.success) {
            messageHandler = function(message) {
                var query = JSON.parse(message);
                if (query && query.type === "play") {
                    if (typeof playCallback === "function") {
                        playCallback(query.result);
                    } else {
                        console.log("not your turn?");
                    }
                    playCallback = null;
                }
            };
            closeHandler = res.remove;
        }
    }
});