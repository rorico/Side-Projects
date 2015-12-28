#! python
import sys
import math

def isPrime(number):
    if(number<2):
        return False
    for i in range(2,math.ceil(number**0.5)+1):
        if number%i==0:
            return False
    return True

def hasTwoFactors(number):
	for i in range(2,math.ceil(number**0.5)+1):
		if number%i==0:
			num2 = math.floor(number/i)
			if(isPrime(num2)):
				if ''.join(sorted(str(number))) == ''.join(sorted(str(number-i-num2+1))):
					print(number,number/(number-i-num2+1))
					return True
				return False

			return False
	return False
prime = []
for i in range(math.ceil(math.sqrt(10**7))*2):
	if isPrime(i):
		prime.append(i)

best = 2
for p1 in reversed(prime):
	for p2 in reversed(prime):
		if p1 == p2:
			continue
		num = p1 * p2
		if num>10**7:
			continue
		num2 = num-p1-p2+1
		if ''.join(sorted(str(num))) == ''.join(sorted(str(num2))):
			n = num / (num2)
			if best > n:
				best = n
				print(best,num)
		#break	

sys.exit(0)
for i in range(10**7,0,-1):
	#print(i)
	hasTwoFactors(i)
		#print(i)
		#break  

print("done")