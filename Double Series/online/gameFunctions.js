//shared between back end and front end
if (typeof module === "object" && module && typeof module.exports === "object") {
    var points;
    exports.setUp = function(info){
        points = info.points;
    };
    exports.getOptions = getOptions;
    exports.checker = checker;
    exports.cardOptions = cardOptions;
    exports.getTeam = getTeam;
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


//checks if lines is won and turns them over
//if can finish multiple, finishes all
function checker(x,y,team,finishedLines) {
    var ret = [];
    var changed = false;
    var dirs = [
        [1,1],
        [1,0],
        [0,1],
        [1,-1]
    ];

    //if there are finished lines, don't search for those directions
    if (finishedLines) {
        for (var i = 0 ; i < finishedLines.length ; i++) {
            var line = finishedLines[i];
            if (line[0] && line[1]) {
                var slope = [line[1][0] - line[0][0],line[1][1] - line[0][1]];
                //first should be positive
                if (slope[0] < 0) {
                    slope[0] = -slope[0];
                    slope[1] = -slope[1];
                }
                for (var j = 0 ; j < dirs.length ; j++) {
                    if (dirs[j][0] === slope[0] && dirs[j][1] === slope[1]) {
                        dirs.splice(j,1);
                        break;
                    }
                }
            } else {
                console.log("this shouldn't happen");
            }
        }
    }

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

function getTeam(player) {
    //1 for player 1 and 3, 3 for 2 and 4
    return ((player % 2) * 2) + 1;
}