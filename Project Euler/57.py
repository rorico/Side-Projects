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

cnt = 0

numer = 1
denom = 1
for i in range(1000):
    tnpD = numer + denom
    numer = denom + tnpD
    denom = tnpD
    if(len(str(numer))>len(str(denom))):
        cnt+=1

print(cnt)