#! python
import sys
import math

def fact(num):
	if num == 0:
		return 1
	else:
		ret = 1
		for i in range(1,num+1):
			ret*=i
		return ret

facts = [0]*10
for i in range(len(facts)):
	facts[i] = fact(i)

total = 0
for i in range (1,1000000):
	array = []
	num = i
	cnt = 0
	while(not num in array):
		string = str(num)
		num2 = 0
		for j in string:
			num2 += facts[int(j)]
		array.append(num)
		num = num2
		cnt+=1
	if cnt == 60:
		print(i)
		total+=1
	#print(i)#,cnt,array)
print(total)