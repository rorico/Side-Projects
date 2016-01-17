#! python
import sys
import math

def primeList(n):
	ret = []
	base = [True] * (n+1)
	for i in range(2,n+1):
		if base[i]:
			ret.append(i)
			for j in range(2 * i, n+1,i):
				base[i] = False
	return ret

primes = primeList(7072)

d = dict()
lim = 50000000

for i in primes:
	print(i)
	base1 = i*i*i*i
	if base1 > lim:
		break
	for j in primes:
		base2 = base1 + j*j*j
		if base2 > lim:
			break
		for k in primes:
			base3 = base1 + k*k
			if base3 > lim:
				break
			if not base3 in d:
				d[base3] = 1
print(len(d))