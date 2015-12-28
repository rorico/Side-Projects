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