const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");

const game = require("./game.js");
game.newBoard();
game.newGame();
console.log(game);
var waitingFor = 0;//-1;
//process.exit();
function playCard(player,result) {
    var ret = game.playCard(player,((player%2) * 2) + 1,result);
    if (ret[0]) {
        sendAllResponses(player,result,ret[1],ret[2]);
        playAI();
    }
}

function playAI() {
    //while (true) {
    var blah = setInterval(function() {
        var ret = game.play();
        console.log(ret);
        if (ret.status === 2) {
            waitingFor = ret.player;
            clearInterval(blah);
        } else if (ret.status === 1) {
            sendAllResponses(ret.player,ret.play,ret.newCard,ret.nextPlayer);
        }
    },500);
    //}
}

function sendAllResponses(player,result,newCard,nextPlayer) {
    var data = {player:player,play:result};
    var info = JSON.stringify(data);
    
    data.myTurn = true;
    var nextPlayerInfo = JSON.stringify(data);
    //if nextPlayer is this player, will be given allData
    data.newCard = newCard;
    if (player !== nextPlayer) {
        data.myTurn = false;
    }
    var allData = JSON.stringify(data);
    console.log(dataRequests);
    for (var i = 0 ; i < dataRequests.length ; i++) {
        var response = dataRequests[i][0];
        response.writeHead(200, {"Content-Type":"text/plain"});
        console.log("player" + dataRequests[i][1] + " is waiting")
        if (dataRequests[i][1] === player) {
            response.end(allData);
        } else if (dataRequests[i][1] === nextPlayer) {
            response.end(nextPlayerInfo);
        } else {
            response.end(info);
        }
    }
    dataRequests = [];
}

function sendPlayerResponse(player) {
    for (var i = 0 ; i < dataRequests.length ; i++) {
        if (dataRequests[i][1] === player) {
            var data = {player:player,play,result};
            dataRequests[i][0].writeHead(200, {"Content-Type":"text/plain"});
            dataRequests[i][0].end(allData);
        }
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
}

var mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".ico": "image/x-icon"
};
var port = 8082;
var dataRequests = [];

http.createServer(function(request, response) {
    var svrUrl = url.parse(request.url);
    var filename = svrUrl.path;
    //console.log(svrUrl);
    if (filename === "/game") {
        filename = "Double Series.html";
    } else if (filename === "/data") {
        if (request.method == 'POST') {
            var body = '';

            request.on('data', function (data) {
                body += data;

                // Too much POST data, kill the connection!
                if (body.length > 1e6)
                    request.connection.destroy();
            });

            request.on('end', function () {
                //var query = qs.parse(body);
                var query = JSON.parse(body);
                console.log(body);
                console.log(query);
                //var query = svrUrl.query;
                var type = query ? query.type : "";
                var ret = "";
                switch(type) {
                    case "start":
                    var player = getOpenPlayerSlot();
                    var myTurn = player === waitingFor ? true : false;
                    ret = JSON.stringify({player:player,hand:game.players[player],cardsPlayed:game.cardsPlayed,myTurn:myTurn});
                    break;
                    case "play":
                    console.log(query.result);
                    playCard(query.player,query.result);
                    ret = "OK";
                    break;
                    case "get":
                    dataRequests.push([response,query.player]);
                    break;
                    default:
                    ret = "NOK";
                    break;
                }

                if (ret) {
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.end(ret);
                }
            });
        }



        return;
    }
    filename = path.basename(filename.replace(/\%20/g," "));
    console.log(filename);
    fs.access(filename, function(err) {
        if (err) {
            console.log(err);
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.end('Hello World\n');
        } else {
            response.writeHead(200, {'Content-Type': mimeTypes[path.extname(filename)]});
            var fileStream = fs.createReadStream(filename);
            fileStream.pipe(response);
        }
    });
    //
}).listen(port);

// Console will print the message
console.log('Server running at http://localhost:' + port);