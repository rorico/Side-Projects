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

end = math.floor(1e6 + 1)
nums = [0] * end
total = 0
for i in range(2,len(nums)):
	k = i-1
	if nums[i] == 0:
		total+=k
		for j in range(2*i,end,i):
			nums[j]+=k
	else:
		k2 = k-nums[i]
		total+=k-nums[i]
		for j in range(2*i,end,i):
			nums[j]+=k2

	#print(i,total)

print(total)
sys.exit(0)
cnt = 0
for i in range(2,21):
	cnt2 = 0
	for j in range(1,i):
		if relPrime(j,i):
			cnt+=1
			cnt2+=1
	print(cnt2)
print(cnt)


sys.exit(0)
array = [1,1]

index = 0
while(True):
	num = array[index] + array[index + 1]
	print(num)
	if index%2 == 1 and num > 1000000:
		break
	array.append(num)
	array.append(array[index + 1])
	index+=1

print("done")