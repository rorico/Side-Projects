

//random add jack
function addJR() {
    var options = [];
    for ( var i = 0 ; i<board.length ; i++ )
    {
        for ( var j = 0 ; j<board[i].length ; j++ )
        {
            if (points[i][j]===0) {
                options.push([i,j]);
            }
        }
    }
    return options;
}

//random remove jack 
function removeJR(colour) {
    colour=4-colour;
    var options = [];
    for ( var i = 0 ; i<board.length ; i++ )
    {
        for ( var j = 0 ; j<board[i].length ; j++ )
        {
            if (points[i][j]===colour) {
                options.push([i,j]);
            }
        }
    }
    return options;
}

//add jack
function addJ(colour,offensive) {
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
            for (var i = 0 ; i < 5 ; i++) {
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
            for (var i = 0 ; i < 5 ; i++) {
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
            for (var i = 0 ; i < 5 ; i++) {
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
            for (var i = 0 ; i < 5 ; i++) {
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
            for (var i = 0 ; i < 5 ; i++) {
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
            for (var i = 0 ; i < 5 ; i++) {
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
function addJ_2(colour) {
    var options = check4_2(colour);
    return options;
}

//remove jack 
function removeJ(colour) {
    colour = 4-colour;       
    var worth = [];
    for ( var i = 0 ; i<board.length ; i++ ){
        var worthrow = [];
        for ( var j = 0 ; j<board[i].length ; j++ ){
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
        for (var i = 0 ; i < 5 ; i++) {
            if (points[row][i]===value) {
                cnt21++;
                tnp.push([row,i])
            } else if (points[row][i]!==0) {
                check=false;
            }
        }
        if (cnt21===4&&check) {
            for (var i = 0 ; i<tnp.length ; i++){
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
                for (var i = 0 ; i<tnp.length ; i++){
                    worth[tnp[i][0]][tnp[i][1]]++;
                }
            }
        }
    }
    for (var col = 0 ; col<10 ; col++){
        check = true;
        tnp=[];
        cnt12=0;
        for (var i = 0 ; i < 5 ; i++) {
            if (points[i][col]===value) {
                cnt12++;
                tnp.push([i,col]);
            } else if (points[i][col]!==0) {
                check=false;
            }
        }
        if (cnt12===4&&check) {
            for (var i = 0 ; i<tnp.length ; i++){
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
                for (var i = 0 ; i<tnp.length ; i++){
                    worth[tnp[i][0]][tnp[i][1]]++;
                }
            }
        }
    }
    for (var row = 0 ; row<6 ; row++){
        check = true;
        cnt11=0;
        for (var i = 0 ; i < 5 ; i++) {
            if (points[row+i][i]===value) {
                cnt11++;
                tnp.push([row+i,i]);
            } else if (points[row+i][i]!==0) {
                check=false;
            }
        }
        if (cnt11===4&&check) {
            for (var i = 0 ; i<tnp.length ; i++){
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
                for (var i = 0 ; i<tnp.length ; i++){
                    worth[tnp[i][0]][tnp[i][1]]++;
                }
            }
        }
    }
    for (var col = 1 ; col<6 ; col++){
        check = true;
        tnp=[];
        cnt11=0;
        for (var i = 0 ; i < 5 ; i++) {
            if (points[i][col+i]===value) {
                cnt11++;
                tnp.push([i,col+i]);
            } else if (points[i][col+i]!==0) {
                check=false;
            }
        }
        if (cnt11===4&&check) {
            for (var i = 0 ; i<tnp.length ; i++){
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
                for (var i = 0 ; i<tnp.length ; i++){
                    worth[tnp[i][0]][tnp[i][1]]++;
                }
            }
        }
    }
    for (var row = 4 ; row<10 ; row++){
        check = true;
        tnp=[];
        cnt11=0;
        for (var i = 0 ; i < 5 ; i++) {
            if (points[row-i][i]===value) {
                cnt11++;
                tnp.push([row-i,i]);
            } else if (points[row-i][i]!==0) {
                check=false;
            }
        }
        if (cnt11===4&&check) {
            for (var i = 0 ; i<tnp.length ; i++){
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
                for (var i = 0 ; i<tnp.length ; i++){
                    worth[tnp[i][0]][tnp[i][1]]++;
                }
            }
        }
    }
    for (var col = 1 ; col<6 ; col++){
        check = true;
        tnp=[];
        cnt11=0;
        for (var i = 0 ; i < 5 ; i++) {
            if (points[9-i][col+i]===value) {
                cnt11++;
                tnp.push([9-i,col+i]);
            } else if (points[9-i][col+i]!==0) {
                check=false;
            }
        }
        if (cnt11===4&&check) {
            for (var i = 0 ; i<tnp.length ; i++){
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
                for (var i = 0 ; i<tnp.length ; i++){
                    worth[tnp[i][0]][tnp[i][1]]++;
                }
            }
        }
    }
    var returnValues = [];
    var max = 0;
    for ( var i = 0 ; i<board.length ; i++ ){
        for ( var j = 0 ; j<board[i].length ; j++ ){
            if (max<worth[i][j]) {
                max = worth[i][j];
            }
        }
    }
    if (max!=0) {
        for ( var i = 0 ; i<board.length ; i++ ){
            for ( var j = 0 ; j<board[i].length ; j++ ){
                if (max===worth[i][j]) {
                    returnValues.push([i,j]);
                }
            }
        }
    }
    return returnValues;
    
}


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