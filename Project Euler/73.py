#! python
import sys
import math

def relPrime(num1,num2):
	if num2%num1 == 0 and num1 != 1:
		return False
	for i in range(2,math.ceil(math.sqrt(num1))+1):
		if num1%i == 0 and num2%i == 0:
			return False
	return True

end = math.floor(12001)
nums = [0] * end
total = 0
for i in range(4,len(nums)):
	k1 = i - 1
	k = math.floor(i/2)-math.ceil(i/3)+1
	if i%2 == 0:
		k-=1
	if i%3 == 0:
		k-=1
	if nums[i] == 0:
		total+=k
		for j in range(2*i,end,i):
			nums[j]+=k
	else:
		k2 = k-nums[i]
		total+=k-nums[i]
		for j in range(2*i,end,i):
			nums[j]+=k2

	print(i,total)

print(total)
'''
array = [2,3]


check = True
while(check):
	print(array)
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

'''