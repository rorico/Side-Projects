function playAIphil(player,value,offensive) {
    //get all options
    var options = getOptions(players[player]);

    //determines useless cards
    var useless = hasUselessCard(options);
    if (useless!==false) {
        return [0,useless,[-1,-1]];
    }

    //determines best line
    var best = mostLinesPhil(options,value,offensive);

    if (best[0]!=4) {
        var removePos = hasRemove(players[player]);
        if (removePos!=-1) {
            var options2 = removeJ(value);
            if (options2.length!=0) {
                var side = Math.floor(Math.random()*options2.length);
                var x = options2[side][0];
                var y = options2[side][1];
                return [-1,removePos,[x,y]];
            }  else if (hasOnlyRemoveJ(players[player])){
                options = removeJR(value);
                var side = Math.floor(Math.random()*options.length);
                var x = options[side][0];
                var y = options[side][1];
                return [-1,removePos,[x,y]];
            }
        }
        var addPos = hasAdd(players[player]);
        if (addPos!=-1) {
            var options2 = addJ(value,offensive);
            if (options2.length!=0) {
                var side = Math.floor(Math.random()*options2.length);
                var x = options2[side][0];
                var y = options2[side][1];
                return [1,addPos,[x,y]];
            } else if (hasOnlyJ(players[player])){
                options = addJR();
                var side = Math.floor(Math.random()*options.length);
                var x = options[side][0];
                var y = options[side][1];
                return [1,addPos,[x,y]];
            }
        }
    }
    var random = Math.floor(Math.random()*best[1].length);
    var card = best[1][random][0];
    var side = best[1][random][1];
    var x = options[card][side][0];
    var y = options[card][side][1];
    return [1,card,[x,y]];
}    

//search: PhilAI
function mostLinesPhil(options,value,offensive){
    var typeFor = value;
    var typeAgainst = 4 - typeFor;
    var number = 0; //helps a line of four
    var worth = [];

    //initialize worth to be 0
    for(var i = 0 ; i<options.length ; i++){
        var worthrow = [];

        //if Jacks, push -1
        if (options[i]==-1||options[i]==0) {
            worthrow.push(-1);
        } else {
            for (var j = 0 ; j<options[i].length ; j++) {
                worthrow.push(0);
            }
        }
        worth.push(worthrow);
    }

    for(var card = 0; card<options.length; card++){
        if (options[card]===-1||options[card]===0) {
            continue;
        }

        for(var side = 0; side<options[card].length ; side++){
            var row = options[card][side][0];
            var col = options[card][side][1];
            var actualSide = side;

            //console.log("card: " + card + " side: " + side);
            //vertical
            for (var i = -4; i <= 0; i++){

                var start = row + i;
                if(start < 0 || start > 5){
                    continue;
                }

                var cntFor = 0;
                var cntAgainst = 0;
                var cntWon = 0;
                var cntOpNotPlayedInHand = 0;
                var cntOpPlayedNotInHand = 0;
                var cntOpPlayedInHand = 0;

                for(var j = 0; j <=4; j++){
                    var indexRow = row + i + j;
                    var indexCol = col;
                    var breakout = true;

                    for(var card2 = 0; card2<options.length && breakout; card2++){
                        for(var side2 = 0; side2<options[card2].length && breakout; side2++){

                            var row2 = options[card2][side2][0];
                            var col2 = options[card2][side2][1];

                            if (row == row2 && col == col2){
                                continue;
                            }

                            if(points[indexRow][indexCol]===typeFor) {
                                cntFor++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===typeAgainst){
                                cntAgainst++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
                                cntWon++;
                                breakout = false;
                            } else if(points[9-indexRow][9-indexCol] > 0 && indexRow == row2 && indexCol == col2){
                                //console.log("OP1: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedInHand = cntOpPlayedInHand + 0.75;
                            } else if(points[9-indexRow][9-indexCol] > 0){
                                //console.log("OP2: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedNotInHand++;
                            } else if(indexRow == row2 && indexCol == col2){
                                //console.log("OP3: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpNotPlayedInHand = cntOpNotPlayedInHand + 0.4;
                            }
                        }
                    }
                }

                if(cntFor === 4 || cntAgainst === 4){
                    if (number === 0){
                        number = 4;
                    }
                }

                //console.log("cntFor: " + cntFor + " cntONPIH: " + cntOpNotPlayedInHand + " cntOPIH: " + cntOpPlayedInHand)
                cntFor = round(cntFor + cntOpNotPlayedInHand + cntOpPlayedInHand,0);
                if(cntWon > 0){

                } else if(cntFor > 0 && cntAgainst > 0){

                } else if (cntFor > 0){
                    worth[card][actualSide] += valueFor(cntFor);
                } else if (cntAgainst > 0){
                    worth[card][actualSide] += valueAgainst(cntAgainst);
                }
                //console.log("V: card: " + card + " side: " + side + " start " + start +" indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);

            }

            //horizontal
            for (var i = -4; i <= 0; i++){

                var start = col + i;
                if(start < 0 || start > 5){
                    continue;
                }

                var cntFor = 0;
                var cntAgainst = 0;
                var cntWon = 0;
                var cntOpNotPlayedInHand = 0;
                var cntOpPlayedNotInHand = 0;
                var cntOpPlayedInHand = 0;

                for(var j = 0; j <=4; j++){
                    var indexRow = row;
                    var indexCol = col + i + j;
                    var breakout = true;

                    for(var card2 = 0; card2<options.length && breakout; card2++){
                        for(var side2 = 0; side2<options[card2].length && breakout; side2++){

                            var row2 = options[card2][side2][0];
                            var col2 = options[card2][side2][1];

                            if (row == row2 && col == col2){
                                continue;
                            }

                            if(points[indexRow][indexCol]===typeFor) {
                                cntFor++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===typeAgainst){
                                cntAgainst++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
                                cntWon++;
                                breakout = false;
                            } else if(points[9-indexRow][9-indexCol] > 0 && indexRow == row2 && indexCol == col2){
                                //console.log("OP1: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedInHand = cntOpPlayedInHand + 0.75;
                            } else if(points[9-indexRow][9-indexCol] > 0){
                                //console.log("OP2: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedNotInHand++;
                            } else if(indexRow == row2 && indexCol == col2){
                                //console.log("OP3: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpNotPlayedInHand = cntOpNotPlayedInHand + 0.4;
                            }
                        }
                    }
                }

                if(cntFor === 4 || cntAgainst === 4){
                    if (number === 0){
                        number = 4;
                    }
                }

                //console.log("cntFor: " + cntFor + " cntONPIH: " + cntOpNotPlayedInHand + " cntOPIH: " + cntOpPlayedInHand)
                cntFor = round(cntFor + cntOpNotPlayedInHand + cntOpPlayedInHand,0);
                if(cntWon > 0){

                } else if(cntFor > 0 && cntAgainst > 0){

                } else if (cntFor > 0){
                    worth[card][actualSide] += valueFor(cntFor);
                } else if (cntAgainst > 0){
                    worth[card][actualSide] += valueAgainst(cntAgainst);
                }
                //console.log("H: card: " + card + " side: " + side + " start " + start +" indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);

            }

            // //horizontal
            // for (var i = -4; i <= 0; i++){

            //     var start = col + i;
            //     if(start < 0 || start > 5){
            //         continue;
            //     }

            //     var cntFor = 0;
            //     var cntAgainst = 0;
            //     var cntWon = 0;
            //     var cntOpPlayed = 0;
            //     var cntForInHand = 0;

            //     for(var j = 0; j <=4; j++){

            //         var indexRow = row;
            //         var indexCol = col + i + j;
                    
            //         if(points[indexRow][indexCol]===typeFor) {
            //             cntFor++;
            //         } else if(points[indexRow][indexCol]===typeAgainst){
            //             cntAgainst++;
            //         } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
            //             cntWon++;
            //         } else if(points[9-indexRow][9-indexCol] > 0){
            //             cntOpPlayed++;
            //         }

            //         // for(var card2 = 0; card2<options.length; card2++){
            //         //     for(var side2 = 0; side2<options[card2].length ; side2++){
            //         //         var row2 = options[card2][side2][0];
            //         //         var col2 = options[card2][side2][1];
            //         //         if (indexRow == row2 && indexCol == col2){
            //         //             cntForInHand++;
            //         //         }
            //         //     }
            //         // }

            //     }

            //     if(cntFor === 4 || cntAgainst === 4){
            //         if (number === 0){
            //             number = 4;
            //         }
            //     }

            //     //cntFor = cntFor + cntForInHand;
            //     if(cntWon > 0){

            //     } else if(cntFor > 0 && cntAgainst > 0){

            //     } else if (cntFor > 0){
            //         worth[card][actualSide] += valueFor(cntFor);
            //         //console.log("HF: card: " + card + " side: " + side  + " actualSide: " + actualSide + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " options " + options[card][side] + " worth " + worth[card][actualSide]);
            //     } else if (cntAgainst > 0){
            //         worth[card][actualSide] += valueAgainst(cntAgainst);
            //         //console.log("HA: card: " + card + " side: " + side  + " actualSide: " + actualSide + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " options " + options[card][side] + " worth " + worth[card][actualSide]);
            //     }
            //     //console.log("H: card: " + card + " side: " + side + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);

            // }



            //diagonal
            for (var i = -4; i <= 0; i++){

                var startRow = row + i;
                var startCol = col + i;
                if(startRow < 0 || startRow > 5 || startCol < 0 || startCol > 5){
                    continue;
                }

                var cntFor = 0;
                var cntAgainst = 0;
                var cntWon = 0;
                var cntOpNotPlayedInHand = 0;
                var cntOpPlayedNotInHand = 0;
                var cntOpPlayedInHand = 0;

                for(var j = 0; j <=4; j++){
                    var indexRow = row + i + j;
                    var indexCol = col + i + j;
                    var breakout = true;

                    for(var card2 = 0; card2<options.length && breakout; card2++){
                        for(var side2 = 0; side2<options[card2].length && breakout; side2++){

                            var row2 = options[card2][side2][0];
                            var col2 = options[card2][side2][1];

                            if (row == row2 && col == col2){
                                continue;
                            }

                            if(points[indexRow][indexCol]===typeFor) {
                                cntFor++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===typeAgainst){
                                cntAgainst++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
                                cntWon++;
                                breakout = false;
                            } else if(points[9-indexRow][9-indexCol] > 0 && indexRow == row2 && indexCol == col2){
                                //console.log("OP1: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedInHand = cntOpPlayedInHand + 0.75;
                            } else if(points[9-indexRow][9-indexCol] > 0){
                                //console.log("OP2: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedNotInHand++;
                            } else if(indexRow == row2 && indexCol == col2){
                                //console.log("OP3: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpNotPlayedInHand = cntOpNotPlayedInHand + 0.4;
                            }
                        }
                    }
                }

                if(cntFor === 4 || cntAgainst === 4){
                    if (number === 0){
                        number = 4;
                    }
                }

                //console.log("cntFor: " + cntFor + " cntONPIH: " + cntOpNotPlayedInHand + " cntOPIH: " + cntOpPlayedInHand)
                cntFor = round(cntFor + cntOpNotPlayedInHand + cntOpPlayedInHand,0);
                if(cntWon > 0){

                } else if(cntFor > 0 && cntAgainst > 0){

                } else if (cntFor > 0){
                    worth[card][actualSide] += valueFor(cntFor);
                } else if (cntAgainst > 0){
                    worth[card][actualSide] += valueAgainst(cntAgainst);
                }
                //console.log("D1: card: " + card + " side: " + side + " start " + start +" indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);

            }

            // //diagonal
            // for (var i = -4; i <= 0; i++){

            //     var startRow = row + i;
            //     var startCol = col + i;
            //     if(startRow < 0 || startRow > 5 || startCol < 0 || startCol > 5){
            //         continue;
            //     }

            //     var cntFor = 0;
            //     var cntAgainst = 0;
            //     var cntWon = 0;
            //     var cntOpPlayed = 0;
            //     var cntForInHand = 0;

            //     for(var j = 0; j <=4; j++){

            //         var indexRow = row + i + j;
            //         var indexCol = col + i + j;
                    
            //         if(points[indexRow][indexCol]===typeFor) {
            //             cntFor++;
            //         } else if(points[indexRow][indexCol]===typeAgainst){
            //             cntAgainst++;
            //         } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
            //             cntWon++;
            //         } else if(points[9-indexRow][9-indexCol] > 0){
            //             cntOpPlayed++;
            //         }

            //         // for(var card2 = 0; card2<options.length; card2++){
            //         //     for(var side2 = 0; side2<options[card2].length ; side2++){
            //         //         var row2 = options[card2][side2][0];
            //         //         var col2 = options[card2][side2][1];
            //         //         if (indexRow == row2 && indexCol == col2){
            //         //             cntForInHand++;
            //         //         }
            //         //     }
            //         // }
            //     }
            //     if(cntFor === 4 || cntAgainst === 4){
            //         if (number === 0){
            //             number = 4;
            //         }
            //     }

            //     //cntFor = cntFor + cntForInHand;
            //     if(cntWon > 0){

            //     } else if(cntFor > 0 && cntAgainst > 0){

            //     } else if (cntFor > 0){
            //         worth[card][actualSide] += valueFor(cntFor);
            //         //console.log("DF: card: " + card + " side: " + side  + " actualSide: " + actualSide + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " options " + options[card][side] + " worth " + worth[card][actualSide]);
            //     } else if (cntAgainst > 0){
            //         worth[card][actualSide] += valueAgainst(cntAgainst);
            //         //console.log("DA: card: " + card + " side: " + side  + " actualSide: " + actualSide + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " options " + options[card][side] + " worth " + worth[card][actualSide]);
            //     }
            //     //console.log("D: card: " + card + " side: " + side + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);
            // }



            //diagonal right up
            for (var i = -4; i <= 0; i++){

                var startRow = row - i;
                var startCol = col + i;
                if(startRow < 4 || startRow > 9 || startCol < 0 || startCol > 5){
                    continue;
                }

                var cntFor = 0;
                var cntAgainst = 0;
                var cntWon = 0;
                var cntOpNotPlayedInHand = 0;
                var cntOpPlayedNotInHand = 0;
                var cntOpPlayedInHand = 0;

                for(var j = 0; j <=4; j++){
                    var indexRow = row - i - j;
                    var indexCol = col + i + j;
                    var breakout = true;

                    for(var card2 = 0; card2<options.length && breakout; card2++){
                        for(var side2 = 0; side2<options[card2].length && breakout; side2++){

                            var row2 = options[card2][side2][0];
                            var col2 = options[card2][side2][1];

                            if (row == row2 && col == col2){
                                continue;
                            }

                            if(points[indexRow][indexCol]===typeFor) {
                                cntFor++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===typeAgainst){
                                cntAgainst++;
                            } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
                                cntWon++;
                            } else if(points[9-indexRow][9-indexCol] > 0 && indexRow == row2 && indexCol == col2){
                                //console.log("OP1: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedInHand = cntOpPlayedInHand + 0.75;
                            } else if(points[9-indexRow][9-indexCol] > 0){
                                //console.log("OP2: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedNotInHand++;
                            } else if(indexRow == row2 && indexCol == col2){
                                //console.log("OP3: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpNotPlayedInHand = cntOpNotPlayedInHand + 0.4;
                            }
                        }
                    }
                }

                if(cntFor === 4 || cntAgainst === 4){
                    if (number === 0){
                        number = 4;
                    }
                }

                //console.log("cntFor: " + cntFor + " cntONPIH: " + cntOpNotPlayedInHand + " cntOPIH: " + cntOpPlayedInHand)
                cntFor = round(cntFor + cntOpNotPlayedInHand + cntOpPlayedInHand,0);
                if(cntWon > 0){

                } else if(cntFor > 0 && cntAgainst > 0){

                } else if (cntFor > 0){
                    worth[card][actualSide] += valueFor(cntFor);
                } else if (cntAgainst > 0){
                    worth[card][actualSide] += valueAgainst(cntAgainst);
                }
                //console.log("D2: card: " + card + " side: " + side + " start " + start +" indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);

            }
        }
    }

    //return max
    var returnValues = [number+1];
    var max = 0;
    for( var i = 0 ; i<worth.length ; i++ ){
        for( var j = 0 ; j<worth[i].length ; j++ ){
            //console.log("D: card: " + i + " side: " + j + " worth" + worth[i][j]);
            if(worth[i].length == 1){
                worth[i][j] = worth[i][j]/2;
            }    
            if (max<worth[i][j]) {
                max = worth[i][j];
            }
        }
    }
    var returnValuesValues = [];
    for( var i = 0 ; i<worth.length ; i++ ){
        for( var j = 0 ; j<worth[i].length ; j++ ){
            if (max===worth[i][j]) {
                returnValuesValues.push([i,j]);
            }
        }
    }
    returnValues.push(returnValuesValues);
    return returnValues;

    //return max
    // console.log(worth);
    // var returnValues = [number];
    // var maxDifference = [];
    // var bestestSide = [];        

    // var max = 0;


    // for( var i = 0 ; i<worth.length ; i++ ){
    //     maxDifference[i] = 0;
    // }

    // for( var i = 0 ; i<worth.length ; i++ ){
    //     if(worth[i].length == 1){
    //         maxDifference[i] = worth[i][0]/2;
    //         bestestSide[i] = 0;
    //     } else if (worth[i][0] <= worth[i][1])  {
    //         maxDifference[i] = worth[i][1] - worth[i][0];
    //         bestestSide[i] = 1;
    //     } else if (worth[i][0] > worth[i][1])  {
    //         maxDifference[i] = worth[i][0] - worth[i][1];
    //         bestestSide[i] = 0;
    //     } else{
    //         maxDifference[i] = 0;
    //         bestestSide[i] = 0;
    //     }

    //     if (max< maxDifference[i]) {
    //         max = maxDifference[i];
    //     }
    // }
    // var returnValuesValues = [];
    // for( var i = 0 ; i<worth.length ; i++ ){
    //     if (max===maxDifference[i]) {
    //         returnValuesValues.push([i,bestestSide[i]]);
    //     }
    // }
    // returnValues.push(returnValuesValues);
    // return returnValues;
    
}

    

function cardWorth(options,value,offensive){
    var typeFor = value;
    var typeAgainst = 4 - typeFor;
    var number = 0; //helps a line of four
    var worth = [];

    //initialize worth to be 0
    for(var i = 0 ; i<options.length ; i++){
        var worthrow = [];

        //if Jacks, push -1
        if (options[i]==-1||options[i]==0) {
            worthrow.push(-1);
        } else {
            for (var j = 0 ; j< 4 ; j++) {
                worthrow.push("N/A");
            }
        }
        worth.push(worthrow);
    }

    for(var card = 0; card<options.length; card++){
        if (options[card]===-1||options[card]===0) {
            continue;
        }

        for(var side = 0; side<options[card].length ; side++){
            var row = options[card][side][0];
            var col = options[card][side][1];
            var actualSide = 0;
            
            if(row >= 5){
                actualSide = 1; 
            }

            if(row == 9 && col == 0){
                actualSide = 2; 
            } else if (row == 9 && col == 9){
                actualSide = 3; 
            } else if (row == 0 && col == 9){
                actualSide = 1; 
            }
             
            worth[card][actualSide] = 0;
            //console.log("card: " + card + " side: " + side  + " actualSide: " + actualSide  + " options " + options[card][side]);

            //vertical
            for (var i = -4; i <= 0; i++){

                var start = row + i;
                if(start < 0 || start > 5){
                    continue;
                }

                var cntFor = 0;
                var cntAgainst = 0;
                var cntWon = 0;
                var cntOpNotPlayedInHand = 0;
                var cntOpPlayedNotInHand = 0;
                var cntOpPlayedInHand = 0;

                for(var j = 0; j <=4; j++){
                    var indexRow = row + i + j;
                    var indexCol = col;
                    var breakout = true;

                    for(var card2 = 0; card2<options.length && breakout; card2++){
                        for(var side2 = 0; side2<options[card2].length && breakout; side2++){

                            var row2 = options[card2][side2][0];
                            var col2 = options[card2][side2][1];

                            if (row == row2 && col == col2){
                                continue;
                            }

                            if(points[indexRow][indexCol]===typeFor) {
                                cntFor++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===typeAgainst){
                                cntAgainst++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
                                cntWon++;
                                breakout = false;
                            } else if(points[9-indexRow][9-indexCol] > 0 && indexRow == row2 && indexCol == col2){
                                //console.log("OP1: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedInHand = cntOpPlayedInHand + 0.75;
                            } else if(points[9-indexRow][9-indexCol] > 0){
                                //console.log("OP2: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedNotInHand++;
                            } else if(indexRow == row2 && indexCol == col2){
                                //console.log("OP3: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpNotPlayedInHand = cntOpNotPlayedInHand + 0.4;
                            }
                        }
                    }
                }

                if(cntFor === 4 || cntAgainst === 4){
                    if (number === 0){
                        number = 4;
                    }
                }

                //console.log("cntFor: " + cntFor + " cntONPIH: " + cntOpNotPlayedInHand + " cntOPIH: " + cntOpPlayedInHand)
                cntFor = round(cntFor + cntOpNotPlayedInHand + cntOpPlayedInHand,0);
                if(cntWon > 0){

                } else if(cntFor > 0 && cntAgainst > 0){

                } else if (cntFor > 0){
                    worth[card][actualSide] += valueFor(cntFor);
                } else if (cntAgainst > 0){
                    worth[card][actualSide] += valueAgainst(cntAgainst);
                }
                //console.log("V: card: " + card + " side: " + side + " start " + start +" indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);

            }

            //horizontal
            for (var i = -4; i <= 0; i++){

                var start = col + i;
                if(start < 0 || start > 5){
                    continue;
                }

                var cntFor = 0;
                var cntAgainst = 0;
                var cntWon = 0;
                var cntOpNotPlayedInHand = 0;
                var cntOpPlayedNotInHand = 0;
                var cntOpPlayedInHand = 0;

                for(var j = 0; j <=4; j++){
                    var indexRow = row;
                    var indexCol = col + i + j;
                    var breakout = true;

                    for(var card2 = 0; card2<options.length && breakout; card2++){
                        for(var side2 = 0; side2<options[card2].length && breakout; side2++){

                            var row2 = options[card2][side2][0];
                            var col2 = options[card2][side2][1];

                            if (row == row2 && col == col2){
                                continue;
                            }

                            if(points[indexRow][indexCol]===typeFor) {
                                cntFor++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===typeAgainst){
                                cntAgainst++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
                                cntWon++;
                                breakout = false;
                            } else if(points[9-indexRow][9-indexCol] > 0 && indexRow == row2 && indexCol == col2){
                                //console.log("OP1: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedInHand = cntOpPlayedInHand + 0.75;
                            } else if(points[9-indexRow][9-indexCol] > 0){
                                //console.log("OP2: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedNotInHand++;
                            } else if(indexRow == row2 && indexCol == col2){
                                //console.log("OP3: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpNotPlayedInHand = cntOpNotPlayedInHand + 0.4;
                            }
                        }
                    }
                }

                if(cntFor === 4 || cntAgainst === 4){
                    if (number === 0){
                        number = 4;
                    }
                }

                //console.log("cntFor: " + cntFor + " cntONPIH: " + cntOpNotPlayedInHand + " cntOPIH: " + cntOpPlayedInHand)
                cntFor = round(cntFor + cntOpNotPlayedInHand + cntOpPlayedInHand,0);
                if(cntWon > 0){

                } else if(cntFor > 0 && cntAgainst > 0){

                } else if (cntFor > 0){
                    worth[card][actualSide] += valueFor(cntFor);
                } else if (cntAgainst > 0){
                    worth[card][actualSide] += valueAgainst(cntAgainst);
                }
                //console.log("H: card: " + card + " side: " + side + " start " + start +" indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);

            }

            // //horizontal
            // for (var i = -4; i <= 0; i++){

            //     var start = col + i;
            //     if(start < 0 || start > 5){
            //         continue;
            //     }

            //     var cntFor = 0;
            //     var cntAgainst = 0;
            //     var cntWon = 0;
            //     var cntOpPlayed = 0;
            //     var cntForInHand = 0;

            //     for(var j = 0; j <=4; j++){

            //         var indexRow = row;
            //         var indexCol = col + i + j;
                    
            //         if(points[indexRow][indexCol]===typeFor) {
            //             cntFor++;
            //         } else if(points[indexRow][indexCol]===typeAgainst){
            //             cntAgainst++;
            //         } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
            //             cntWon++;
            //         } else if(points[9-indexRow][9-indexCol] > 0){
            //             cntOpPlayed++;
            //         }

            //         // for(var card2 = 0; card2<options.length; card2++){
            //         //     for(var side2 = 0; side2<options[card2].length ; side2++){
            //         //         var row2 = options[card2][side2][0];
            //         //         var col2 = options[card2][side2][1];
            //         //         if (indexRow == row2 && indexCol == col2){
            //         //             cntForInHand++;
            //         //         }
            //         //     }
            //         // }

            //     }

            //     if(cntFor === 4 || cntAgainst === 4){
            //         if (number === 0){
            //             number = 4;
            //         }
            //     }

            //     //cntFor = cntFor + cntForInHand;
            //     if(cntWon > 0){

            //     } else if(cntFor > 0 && cntAgainst > 0){

            //     } else if (cntFor > 0){
            //         worth[card][actualSide] += valueFor(cntFor);
            //         //console.log("HF: card: " + card + " side: " + side  + " actualSide: " + actualSide + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " options " + options[card][side] + " worth " + worth[card][actualSide]);
            //     } else if (cntAgainst > 0){
            //         worth[card][actualSide] += valueAgainst(cntAgainst);
            //         //console.log("HA: card: " + card + " side: " + side  + " actualSide: " + actualSide + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " options " + options[card][side] + " worth " + worth[card][actualSide]);
            //     }
            //     //console.log("H: card: " + card + " side: " + side + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);

            // }



            //diagonal
            for (var i = -4; i <= 0; i++){

                var startRow = row + i;
                var startCol = col + i;
                if(startRow < 0 || startRow > 5 || startCol < 0 || startCol > 5){
                    continue;
                }

                var cntFor = 0;
                var cntAgainst = 0;
                var cntWon = 0;
                var cntOpNotPlayedInHand = 0;
                var cntOpPlayedNotInHand = 0;
                var cntOpPlayedInHand = 0;

                for(var j = 0; j <=4; j++){
                    var indexRow = row + i + j;
                    var indexCol = col + i + j;
                    var breakout = true;

                    for(var card2 = 0; card2<options.length && breakout; card2++){
                        for(var side2 = 0; side2<options[card2].length && breakout; side2++){

                            var row2 = options[card2][side2][0];
                            var col2 = options[card2][side2][1];

                            if (row == row2 && col == col2){
                                continue;
                            }

                            if(points[indexRow][indexCol]===typeFor) {
                                cntFor++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===typeAgainst){
                                cntAgainst++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
                                cntWon++;
                                breakout = false;
                            } else if(points[9-indexRow][9-indexCol] > 0 && indexRow == row2 && indexCol == col2){
                                //console.log("OP1: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedInHand = cntOpPlayedInHand + 0.75;
                            } else if(points[9-indexRow][9-indexCol] > 0){
                                //console.log("OP2: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedNotInHand++;
                            } else if(indexRow == row2 && indexCol == col2){
                                //console.log("OP3: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpNotPlayedInHand = cntOpNotPlayedInHand + 0.4;
                            }
                        }
                    }
                }

                if(cntFor === 4 || cntAgainst === 4){
                    if (number === 0){
                        number = 4;
                    }
                }

                //console.log("cntFor: " + cntFor + " cntONPIH: " + cntOpNotPlayedInHand + " cntOPIH: " + cntOpPlayedInHand)
                cntFor = round(cntFor + cntOpNotPlayedInHand + cntOpPlayedInHand,0);
                if(cntWon > 0){

                } else if(cntFor > 0 && cntAgainst > 0){

                } else if (cntFor > 0){
                    worth[card][actualSide] += valueFor(cntFor);
                } else if (cntAgainst > 0){
                    worth[card][actualSide] += valueAgainst(cntAgainst);
                }
                //console.log("D1: card: " + card + " side: " + side + " start " + start +" indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);

            }

            // //diagonal
            // for (var i = -4; i <= 0; i++){

            //     var startRow = row + i;
            //     var startCol = col + i;
            //     if(startRow < 0 || startRow > 5 || startCol < 0 || startCol > 5){
            //         continue;
            //     }

            //     var cntFor = 0;
            //     var cntAgainst = 0;
            //     var cntWon = 0;
            //     var cntOpPlayed = 0;
            //     var cntForInHand = 0;

            //     for(var j = 0; j <=4; j++){

            //         var indexRow = row + i + j;
            //         var indexCol = col + i + j;
                    
            //         if(points[indexRow][indexCol]===typeFor) {
            //             cntFor++;
            //         } else if(points[indexRow][indexCol]===typeAgainst){
            //             cntAgainst++;
            //         } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
            //             cntWon++;
            //         } else if(points[9-indexRow][9-indexCol] > 0){
            //             cntOpPlayed++;
            //         }

            //         // for(var card2 = 0; card2<options.length; card2++){
            //         //     for(var side2 = 0; side2<options[card2].length ; side2++){
            //         //         var row2 = options[card2][side2][0];
            //         //         var col2 = options[card2][side2][1];
            //         //         if (indexRow == row2 && indexCol == col2){
            //         //             cntForInHand++;
            //         //         }
            //         //     }
            //         // }
            //     }
            //     if(cntFor === 4 || cntAgainst === 4){
            //         if (number === 0){
            //             number = 4;
            //         }
            //     }

            //     //cntFor = cntFor + cntForInHand;
            //     if(cntWon > 0){

            //     } else if(cntFor > 0 && cntAgainst > 0){

            //     } else if (cntFor > 0){
            //         worth[card][actualSide] += valueFor(cntFor);
            //         //console.log("DF: card: " + card + " side: " + side  + " actualSide: " + actualSide + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " options " + options[card][side] + " worth " + worth[card][actualSide]);
            //     } else if (cntAgainst > 0){
            //         worth[card][actualSide] += valueAgainst(cntAgainst);
            //         //console.log("DA: card: " + card + " side: " + side  + " actualSide: " + actualSide + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " options " + options[card][side] + " worth " + worth[card][actualSide]);
            //     }
            //     //console.log("D: card: " + card + " side: " + side + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);
            // }



            //diagonal right up
            for (var i = -4; i <= 0; i++){

                var startRow = row - i;
                var startCol = col + i;
                if(startRow < 4 || startRow > 9 || startCol < 0 || startCol > 5){
                    continue;
                }

                var cntFor = 0;
                var cntAgainst = 0;
                var cntWon = 0;
                var cntOpNotPlayedInHand = 0;
                var cntOpPlayedNotInHand = 0;
                var cntOpPlayedInHand = 0;

                for(var j = 0; j <=4; j++){
                    var indexRow = row - i - j;
                    var indexCol = col + i + j;
                    var breakout = true;

                    for(var card2 = 0; card2<options.length && breakout; card2++){
                        for(var side2 = 0; side2<options[card2].length && breakout; side2++){

                            var row2 = options[card2][side2][0];
                            var col2 = options[card2][side2][1];

                            if (row == row2 && col == col2){
                                continue;
                            }

                            if(points[indexRow][indexCol]===typeFor) {
                                cntFor++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===typeAgainst){
                                cntAgainst++;
                                breakout = false;
                            } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
                                cntWon++;
                                breakout = false;
                            } else if(points[9-indexRow][9-indexCol] > 0 && indexRow == row2 && indexCol == col2){
                                //console.log("OP1: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedInHand = cntOpPlayedInHand + 0.75;
                            } else if(points[9-indexRow][9-indexCol] > 0){
                                //console.log("OP2: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpPlayedNotInHand++;
                            } else if(indexRow == row2 && indexCol == col2){
                                //console.log("OP3: " + card + card2 + indexRow + row2 + indexCol + col2)
                                cntOpNotPlayedInHand = cntOpNotPlayedInHand + 0.4;
                            }
                        }
                    }
                }

                if(cntFor === 4 || cntAgainst === 4){
                    if (number === 0){
                        number = 4;
                    }
                }

                //console.log("cntFor: " + cntFor + " cntONPIH: " + cntOpNotPlayedInHand + " cntOPIH: " + cntOpPlayedInHand)
                cntFor = round(cntFor + cntOpNotPlayedInHand + cntOpPlayedInHand,0);
                if(cntWon > 0){

                } else if(cntFor > 0 && cntAgainst > 0){

                } else if (cntFor > 0){
                    worth[card][actualSide] += valueFor(cntFor);
                } else if (cntAgainst > 0){
                    worth[card][actualSide] += valueAgainst(cntAgainst);
                }
                //console.log("D2: card: " + card + " side: " + side + " start " + start +" indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);

            }

            // for (var i = -4; i <= 0; i++){

            //     var startRow = row - i;
            //     var startCol = col + i;
            //     if(startRow < 4 || startRow > 9 || startCol < 0 || startCol > 5){
            //         continue;
            //     }

            //     var cntFor = 0;
            //     var cntAgainst = 0;
            //     var cntWon = 0;
            //     var cntOpPlayed = 0;
            //     var cntForInHand = 0;

            //     for(var j = 0; j <=4; j++){

            //         var indexRow = row - i - j;
            //         var indexCol = col + i + j;
                    
            //         if(points[indexRow][indexCol]===typeFor) {
            //             cntFor++;
            //         } else if(points[indexRow][indexCol]===typeAgainst){
            //             cntAgainst++;
            //         } else if(points[indexRow][indexCol]===2 ||points[indexRow][indexCol]===4){
            //             cntWon++;
            //         } else if(points[9-indexRow][9-indexCol] > 0){
            //             cntOpPlayed++;
            //         }

            //         // for(var card2 = 0; card2<options.length; card2++){
            //         //     for(var side2 = 0; side2<options[card2].length ; side2++){
            //         //         var row2 = options[card2][side2][0];
            //         //         var col2 = options[card2][side2][1];
            //         //         if (indexRow == row2 && indexCol == col2){
            //         //             cntForInHand++;
            //         //         }
            //         //     }
            //         // }
            //     }
            //     if(cntFor === 4 || cntAgainst === 4){
            //         if (number === 0){
            //             number = 4;
            //         }
            //     }

            //     //cntFor = cntFor + cntForInHand;
            //     if(cntWon > 0){

            //     } else if(cntFor > 0 && cntAgainst > 0){

            //     } else if (cntFor > 0){
            //         worth[card][actualSide] += valueFor(cntFor);
            //         //console.log("DF: card: " + card + " side: " + side  + " actualSide: " + actualSide + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " options " + options[card][side] + " worth " + worth[card][actualSide]);
            //     } else if (cntAgainst > 0){
            //         worth[card][actualSide] += valueAgainst(cntAgainst);
            //         //console.log("DA: card: " + card + " side: " + side  + " actualSide: " + actualSide + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " options " + options[card][side] + " worth " + worth[card][actualSide]);
            //     }
            //     //console.log("D: card: " + card + " side: " + side + " start " + start + " indexRow " + indexRow + " indexCol " + indexCol + " cntFor " + cntFor + " cntAgainst " + cntAgainst + " worth " + worth[card][side]);
            // }

            //console.log("card: " + card + " side: " + " worth " + worth[card][side]);
        }
    }

    //return max
    //console.log(worth)
    return worth;

    //return max
    // var returnValues = [number];
    // var maxDifference = [];
    // var bestestSide = [];        

    // var max = 0;


    // for( var i = 0 ; i<worth.length ; i++ ){
    //     maxDifference[i] = 0;
    // }

    // for( var i = 0 ; i<worth.length ; i++ ){
    //     if(worth[i].length == 1){
    //         maxDifference[i] = worth[i][0]/2;
    //         bestestSide[i] = 0;
    //     } else if (worth[i][0] <= worth[i][1])  {
    //         maxDifference[i] = worth[i][1] - worth[i][0];
    //         bestestSide[i] = 1;
    //     } else if (worth[i][0] > worth[i][1])  {
    //         maxDifference[i] = worth[i][0] - worth[i][1];
    //         bestestSide[i] = 0;
    //     } else{
    //         maxDifference[i] = 0;
    //         bestestSide[i] = 0;
    //     }

    //     if (max< maxDifference[i]) {
    //         max = maxDifference[i];
    //     }
    // }
    // var returnValuesValues = [];
    // for( var i = 0 ; i<worth.length ; i++ ){
    //     if (max===maxDifference[i]) {
    //         returnValuesValues.push([i,bestestSide[i]]);
    //     }
    // }
    // returnValues.push(returnValuesValues);
    // return returnValues;
    
}

function valueFor(cntFor){
    switch (cntFor) {
        case 1:
            return 0.03;
        case 2:
            return 0.08;
        case 3:
            return 0.35;
        case 4:
            return 1;
        default:
            return 0;
    }
}

function valueAgainst(cntFor){
    switch (cntFor) {
        case 1:
            //return 0;
            return 0.005;
        case 2:
            //return 0;
            return 0.03;
        case 3:
            //return 0;
            return 0.15;
        case 4:
            //return 0;
            return 0.6;
        default:
            //return 0;
            return 0;
    }
}

function showCardWorth(array) {
    for (var i = 0 ; i<1 ; i++) {
        for (var j = 0 ; j < 7 ; j++) {
            //console.log(i + "j" + j + "j" + changeToCards(players[i][j])) + "p" + array[i][j];
            //$('#p1_'+j).html(array[j][i]);
            $('#p11'+j).html(changeToCards(players[i][j]));
        }
    }
    //console.log(array.length);
    for(var i = 0 ; i<array.length ; i++) {
        
        for(var j = 0 ; j<array[i].length ; j++) {
        //console.log(i + " " + j + " " + array[i][j]);

            $('#worth'+i+j).html(round(array[i][j],2));
        }
    }
}

function round(value, exp) {
  if (typeof exp === 'undefined' || +exp === 0)
    return Math.round(value);

  value = +value;
  exp  = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
    return NaN;

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}
