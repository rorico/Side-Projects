#! python
import sys
import math

d = dict()

for i in range(10000000000):
    key = ''.join(sorted(str(i**3)))
    if key == ''.join(sorted('589323567104')):
        print(i**3)
    if key in d:
        d[key]+=1
        if d[key] == 5:
            print(i**3)
            break
    else:
        d[key]=1

