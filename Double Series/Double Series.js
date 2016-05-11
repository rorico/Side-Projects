//settings
var maxGame = 1000;
var speed = 500;
var human = [true,false,false,false];
var showMoves = false;
//game play
function playBlue (player){
    //return play(player,1);
    //return playHybrid(player,1);
    //return playAI(player,1,true);
    //return playBest(player,1,true);
    return playAIphil(player,1,true);
    //return playSides(player,1,true);
    //return playWorth(player,1,true);      //currently doesn't work
}
function playGreen (player){
    //return play(player,3);
    //return playHybrid(player,3);
    //return playAI(player,3,true);
    return playBest(player,3,true);
    //return playAIphil(player,3,true);
    //return playSides(player,3,true);
    //return playWorth(player,3,true);      //currently doesn't work
}

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
for(var i = 0 ; i<human.length ; i++) {
    if (human[i]) {
        $('input[name='+(i+1)+'][value=human]').attr('checked','checked');
    } else {
        $('input[name='+(i+1)+'][value=computer]').attr('checked','checked');
    }
}
$('input[type=radio]').on('change',function(){
    event.stopPropagation();
    if (this.value=="human") {
        human[this.name-1]=true;
    } else if (this.value=="computer") {
        human[this.name-1]=false;
    }
});
$('input[type=radio]').click(function(){
    event.stopPropagation();
});

var keepgoing = true;       //allows for pauses anywhere in code
var gameN = 0;
var turnN = 0;
var pauseable = true;
var unpauseable = false;
$(window).keypress(function(e) {
    if (e.keyCode == 0 || e.keyCode == 32) { //spacebar
        pause();
    }
});
$(document).click(function(){
    pause();
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
$(document).ready(function(){
    initialize();
    delayedStart(0,0);
});

function start(i,j){
    pauseable = true;
    if( i < maxCards && greenLines<2 && blueLines<2 && keepgoing && !gameEnd ){
        gameN=j;
        turnN=i;
        var player = i%4;
        var team = ((player%2)*2)+1;    //1 for players 1 and 3, 3 for 2 and 4
    
        if (human[player]) {
            keepgoing = true;
            pauseable = false;
            hideHands(player);
            showCardWorth(cardWorth(getOptions(players[player]),team,true));
            playHuman(player,team);
            return;
        } else {
            if (players[player].length!==0) {
                var result = [-2,-1,[-1,-1]]; //[action,[x,y]]  action: 1 = add, 0 = replaceCard, -1 = removeJ
                if (team===1) {
                    result = playBlue(player);
                } else if (team === 3) {
                    result = playGreen(player);
                }
                
                var action = result[0];
                var card = result[1];
                var place = result[2];
                var x = place[0];
                var y = place[1];
                if (action === 0) {    //throw away card
                    i--;                   //repeat turn
                } else if (action === -1 ){
                    value0(x,y);
                } else if (action === 1) {
                    changeValue(x,y,team);
                    checker(x,y);
                }
                drawCard(player,card,team);
            }
        }
        delayedStart(i+1,j);
    } else if (!keepgoing) {       //pauses
        gameN=j;
        turnN=i;
        unpauseable = true;
        $('#pause').css('display','block');
    } else if(gameEnd){         //this allows for game ends shown at 0 speed
        gameEnd=false;
        restart();
        delayedStart(0,j+1);
    } else {                //end game
        if(greenLines>=2){
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
        
        if (j<maxGame - 1) {        //starts at game 0
            setTimeout(function(){
                gameEnd=true;
                start(i,j);
            },speed*3);
        } else {
            pauseable = false;
            showWorth();
        }
    }
}

function delayedStart(i,j) {
    if (speed==0) {
        start(i,j);
    } else {
        setTimeout(function(){
            start(i,j);
        },speed);
    }
}

function noDelay() {
    animate = false;
    for (var j = 0 ; j < maxGame ; j++) {
        for( var i = 0 ; i < 104 && greenLines<2 && blueLines<2 && keepgoing && gameEnd ; i++){
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
        if(greenLines>=2){
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
        restart();
    }
    showWorth();
}
//array of options that player can play
//Output [card][side][row i, col yj]
function getOptions(player){
    var options = [];
    for( var k = 0 ; k<player.length ; k++ )
    {
        var options1 = [];

        //if jacks, just push jacks
        if (player[k]===0||player[k]===-1) {
            options1=player[k];
        } else {
            
            for( var i = 0 ; i<board.length ; i++ )
            {
                for( var j = 0 ; j<board[i].length ; j++ )
                {
                    //checks if played on the board, adds to options
                    if (board[i][j]===player[k]&&points[i][j]===0) {
                        options1.push([i,j]);
                    }
                }
            }
        }
        options.push(options1);
    }
    return options;
}

//pick up new card
function drawCard(player,index,value,change) {
    if (animate) {
        $("#card_played").prepend("<div class='c"+value+"'>"+changeToCards(players[player][index])+"</div>");
    }
    if (showMoves) {
        showPlaces(player);
    }
    cardsPlayed.push(players[player][index]);
    if (cardsleft!==-1) {
        players[player][index] = deck[cardsleft];
        cardsleft--;
        if (animate) {
            animateHand(index,player,false,change);
        }
    } else {
        players[player].splice(index,1);
        if (animate) {
            animateHand(index,player,true,change);
        }
    }
}

//random add jack
function addJR (){
    var options = [];
    for( var i = 0 ; i<board.length ; i++ )
    {
        for( var j = 0 ; j<board[i].length ; j++ )
        {
            if (points[i][j]===0) {
                options.push([i,j]);
            }
        }
    }
    return options;
}

//random remove jack 
function removeJR(colour){
    colour=4-colour;
    var options = [];
    for( var i = 0 ; i<board.length ; i++ )
    {
        for( var j = 0 ; j<board[i].length ; j++ )
        {
            if (points[i][j]===colour) {
                options.push([i,j]);
            }
        }
    }
    return options;
}

//add jack
function addJ (colour,offensive){
    var value = 4-colour;
    var tnp = [];
    var returnValues = [];
    
    for ( var times = 0 ; times <=1 ; times++) {
        value=4-value;
        if (value!==colour&&offensive) {
            continue;
        }
        var checkOpen = 0;
        var cnt11 = 0;
        var cnt12 = 0;
        var cnt13 = 0;
        var cnt21 = 0;
        for (var row = 0 ; row<10 ; row++){
            checkOpen = 0;
            cnt21=0;
            for(var i = 0 ; i < 5 ; i++) {
                if (points[row][i]===value) {
                    cnt21++;
                } else if (points[row][i]!==0) {
                    checkOpen++;
                } else {
                    tnp=[row,i];
                }
            }
            if (cnt21===4&&checkOpen===0) {
                returnValues.push(tnp.slice());
            }
            for (var col = 0 ; col<5 ; col++) {
                if (points[row][col]===value) {
                    cnt21--;
                } else if (points[row][col]!==0) {
                    checkOpen--;
                }
                if (points[row][col+5]===value) {
                    cnt21++;
                } else if (points[row][col+5]!==0) {
                    checkOpen++;
                } else {
                    tnp = [row,col+5];
                }
                if (cnt21===4&&checkOpen===0) {
                    returnValues.push(tnp.slice());
                }
            }
        }
        for (var col = 0 ; col<10 ; col++){
            checkOpen = 0;
            cnt12=0;
            for(var i = 0 ; i < 5 ; i++) {
                if (points[i][col]===value) {
                    cnt12++;
                } else if (points[i][col]!==0) {
                    checkOpen++;
                } else {
                    tnp=[i,col];
                }
            }
            if (cnt12===4&&checkOpen===0) {
                returnValues.push(tnp.slice());
            }
            for (var row = 0 ; row<5 ; row++) {
                if (points[row][col]===value) {
                    cnt12--;
                } else if (points[row][col]!==0) {
                    checkOpen--;
                }
                if (points[row+5][col]===value) {
                    cnt12++;
                } else if (points[row+5][col]!==0) {
                    checkOpen++;
                } else {
                    tnp = [row+5,col];
                }
                if (cnt12===4&&checkOpen===0) {
                    returnValues.push(tnp.slice());
                }
            }
        }
        for (var row = 0 ; row<6 ; row++){
            checkOpen = 0;
            cnt11=0;
            for(var i = 0 ; i < 5 ; i++) {
                if (points[row+i][i]===value) {
                    cnt11++;
                } else if (points[row+i][i]!==0) {
                    checkOpen++;
                } else {
                    tnp=[row+i,i];
                }
            }
            if (cnt11===4&&checkOpen===0) {
                returnValues.push(tnp.slice());
            }
            for (var col = 0 ; col<5-row ; col++) {
                if (points[row+col][col]===value) {
                    cnt11--;
                } else if (points[row+col][col]!==0) {
                    checkOpen--;
                }
                if (points[row+5+col][col+5]===value) {
                    cnt11++;
                } else if (points[row+5+col][col+5]!==0) {
                    checkOpen++;
                } else {
                    tnp = [row+5+col,col+5];
                }
                if (cnt11===4&&checkOpen===0) {
                    returnValues.push(tnp.slice());
                }
            }
        }
        for (var col = 1 ; col<6 ; col++){
            checkOpen = 0;
            cnt11=0;
            for(var i = 0 ; i < 5 ; i++) {
                if (points[i][col+i]===value) {
                    cnt11++;
                } else if (points[i][col+i]!==0) {
                    checkOpen++;
                } else {
                    tnp=[i,col+i];
                }
            }
            if (cnt11===4&&checkOpen===0) {
                returnValues.push(tnp.slice());
            }
            for (var row = 0 ; row<5-col ; row++) {
                if (points[row][col+row]===value) {
                    cnt11--;
                } else if (points[row][col+row]!==0) {
                    checkOpen--;
                }
                if (points[row+5][col+5+row]===value) {
                    cnt11++;
                } else if (points[row+5][col+5+row]!==0) {
                    checkOpen++;
                } else {
                    tnp = [row+5,col+5+row];
                }
                if (cnt11===4&&checkOpen===0) {
                    returnValues.push(tnp.slice());
                }
            }
        }
        for (var row = 4 ; row<10 ; row++){
            checkOpen = 0;
            cnt11=0;
            for(var i = 0 ; i < 5 ; i++) {
                if (points[row-i][i]===value) {
                    cnt11++;
                } else if (points[row-i][i]!==0) {
                    checkOpen++;
                } else {
                    tnp=[row-i,i];
                }
            }
            if (cnt11===4&&checkOpen===0) {
                returnValues.push(tnp.slice());
            }
            for (var col = 0 ; col<row-4 ; col++) {
                if (points[row-col][col]===value) {
                    cnt11--;
                } else if (points[row-col][col]!==0) {
                    checkOpen--;
                }
                if (points[row-5-col][col+5]===value) {
                    cnt11++;
                } else if (points[row-5-col][col+5]!==0) {
                    checkOpen++;
                } else {
                    tnp = [row-5-col,col+5];
                }
                if (cnt11===4&&checkOpen===0) {
                    returnValues.push(tnp.slice());
                }
            }
        }
        for (var col = 1 ; col<6 ; col++){
            checkOpen = 0;
            cnt11=0;
            for(var i = 0 ; i < 5 ; i++) {
                if (points[9-i][col+i]===value) {
                    cnt11++;
                } else if (points[9-i][col+i]!==0) {
                    checkOpen++;
                } else {
                    tnp=[9-i,col+i];
                }
            }
            if (cnt11===4&&checkOpen===0) {
                returnValues.push(tnp.slice());
            }
            for (var row = 0 ; row<5-col ; row++) {
                if (points[9-row][col+row]===value) {
                    cnt11--;
                } else if (points[9-row][col+row]!==0) {
                    checkOpen--;
                }
                if (points[4-row][col+5+row]===value) {
                    cnt11++;
                } else if (points[4-row][col+5+row]!==0) {
                    checkOpen++;
                } else {
                    tnp = [4-row,col+5+row];
                }
                if (cnt11===4&&checkOpen===0) {
                    returnValues.push(tnp.slice());
                }
            }
        }
    }
    if (returnValues.length!==0) {
        returnValues.sort(sort_arrays);
        var returnValues2 = [];
        var current = [,];
        var cnt = 0;
        for (var i = 0; i < returnValues.length; i++) {
            if (returnValues[i][0] !== current[0]||returnValues[i][1] !== current[1]) {
                if (cnt > 0) {
                    returnValues2.push(current.slice());
                    returnValues2[returnValues2.length-1].push(cnt);
                }
                current = returnValues[i].slice();
                cnt = 1;
            } else {
                cnt++;
            }
        }
        if (cnt > 0) {
            returnValues2.push(current.slice());
            returnValues2[returnValues2.length-1].push(cnt);
        }
        var returnValues3=[];
        returnValues2.sort(sort_by_number);
        max = returnValues2[0][2];
        for (var i = 0 ; i < returnValues2.length ; i++){
            if (returnValues2[i][2]===max) {
                returnValues3.push(returnValues2[i].slice());
            }else {
                break;
            }
        }
        return returnValues3;
    } else {
        return [];
    }
}

//add jack v2
function addJ_2 (colour){
    var options = check4_2(colour);
    return options;
}

//remove jack 
function removeJ(colour){
    colour = 4-colour;       
    var worth = [];
    for( var i = 0 ; i<board.length ; i++ ){
        var worthrow = [];
        for( var j = 0 ; j<board[i].length ; j++ ){
            worthrow.push(0);
            
        }
        worth.push(worthrow);
    } 
    var value = colour;
    var tnp = [];
    
    var check = true;
    var cnt11 = 0;
    var cnt12 = 0;
    var cnt13 = 0;
    var cnt21 = 0;
    for (var row = 0 ; row<10 ; row++){
        check = true;
        tnp=[];
        cnt21=0;
        for(var i = 0 ; i < 5 ; i++) {
            if (points[row][i]===value) {
                cnt21++;
                tnp.push([row,i])
            } else if (points[row][i]!==0) {
                check=false;
            }
        }
        if (cnt21===4&&check) {
            for(var i = 0 ; i<tnp.length ; i++){
                worth[tnp[i][0]][tnp[i][1]]++;
            }
        }
        for (var col = 0 ; col<5 ; col++) {
            if (points[row][col]===value) {
                tnp.splice(0,1);
                cnt21--;
            } else if (points[row][col]!==0){
                check=true;
            }
            if (points[row][col+5]===value) {
                cnt21++;
                tnp.push([row,col+5]);
            } else if (points[row][col+5]!==0) {
                check=false;
            }
            if (cnt21===4&&check) {
                for(var i = 0 ; i<tnp.length ; i++){
                    worth[tnp[i][0]][tnp[i][1]]++;
                }
            }
        }
    }
    for (var col = 0 ; col<10 ; col++){
        check = true;
        tnp=[];
        cnt12=0;
        for(var i = 0 ; i < 5 ; i++) {
            if (points[i][col]===value) {
                cnt12++;
                tnp.push([i,col]);
            } else if (points[i][col]!==0) {
                check=false;
            }
        }
        if (cnt12===4&&check) {
            for(var i = 0 ; i<tnp.length ; i++){
                worth[tnp[i][0]][tnp[i][1]]++;
            }
        }
        for (var row = 0 ; row<5 ; row++) {
            if (points[row][col]===value) {
                tnp.splice(0,1);
                cnt12--;
            } else if (points[row][col]!==0) {
                check=true;
            }
            if (points[row+5][col]===value) {
                cnt12++;
                tnp.push([row+5,col]);
            } else if (points[row+5][col]!==0) {
                check=false;
            }
            if (cnt12===4&&check) {
                for(var i = 0 ; i<tnp.length ; i++){
                    worth[tnp[i][0]][tnp[i][1]]++;
                }
            }
        }
    }
    for (var row = 0 ; row<6 ; row++){
        check = true;
        cnt11=0;
        for(var i = 0 ; i < 5 ; i++) {
            if (points[row+i][i]===value) {
                cnt11++;
                tnp.push([row+i,i]);
            } else if (points[row+i][i]!==0) {
                check=false;
            }
        }
        if (cnt11===4&&check) {
            for(var i = 0 ; i<tnp.length ; i++){
                worth[tnp[i][0]][tnp[i][1]]++;
            }
        }
        for (var col = 0 ; col<5-row ; col++) {
            if (points[row+col][col]===value) {
                tnp.splice(0,1);
                cnt11--;
            } else if (points[row+col][col]!==0) {
                check=true;
            }
            if (points[row+5+col][col+5]===value) {
                cnt11++;
                tnp.push([row+5+col,col+5]);
            } else if (points[row+5+col][col+5]!==0) {
                check=false;
            }
            if (cnt11===4&&check) {
                for(var i = 0 ; i<tnp.length ; i++){
                    worth[tnp[i][0]][tnp[i][1]]++;
                }
            }
        }
    }
    for (var col = 1 ; col<6 ; col++){
        check = true;
        tnp=[];
        cnt11=0;
        for(var i = 0 ; i < 5 ; i++) {
            if (points[i][col+i]===value) {
                cnt11++;
                tnp.push([i,col+i]);
            } else if (points[i][col+i]!==0) {
                check=false;
            }
        }
        if (cnt11===4&&check) {
            for(var i = 0 ; i<tnp.length ; i++){
                worth[tnp[i][0]][tnp[i][1]]++;
            }
        }
        for (var row = 0 ; row<5-col ; row++) {
            if (points[row][col+row]===value) {
                tnp.splice(0,1);
                cnt11--;
            } else if (points[row][col+row]!==0) {
                check=true;
            }
            if (points[row+5][col+5+row]===value) {
                cnt11++;
                tnp.push([row+5,col+5+row]);
            } else if (points[row+5][col+5+row]!==0) {
                check=false;
            }
            if (cnt11===4&&check) {
                for(var i = 0 ; i<tnp.length ; i++){
                    worth[tnp[i][0]][tnp[i][1]]++;
                }
            }
        }
    }
    for (var row = 4 ; row<10 ; row++){
        check = true;
        tnp=[];
        cnt11=0;
        for(var i = 0 ; i < 5 ; i++) {
            if (points[row-i][i]===value) {
                cnt11++;
                tnp.push([row-i,i]);
            } else if (points[row-i][i]!==0) {
                check=false;
            }
        }
        if (cnt11===4&&check) {
            for(var i = 0 ; i<tnp.length ; i++){
                worth[tnp[i][0]][tnp[i][1]]++;
            }
        }
        for (var col = 0 ; col<row-4 ; col++) {
            if (points[row-col][col]===value) {
                tnp.splice(0,1);
                cnt11--;
            } else if (points[row-col][col]!==0) {
                check=true;
            }
            if (points[row-5-col][col+5]===value) {
                cnt11++;
                tnp.push([row-5-col,col+5]);
            } else if (points[row-5-col][col+5]!==0) {
                check=false;
            }
            if (cnt11===4&&check) {
                for(var i = 0 ; i<tnp.length ; i++){
                    worth[tnp[i][0]][tnp[i][1]]++;
                }
            }
        }
    }
    for (var col = 1 ; col<6 ; col++){
        check = true;
        tnp=[];
        cnt11=0;
        for(var i = 0 ; i < 5 ; i++) {
            if (points[9-i][col+i]===value) {
                cnt11++;
                tnp.push([9-i,col+i]);
            } else if (points[9-i][col+i]!==0) {
                check=false;
            }
        }
        if (cnt11===4&&check) {
            for(var i = 0 ; i<tnp.length ; i++){
                worth[tnp[i][0]][tnp[i][1]]++;
            }
        }
        for (var row = 0 ; row<5-col ; row++) {
            if (points[9-row][col+row]===value) {
                tnp.splice(0,1);
                cnt11--;
            } else if (points[9-row][col+row]!==0) {
                check=true;
            }
            if (points[4-row][col+5+row]===value) {
                cnt11++;
                tnp.push([4-row,col+5+row]);
            } else if (points[4-row][col+5+row]!==0) {
                check=false;
            }
            if (cnt11===4&&check) {
                for(var i = 0 ; i<tnp.length ; i++){
                    worth[tnp[i][0]][tnp[i][1]]++;
                }
            }
        }
    }
    var returnValues = [];
    var max = 0;
    for( var i = 0 ; i<board.length ; i++ ){
        for( var j = 0 ; j<board[i].length ; j++ ){
            if (max<worth[i][j]) {
                max = worth[i][j];
            }
        }
    }
    if (max!=0) {
        for( var i = 0 ; i<board.length ; i++ ){
            for( var j = 0 ; j<board[i].length ; j++ ){
                if (max===worth[i][j]) {
                    returnValues.push([i,j]);
                }
            }
        }
    }
    return returnValues;
    
}
//checks if lines is won and turns them over
function checker(x,y){
    var value = points[x][y];
    var tnp = [];
    
    var check11 = true;
    var check12 = true;
    var check13 = true;
    var check21 = true;
    var check23 = true;
    var check31 = true;
    var check32 = true;
    var check33 = true;
    
    var cnt11 = 0;
    var cnt12 = 0;
    var cnt13 = 0;
    var cnt21 = 0;
    
    for(var i = 1 ; i < 5 ; i++) { //check later for edges
        if (x-i!==-1 && x-i!==-1 && check11 && points[x-i][y-i]===value) {
            cnt11++;
            tnp.push([x-i,y-i])
        } else {
            check11 = false;
        }
        if (x+i!==10 && x+i!==10 && check33 && points[x+i][y+i]===value) {
            cnt11++;
            tnp.push([x+i,y+i])
        } else {
            check33 = false;
        }
    }
    if (cnt11>=4) {
        if (value === 1) {
            blueLines++;
        } else if (value === 3){
            greenLines++;
        }
        finishLine(x,y,value);
        for(var i = 0 ; i<4 ; i++){
            finishLine(tnp[i][0],tnp[i][1],value);
        }
    } else if (cnt11===8) {
        if (value === 1) {
            blueLines+=2;
        } else if (value === 3){
            greenLines+=2;
        }
        finishLine(x,y,value);
        for(var i = 0 ; i<8 ; i++){
            finishLine(tnp[i][0],tnp[i][1],value);
        }
    }
    tnp = [];
    for(var i = 1 ; i < 5 ; i++) { //check later for edges
        if (y-i!==-1 && check12 && points[x][y-i]===value) {
            cnt12++;
            tnp.push([x,y-i])
        } else {
            check12 = false;
        }
        if (y+i!==10 && check32 && points[x][y+i]===value) {
            cnt12++;
            tnp.push([x,y+i])
        } else {
            check32 = false;
        }
    }
    if (cnt12>=4) {
        if (value === 1) {
            blueLines++;
        } else if (value === 3){
            greenLines++;
        }
        finishLine(x,y,value);
        for(var i = 0 ; i<4 ; i++){
            finishLine(tnp[i][0],tnp[i][1],value);
        }
    } else if (cnt12===8) {
        if (value === 1) {
            blueLines+=2;
        } else if (value === 3){
            greenLines+=2;
        }
        finishLine(x,y,value);
        for(var i = 0 ; i<8 ; i++){
            finishLine(tnp[i][0],tnp[i][1],value);
        }
    }
    tnp = [];
    for(var i = 1 ; i < 5 ; i++) { //check later for edges
        if (x+i!==10 && y-i!==-1 && check13 && points[x+i][y-i]===value) {
            cnt13++;
            tnp.push([x+i,y-i])
        } else {
            check13 = false;
        }
        if (x-i!==-1 && y+i!==10 && check31 && points[x-i][y+i]===value) {
            cnt13++;
            tnp.push([x-i,y+i])
        } else {
            check31 = false;
        }
    }
    if (cnt13>=4) {
        if (value === 1) {
            blueLines++;
        } else if (value === 3){
            greenLines++;
        }
        finishLine(x,y,value);
        for(var i = 0 ; i<4 ; i++){
            finishLine(tnp[i][0],tnp[i][1],value);
        }
    } else if (cnt13===8) {
        if (value === 1) {
            blueLines+=2;
        } else if (value === 3){
            greenLines+=2;
        }
        finishLine(x,y,value);
        for(var i = 0 ; i<8 ; i++){
            finishLine(tnp[i][0],tnp[i][1],value);
        }
    }
    tnp = [];
    for(var i = 1 ; i < 5 ; i++) { //check later for edges
        if (x-i!==-1 && check21 && points[x-i][y]===value) {
            cnt21++;
            tnp.push([x-i,y])
        } else {
            check21 = false;
        }
        if (x+i!==10 && check23 && points[x+i][y]===value) {
            cnt21++;
            tnp.push([x+i,y])
        } else {
            check23 = false;
        }
    }
    if (cnt21>=4) {
        if (value === 1) {
            blueLines++;
        } else if (value === 3){
            greenLines++;
        }
        finishLine(x,y,value);
        for(var i = 0 ; i<4 ; i++){
            finishLine(tnp[i][0],tnp[i][1],value);
        }
    } else if (cnt21===8) {
        if (value === 1) {
            blueLines+=2;
        } else if (value === 3){
            greenLines+=2;
        }
        finishLine(x,y,value);
        for(var i = 0 ; i<8 ; i++){
            finishLine(tnp[i][0],tnp[i][1],value);
        }
    }
    tnp = [];
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

//has an Add J
function hasAdd(player){
    for (var i = 0 ; i < player.length ; i++){
        if (player[i] === 0) {
            return i;
        }
    }
    return -1;
}

//has a Remove J
function hasRemove(player) {
    for (var i = 0 ; i < player.length ; i++){
        if (player[i]===-1) {
            return i;
        }
    }
    return -1;
}
function hasOnlyJ(player) {
    for (var i = 0 ; i < player.length ; i++){
        if (player[i]!==-1&&player[i]!==0) {
            return false;
        }
    }
    return true;
}
function hasOnlyRemoveJ(player) {
    for (var i = 0 ; i < player.length ; i++){
        if (player[i]!==-1) {
            return false;
        }
    }
    return true;
}

//has a useless card
function hasUselessCard(options) {
    for (var i = 0 ; i < options.length ; i++){
        if (options[i].length===0) {
            return i;
        }
    }
    return false;
}

//---------------------------------------------//

//-----------------game functions--------------//
//creates board and deck
function initialize()
{
    //creates indexes for rows 1 - 5
    for (var row = 0 ; row < 5 ; row++) {
        var rowinfo = [];
        var pointsrow = [];
        var pointworthrow = [];
        for( var col = 1 ; col<=10 ; col++)
        {
            if (row==0) {
                if (col==1||col==10) {
                    
                    rowinfo.push(1);
                    pointsrow.push(0);
                    pointworthrow.push(0);
                } else {
                    rowinfo.push(col);
                    pointsrow.push(0);
                    pointworthrow.push(0);
                }
                continue;
            } else {
                rowinfo.push(col+10*row-1);
                pointsrow.push(0);
                pointworthrow.push(0);
            }
        }
        board.push(rowinfo);
        points.push(pointsrow);
        pointworth.push(pointworthrow);
    }

    //copies a reverse of rows 1 - 5
    for (var i = 0 ; i < 5 ; i++)
    {
        board.push(board[4-i].slice().reverse());
        points.push(points[4-i].slice());
        pointworth.push(pointworth[4-i].slice());
    }
    for (var i = 2 ; i < 50 ; i++)
    {
        deck.push(i);
        deck.push(i);
    }
    for (var i = 0 ; i < 4 ; i++)
    {
        deck.push(1);
    }
    for (var i = 0 ; i < 4 ; i++)
    {
        deck.push(0);
        deck.push(-1);
    }
    shuffle(deck);
 
    //create deck //deal deck
    var player1 = [];
    var player2 = [];
    var player3 = [];
    var player4 = [];
    for (var i = maxCards - handLength ; i < maxCards ; i++)
    {
        player1.push(deck[i]);
    }
    for (var i = maxCards - 2 * handLength ; i < maxCards - handLength ; i++)
    {
        player2.push(deck[i]);
    }
    for (var i = maxCards - 3 * handLength ; i < maxCards - 2 * handLength ; i++)
    {
        player3.push(deck[i]);
    }
    for (var i = maxCards - 4 * handLength ; i < maxCards - 3 * handLength ; i++)
    {
        player4.push(deck[i]);
    }
    players = [player1.slice(),player2.slice(),player3.slice(),player4.slice()];
    showHands();
    
    var cnt = 1;
    for(var i = 0 ; i<board.length ; i++)
    {
        $('#one').append('<tr id =one'+i+'></tr>');
        for(var j = 0 ; j<board[i].length ; j++)
        {
            $('#one'+i).append('<td class="v'+points[i][j]+'" id="'+cnt+'">'+changeToCards(board[i][j])+'</td>');
            cnt++;
        }
    }
}

//restart game
function restart (){
    for (var row = 0 ; row < 10 ; row++) {
        for( var col = 0 ; col< 10 ; col++)
        {
            points[row][col]=0;
        }
    }
    shuffle(deck);
    
    var player1 = [];
    var player2 = [];
    var player3 = [];
    var player4 = [];
    for (var i = maxCards - handLength ; i < maxCards ; i++)
    {
        player1.push(deck[i]);
    }
    for (var i = maxCards - 2 * handLength ; i < maxCards - handLength ; i++)
    {
        player2.push(deck[i]);
    }
    for (var i = maxCards - 3 * handLength ; i < maxCards - 2 * handLength ; i++)
    {
        player3.push(deck[i]);
    }
    for (var i = maxCards - 4 * handLength ; i < maxCards - 3 * handLength ; i++)
    {
        player4.push(deck[i]);
    }
    players = [player1.slice(),player2.slice(),player3.slice(),player4.slice()];
    showHands();
    
    for(var i = 1 ; i<=100 && animate; i++)
    {
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
    while (0 !== currentIndex) {
  
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

//changes a value to 0 because of remove J
function value0(x,y) {
    points[x][y] = 0;
        var position = 10*x+y+1;
        if (animate) {
        $('#'+position).removeClass();
        $('#'+position).addClass('v0');
        }
}

//changes value to given value of card played
function changeValue(x,y,value) {
    points[x][y] = value;
        var position = 10*x+y+1;
        if (animate) {
        $('#'+position).removeClass('v0');
        $('#'+position).addClass('v'+value);
        }
}

//creates a line
function finishLine(x,y,value){
    points[x][y] = value+1;
    pointworth[x][y]++;
        var position = 10*x+y+1;
        if (animate) {
        $('#'+position).removeClass('v'+value);
        $('#'+position).addClass('v'+(value+1));
        }
}

//shows Hand on board
function showHands(){
    $("#p0").empty();
    $("#p1").empty();
    $("#p2").empty();
    $("#p3").empty();
    for (var i = 0 ; i<players.length ; i++) {
        for (var j = 0 ; j<players[i].length ; j++) {
            $("#p"+i).append("<div id='p"+i+"_"+j+"'>"+changeToCards(players[i][j])+"</div>");
        }
    }
}

var pastRemove = true;
var pastPlayer = -1;
var pastCardIndex = -1;
var pastCard = -2;
var pastChange = false;
function animateHand(index,player,remove,change){
    if (pastPlayer!==-1){
        if (!pastRemove) {
            if (!pastChange) {
                $('#p'+pastPlayer+'_'+pastCardIndex).removeClass('raise');
                $('#p'+pastPlayer+'_'+pastCardIndex).html(changeToCards(pastCard));
            }
        } else {
            $('#p'+pastPlayer+'_'+pastCardIndex).removeClass('raise');
            size = players[pastPlayer].length;
            $('#p'+pastPlayer+'_'+size).remove();
            for ( var i = pastCardIndex ; i < size ; i++) {
                $('#p'+pastPlayer+'_'+i).html(changeToCards(players[pastPlayer][i]));
            }
        }
        
    }
    if (!change) {
        $('#p'+player+'_'+index).addClass('raise');
        pastRemove = remove;
    } else {
        $('#p'+player+'_'+index).html(changeToCards(players[player][index]));
        if (remove) {
            size = players[player].length;
            $('#p'+player+'_'+size).remove();
            for ( var i = index ; i < size ; i++) {
                $('#p'+player+'_'+i).html(changeToCards(players[player][i]));
            }
        }
        pastRemove = false;
    }
    pastCard = players[player][index];
    pastCardIndex = index;
    pastPlayer = player;
    pastChange = change;
}
function showWorth() {
    for(var x = 0 ; x<10; x++)
    {
        for(var y = 0 ; y<10; y++)
        {
            i=x*10+y+1;
            $('#'+i).removeClass();
            $('#'+i).addClass('v0');
            $('#'+i).text(pointworth[x][y]);
        }
    }
    showArray(pointworth,"#values");
}
function showArray(data,container){
    if (Array.isArray(data)) {
        $(container).append('[');
        for(var i = 0 ; i<data.length ; i++) {
            showArray(data[i],container);
            if (i!=data.length-1) {
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
    for (var i = 0 ; i<players.length ; i++)
    {
        if (i === player) {
            continue;
        }
        for (var j = 0 ; j<players[i].length; j++) {
            $('#p'+i+'_'+j).addClass('hide');
        }
    }
}
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
    for(var card = 0 ; card<options.length ; card++) {
        for (var side = 0 ; side<options[card].length; side++) {
            var position = options[card][side][0]*10+options[card][side][1]+1;
            $('#'+position).addClass('possible');
        }
    }
}