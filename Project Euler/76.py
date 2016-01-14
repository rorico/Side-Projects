#! python
import sys
import math


array = [0]
def recursive(n,lowest):
	if n == 0:
		#print()
		return 1
	cnt = 0
	for i in range(1,n+1):
		if i > lowest:
			break
		#print(i,end=" ")
		cnt += recursive(n-i,i)
	return cnt



#for i in range(1,10):
#	print(i,recursive(i,i),"\n")

#sys.exit(0)
for i in range(1,51):
	cnt = 1
	for j in range(1,math.ceil(i/2)):
		cnt+=array[j]
	n = i - math.ceil(i/2)
	cnt += recursive(i,n)
	array.append(cnt)
	print(i,cnt)#,recursive(i,i))
i = 100
cnt = 1
for j in range(1,math.ceil(i/2)):
	cnt+=array[j]
n = i - math.ceil(i/2)
cnt += recursive(i,n)
print(cnt)