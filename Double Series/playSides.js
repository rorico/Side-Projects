function playSides(player,value,offensive) {
    var options = getOptions(players[player]);
    var useless = hasUselessCard(options);
    if (useless!==false) {
        return [0,useless,[-1,-1]];
    }
    var best = mostLines(options,value,offensive);
    if (best[0]!==4) {
        var removePos = hasRemove(players[player]);
        if (removePos!==-1) {
            var options2 = removeJ(value);
            if (options2.length!==0) {
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
        if (addPos!==-1) {
            var options2 = addJ(value,offensive);
            if (options2.length!==0) {
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
    if (best[0]<=3) {
        var bestCard = -1;
        var bestAmount = 0;
        var side = -1;
        for( var i = 0 ; i<options.length ; i++ ){
            var sideInfo = bestSide(options[i],value,offensive);
            if (bestAmount<sideInfo[0]) {
                bestCard = i;
                bestAmount = sideInfo[0];
                side = sideInfo[1];
            }
            
        }
        if (bestCard === -1) {
        } else {
            var x = options[bestCard][side][0];
            var y = options[bestCard][side][1];
            return [1,bestCard,[x,y]];
        }
    }
    var random = Math.floor(Math.random()*best[1].length);
    var card = best[1][random][0];
    var side = best[1][random][1];
    var x = options[card][side][0];
    var y = options[card][side][1];
    return [1,card,[x,y]];
}

function bestSide(card,value,offensive){
    var type = value;
    var number = 4;
    var worth = [];
    if (card.length===1) {
        return [0];
    }
    for (var j = 0 ; j<card.length ; j++) {
        worth.push(0);
    }
    var breakopen = true;
    while(number!==-1&&breakopen){    
        for(var side = 0; side<card.length ; side++){
            var x = card[side][0];
            var y = card[side][1];
            
            var check = false;
            
            var checkOpen = 0;
            var checkremove = true;
            var removed = 0;
            var cnt = 0;
            
            for( var blah = 0 ; blah<=1&&breakopen; blah++){
                if (blah===0) {
                    type = value;
                } else if (offensive||number<3) {
                    continue;
                } else if (!offensive) {
                    type=4-value;
                }
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
                    worth[side]+=number*number;
                }
                for(var i = removed ; i<5 && x+i!==10 && y+i!==10 && checkremove ; i++){
                    if (points[x+i-4][y+i-4]===type) {
                        cnt--;
                    } else if (points[x+i-4][y+i-4]!==0){
                        checkOpen--;
                    }
                    if (points[x+i][y+i]===type) {
                        cnt++;
                    } else if (points[x+i][y+i]!==0){
                        checkOpen++;
                    }
                    if (cnt===number&&checkOpen===0) {
                        check = true;
                        worth[side]+=number*number;
                    }
                }
                
                checkOpen = 0;
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
                    worth[side]+=number*number;
                }
                for(var i = removed ; i<5 && x+i!==10 && checkremove ; i++){
                    if (points[x+i-4][y]===type) {
                        cnt--;
                    } else if (points[x+i-4][y]!==0){
                        checkOpen--;
                    }
                    if (points[x+i][y]===type) {
                        cnt++;
                    } else if (points[x+i][y]!==0){
                        checkOpen++;
                    }
                    if (cnt===number&&checkOpen===0) {
                        check = true;
                        worth[side]+=number*number;
                    }
                }
                
                checkOpen = 0;
                removed = 0;
                cnt = 0;
                for(var i = 1 ; i < 5 ; i++) { //11
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
                    worth[side]+=number*number;
                }
                for(var i = removed ; i<5 && x+i!==10 && y-i!==-1 && checkremove ; i++){
                    if (points[x+i-4][y-i+4]===type) {
                        cnt--;
                    } else if (points[x+i-4][y-i+4]!==0){
                        checkOpen--;
                    }
                    if (points[x+i][y+i]===type) {
                        cnt++;
                    } else if (points[x+i][y-i]!==0){
                        checkOpen++;
                    }
                    if (cnt===number&&checkOpen===0) {
                        check = true;
                        worth[side]+=number*number;
                    }
                }
                checkOpen = 0;
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
                    worth[side]+=number*number;
                }
                for(var i = removed ; i<5 && y+i!==10 && checkremove ; i++){
                    if (points[x][y+i-4]===type) {
                        cnt--;
                    } else if (points[x][y+i-4]!==0){
                        checkOpen--;
                    }
                    if (points[x][y+i]===type) {
                        cnt++;
                    } else if (points[x][y+i]!==0){
                        checkOpen++;
                    }
                    if (cnt===number&&checkOpen===0) {
                        check = true;
                        worth[side]+=number*number;
                    }
                }
            }
            if (check) {
                breakopen = false;
                break;
            }
        }
        number--
    }
    
    var returnValues = [];
    var max = 0;
    var maxPos = -1;
    for( var i = 0 ; i<worth.length ; i++ ){
        if (max<worth[i]) {
            max = worth[i];
            maxPos = i;
        }
    }
    var secondMax = 0;
    var secondMaxPos = -1;
    for( var i = 0 ; i<worth.length ; i++ ){
        if (i===maxPos) {
            continue;
        }
        if (secondMax<worth[i]) {
            secondMax = worth[i];
            secondMaxPos = i;
        }
    }
    returnValues.push(max-secondMax);
    returnValues.push(maxPos);
    returnValues.push(secondMaxPos);
    return returnValues;
}