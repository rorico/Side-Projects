#! python
import sys
import math

def coprime(n1,n2):
    if n1 == 1:
        return True
    for i in range(2,n1+1):
        if n1%i == 0:
            if n2%i == 0:
                return False
            else:
                return coprime(math.floor(n1/i),n2)

limit = 1500000
d = dict()
for i in range(1,math.floor(math.sqrt(limit/2)) + 1):
    for j in range((i%2)+1,i,2):
        if not coprime(j,i):
            continue
        le = 2 * ( i * ( i + j ) )
        if le>limit:
            break
        else:
            for key in range(le,limit + 1,le):
                if key in d:
                    d[key] += 1
                else:
                    d[key] = 1
cnt = 0
for w in d:
    if d[w]==1:
        cnt+=1
print(cnt)