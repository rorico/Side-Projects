#! python
import sys
import math

array = [2,3]


check = True
while(check):
	print("1")
	check = False
	i = 0
	while(True):
		if(i>len(array)-2):
			break
		sums = array[i] + array[i+1]
		if sums<=12000:
			array.insert(i+1,sums)
			i+=1
			check = True
		i+=1

print(len(array)-2)

