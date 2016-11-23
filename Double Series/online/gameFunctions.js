//shared between back end and front end
if (typeof module === "object" && module && typeof module.exports === "object") {
    var points;
    exports.setUp = function(info){
        points = info.points;
    }
    exports.getOptions = getOptions;
    exports.checker = checker;
    exports.cardOptions = cardOptions;
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
