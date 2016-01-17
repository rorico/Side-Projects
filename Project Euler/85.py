#! python
import sys
import math

d = dict()
num = 2000000
for i in range(1,100000):
	n1 = math.floor(i * (i + 1) / 2)
	if n1 > num:
		break
	for j in range(1,i+1):
		n2 = math.floor(j * (j + 1) / 2)
		n = n1 * n2
		if abs(num - n) < 20:
			print(i,j,n)