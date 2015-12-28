#! python
import sys
import math

d = dict()

for i in range(math.ceil(math.log(10**25,2))):
	d[2**i] = i


num = 10**25
sort = sorted(d,reverse=True)

array = []

for x in sort:
	for i in range(2):
		if num >= x:
			num -= x
			#print(x)
			array.append(d[x])
print(array)
cnt = array[0] - array[1] + 1
before = 1
for i in range(1,len(array)):
	if i + 1 == len(array):
		next = array[i] + 1
	else:
		next = array[i] - array[i+1] + 1
	tnp = cnt
	cnt *= next 
	cnt -= before
	before = tnp

print(cnt)

sys.exit(0)
base = array.reverse()


holder = []


print(array)
cnt = 1
for i in range(len(array)):
	#print(cnt)
	new = list(array)
	index = i
	while(True):
		if index == len(new):
			break
		num = new[index]
		if num>0:
			if index==0 or num-1 > new[index-1]:
				new[index] = num-1
				new.insert(index,num-1)
				holder.append(list(new))
				cnt+=1
				index-=1
		index+=1
		if i == 0:
			print(new)

print(cnt)

"""

2+8+32

1 1 8 32
1 1 4 4 32
1 1 2 2 4 32
1 1 2 2 4 16 16
1 1 2 2 4 8 8 16
2 8 32
2 4 4 32
2 4 4 16 16
2 4 4 8 8 16
2 8 16 16
1 1 8 16 16
1 1 4 4 16 16

2 4 4 8 8 16

2 4 4 32

1 1 2 2 4 32



42
"""