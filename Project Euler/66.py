#! python
import sys
import math

d = dict()

for i in range(math.ceil(math.sqrt(1000))):
    d[i**2] = 1


for i in range(1000):
    if i in d:
        continue

#https://en.wikipedia.org/wiki/Pell%27s_equation