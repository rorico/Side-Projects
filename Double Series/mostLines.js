//used in a lot of different AIs
//returns indexes for options with greatest value
function mostLines(options,value,offensive){
    var type = value;
    var typeFor = value;
    var typeAgainst = 4 - value;
    var number = 4; //helps a line of four
    var worth = [];
    var best = 0;

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

    //if finds a line of 4,breakopenbreaks out of for loop
    var breakopen = true;
    while(number!==-1&&breakopen){
        for(var card = 0; card<options.length&&breakopen ; card++){
            //continue out if a Jack
            if (options[card]===-1||options[card]===0) {
                continue;
            }

            //switches from offensive to defensive
            for(var blah = 0 ; blah<=1&&breakopen; blah++){
                if (blah===0) {
                    type = typeFor;
                } else if (offensive||number<3) {
                    continue;
                } else if (!offensive) {
                    type = typeAgainst;
                }

            
            for(var side = 0; side<options[card].length ; side++){

                //row x, col y
                var x = options[card][side][0];
                var y = options[card][side][1];
                
                var check = false;
                
                var checkOpen = 0;
                var checkremove = true;
                var removed = 0; 
                var cnt = 0;
                
                //diagonal
                for(var i = 1 ; i < 5 ; i++) { //11
                    if (x-i!==-1 && y-i!==-1){
                        if(points[x-i][y-i]===type) {
                            cnt++;
                        } else if(points[x-i][y-i]!==0){
                            checkOpen++;
                        }
                    } else {
                        removed+=5-i;
                        break;
                    }
                }
                for(var i = 1 ; i<=removed ; i++){
                    if (x+i!==10 && y+i!==10){
                        if(points[x+i][y+i]===type) {
                            cnt++;
                        } else if(points[x+i][y+i]!==0){
                            checkOpen++;
                        }
                    } else {
                        checkremove = false;
                        break;
                    }
                }
                if (cnt===number&&checkOpen===0) {
                    check = true;
                    worth[card][side]+=number*number;
                }
                for(var i = removed + 1 ; i<5 && x+i!==10 && y+i!==10 && checkremove ; i++){
                    if (points[x+i-5][y+i-5]===type) {
                        cnt--;
                    } else if (points[x+i-5][y+i-5]!==0){
                        checkOpen--;
                    }
                    if (points[x+i][y+i]===type) {
                        cnt++;
                    } else if (points[x+i][y+i]!==0){
                        checkOpen++;
                    }
                    if (cnt===number&&checkOpen===0) {
                        check = true;
                        worth[card][side]+=number*number;
                    }
                }
                
                checkOpen = 0;
                checkremove = true;
                removed = 0;
                cnt = 0;
                for(var i = 1 ; i < 5 ; i++) { //12
                    if (x-i!==-1){
                        if(points[x-i][y]===type) {
                            cnt++;
                        } else if(points[x-i][y]!==0){
                            checkOpen++;
                        }
                    } else {
                        removed+=5-i;
                        break;
                    }
                }
                for(var i = 1 ; i<=removed ; i++){
                    if (x+i!==10){
                        if(points[x+i][y]===type) {
                            cnt++;
                        } else if(points[x+i][y]!==0){
                            checkOpen++;
                        }
                    } else {
                        checkremove = false;
                        break;
                    }
                }
                if (cnt===number&&checkOpen===0) {
                    check = true;
                    worth[card][side]+=number*number;
                }
                for(var i = removed + 1 ; i<5 && x+i!==10 && checkremove ; i++){
                    if (points[x+i-5][y]===type) {
                        cnt--;
                    } else if (points[x+i-5][y]!==0){
                        checkOpen--;
                    }
                    if (points[x+i][y]===type) {
                        cnt++;
                    } else if (points[x+i][y]!==0){
                        checkOpen++;
                    }
                    if (cnt===number&&checkOpen===0) {
                        check = true;
                        worth[card][side]+=number*number;
                    }
                }
                
                checkOpen = 0;
                checkremove = true;
                removed = 0;
                cnt = 0;
                for(var i = 1 ; i < 5 ; i++) { //13
                    if (x-i!==-1 && y+i!==10){
                        if(points[x-i][y+i]===type) {
                            cnt++;
                        } else if(points[x-i][y+i]!==0){
                            checkOpen++;
                        }
                    } else {
                        removed+=5-i;
                        break;
                    }
                }
                for(var i = 1 ; i<=removed ; i++){
                    if (x+i!==10 && y-i!==-1){
                        if(points[x+i][y-i]===type) {
                            cnt++;
                        } else if(points[x+i][y-i]!==0){
                            checkOpen++;
                        }
                    } else {
                        checkremove = false;
                        break;
                    }
                }
                if (cnt===number&&checkOpen===0) {
                    check = true;
                    worth[card][side]+=number*number;
                }
                for(var i = removed + 1 ; i<5 && x+i!==10 && y-i!==-1 && checkremove ; i++){
                    if (points[x+i-5][y-i+5]===type) {
                        cnt--;
                    } else if (points[x+i-5][y-i+5]!==0){
                        checkOpen--;
                    }
                    if (points[x+i][y+i]===type) {
                        cnt++;
                    } else if (points[x+i][y-i]!==0){
                        checkOpen++;
                    }
                    if (cnt===number&&checkOpen===0) {
                        check = true;
                        worth[card][side]+=number*number;
                    }
                }
                checkOpen = 0;
                checkremove = true;
                removed = 0;
                cnt = 0;
                for(var i = 1 ; i < 5 ; i++) { //11
                    if (y-i!==-1){
                        if(points[x][y-i]===type) {
                            cnt++;
                        } else if(points[x][y-i]!==0){
                            checkOpen++;
                        }
                    } else {
                        removed+=5-i;
                        break;
                    }
                }
                for(var i = 1 ; i<=removed ; i++){
                    if (y+i!==10){
                        if(points[x][y+i]===type) {
                            cnt++;
                        } else if(points[x][y+i]!==0){
                            checkOpen++;
                        }
                    } else {
                        checkremove = false;
                        break;
                    }
                }
                if (cnt===number&&checkOpen===0) {
                    check = true;
                    worth[card][side]+=number*number;
                }
                for(var i = removed + 1 ; i<5 && y+i!==10 && checkremove ; i++){
                    if (points[x][y+i-5]===type) {
                        cnt--;
                    } else if (points[x][y+i-5]!==0){
                        checkOpen--;
                    }
                    if (points[x][y+i]===type) {
                        cnt++;
                    } else if (points[x][y+i]!==0){
                        checkOpen++;
                    }
                    if (cnt===number&&checkOpen===0) {
                        check = true;
                        worth[card][side]+=number*number;
                        }
                    }
            }
            }
            if (check === true) {
                best = number;
                //breakopen = false;
                //break;
            }
        }
        number--
    }

    //return max
    
    var returnValues = [best];
    var max = 0;
    for( var i = 0 ; i<worth.length ; i++ ){
        for( var j = 0 ; j<worth[i].length ; j++ ){
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
    
}
