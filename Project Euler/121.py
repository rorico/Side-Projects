#! python
import sys
import math


def recursive(wonLeft,round,roundLeft):
	if wonLeft == 0:
		return 1
	if roundLeft == 0:
		return 0
	if wonLeft>roundLeft:
		return 0
	else:
		win = 1/round * recursive(wonLeft-1,round+1,roundLeft-1)
		lose = (round-1)/round * recursive(wonLeft,round+1,roundLeft-1)
		return win + lose

num = 15
win = math.floor(num/2) + 1

chanceToWin = recursive(win,2,num)
print(1/chanceToWin)
