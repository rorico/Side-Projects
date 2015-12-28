#! python
import sys
import math

def isPrime(number):
    if(number<2):
        return False
    for i in range(2,math.floor(math.ceil(number))):
        if number%i==0:
            return False
    return True

cnt = 1 #1 is a solution

for i in range(2,200):
    for j in range(200):
        num = i**j
        if(len(str(num)) == j):
            cnt+=1
print(cnt)