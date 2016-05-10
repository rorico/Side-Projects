function playHybrid (player,value){
    if (value===3) {
        if (greenLines===1) {
            return playAI(player,value,true);
        } else {
            return playAI(player,value,false);
        }
    } else if (value===1) {
        if (blueLines===1) {
            return playAI(player,value,true);
        } else {
            return playAI(player,value,false);
        }
    }
    return [-2,-1,[-1,-1]];
}