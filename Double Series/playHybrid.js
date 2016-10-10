function playHybrid(hand,value) {
    if (value===3) {
        if (greenLines===1) {
            return playAI(hand,value,true);
        } else {
            return playAI(hand,value,false);
        }
    } else if (value===1) {
        if (blueLines===1) {
            return playAI(hand,value,true);
        } else {
            return playAI(hand,value,false);
        }
    }
    return [-2,-1,[-1,-1]];
}