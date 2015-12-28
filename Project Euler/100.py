#! python
import sys
import math

def primeFactorize(number):
    if number<2:
        return
    elif number==2:
        print(number)
        return
    for i in range(2,math.ceil(number**0.5)+1):
        if number%i==0:
        	print(i,end=" ")
        	primeFactorize(math.floor(number/i))
        	return
    print(number)

num1 = 1
sqrt2 = math.sqrt(2)
for i in range(3,10**12,2):
	num = num1 * i
	baseDenom = num*(num-1)
	for j in range(math.floor(i*sqrt2),10000000000000):
		num2 = num1*j
		prob = num2*(num2-1)/baseDenom
		if prob == 2:
			num1 = i
			primeFactorize(num2)
			primeFactorize(num)
			print(num2,num)
			primeFactorize(num2-1)
			primeFactorize(num-1)
			print("")
			break
		elif prob>2:
			break