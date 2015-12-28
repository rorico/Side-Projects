#! python
import sys
import math


def getN(i):
    cnt = 0;
    ranges = (i/math.sqrt(2));
    for j in range(math.ceil(i/2.0-ranges),0):
        if i*i/2-(i/2-j)*(i/2-j)<0:
            print(str(i*i/2)+ "  " + str((i/2-j)*(i/2-j)))
        test = math.sqrt(i*i/2-(i/2-j)*(i/2-j))+i/2;
        if( test==math.floor(test)):
            cnt+=1;  
    return cnt
    cnt = (cnt * 2 + 1) * 4;
        
    #print(str(i) + " | " + str(cnt) + " | " + str((cnt-4)/8));
possible = []
def recursive(past):
    base = 1
    tnp = list(past)
    for i in range(len(past)):
        base *=(2*past[i])+1
    number = 0
    while(1==1):
        number+=1
        n = (base*(2*number+1)-1)/2
        if n==52:
            retString = ""
            for i in range(len(past)):
                retString += str(past[i]) + " "
            retString += str(number)
            print(retString)
        elif n>52:
            break
        else:
            tnp.append(number)
            recursive(tnp)
            tnp.pop()

def isPrime(number):
    if(number<2):
        return False
    for i in range(2,math.floor(math.ceil(number))):
        if number%i==0:
            return False
    return True
#print(getN(171640625))
array = []
recursive(array)

total = 0
limit3 = 10**11

limit = 4733728
d2 = dict()
d = dict()
for i in range(1,100000):
    base = i*i
    #print(i)
    if base>limit:
        break
    #print(i)
    for j in range((i%2)+1,i,2):
        #print(j)
        baseJ = base + j*j
        if baseJ == 117:
            print(str(i) + " | " + str(j) + " | " + str(baseJ))
        if baseJ>limit:
            break
        #if (not isPrime(baseJ)):
        #    break
        else:
            key = math.floor(baseJ)
            #print(key)
            if key in d:
                d[key] += 1
            else:
                d[key] = 1
            for k in range(1,limit):
                x = k * baseJ
                if x>limit:
                    break
                else:
                    key = math.floor(x)
                    #print(key)
                    if key in d2:
                        d2[key] += 1
                    else:
                        d2[key] = 1
print("done")

limit2 = 278455

dic = dict()
Prime = dict()
for w in d:
    if d[w]==1 and d2[w]==1:
        dic[w] = 1
        for i in range(w,limit2,w):
            Prime[i] = 1
print("done2")


nonPrime = dict()
for i in range (1, limit2):
    if not i in Prime:
        nonPrime[i] = 1
print("done3")

nonPrime = sorted(nonPrime)

Primes = sorted(dic)

'''sys.exit()
for w in Primes:
    print(w)
sys.exit()'''

for w in Primes:
    #print(w)
    base1 = w*w*w
    if base1>limit3:
        break;
    for e in Primes:
        #print(e)
        if w == e:
            continue
        base2 = base1*e*e
        if base2>limit3:
            break;
        for r in Primes:
            if r == w or r == e:
                continue
            num = base2*r
            if num>limit3:
                    break
            multiplier = 0
            limit4 = math.floor(limit3/num)
            if limit4>limit2:
                print("what" + str(limit4))
            for t in nonPrime:
                #print(t)
                if t > limit4:
                    break
                multiplier += t
            total += multiplier*num
            #print(w*w*w*e*e*r)



for w in Primes:
    #print(w)
    base1 = w**10
    if base1>limit3:
        break;
    for e in Primes:
        #print(e)
        if w == e:
            continue
        base2 = base1*e*e
        if base2>limit3:
            break;
        multiplier = 0
        limit4 = math.floor(limit3/base2)
        for t in nonPrime:
            #print(t)
            if t > limit4:
                break
            multiplier += t
        total += multiplier*base2


for w in Primes:
    #print(w)
    base1 = w**7
    if base1>limit3:
        break;
    for e in Primes:
        #print(e)
        if w == e:
            continue
        base2 = base1*e*e*e
        if base2>limit3:
            break;
        #print(str(w) + " | " + str(e) + " | " + str(base2))
        multiplier = 0
        limit4 = math.floor(limit3/base2)
        for t in nonPrime:
            if t > limit4:
                break
            #print(t)
            multiplier += t
        total += multiplier*base2
print(total)

#for w in d:
#    print(w)
sys.exit()

d = dict()
for i in range(1,100000):
    base = i*i
    if base>10**4:
        break
    #print(i)
    for j in range((i%2)+1,i,2):
        #print(j)
        baseJ = base + j*j
        if baseJ>10**4:
            break
        else:
            key = math.floor(baseJ)
            #print(key)
            if key in d:
                d[key] += 1
            else:
                d[key] = 1
        '''for k in range(1,100000):
            x = k * baseJ
            if x == 325:
                print (str(i) +  " | " +  str(j) + " | " + str(k))
            if x>10**4:
                break
            else:
                key = math.floor(x)
                #print(key)
                if key in d:
                    d[key] += 1
                else:
                    d[key] = 1'''
dic = dict()
for w in sorted(d, key=d.get, reverse=True):
    for k in range(1,100000):
        x = k * w
        if x == 1105:
            print (str(w) + " | " + str(d[w]) + " | " + str(k))
        if x>10**4:
            break
        else:
            key = math.floor(x)
            #print(key)
            if key in dic:
                dic[key] += d[w]
            else:
                dic[key] = d[w]
for key in dic:
    if key == 1105:
        print(str(key) + " | " + str(dic[key]))
    if dic[key] == 52:
        print(key)
    





#getN(359125)

#for i in range(math.floor((10**11)/((5**3)*(13**2)))):
'''for i in range(1000):
    if(isPrime(i)):
        cnt = getN(i)
        if cnt==1:
            print(i)
        elif cnt>1:
            print(str(i) + " " + str(cnt))
'''



'''cnt = 0;
test = 0;
ranges = 0;
maxes = 0;
numbers_sizes = (29*13*13*17*17*5**exp for exp in range(0, 13))
numbers_sizes = ((17**a)*(13**b)*(5**c) for a in range(0, 4) for b in range(0, 4) for c in range(0, 4))
for i in numbers_sizes: #range(3,220):
    cnt = 0;
    ranges = (i/1.41421356);
    for j in range(math.ceil(i/2.0-ranges),0):
        test = math.sqrt(i*i/2-(i/2-j)*(i/2-j))+i/2;
        if( test==math.floor(test)):
            cnt+=1;  
    cnt = (cnt * 2 + 1) * 4;
        
    print(str(i) + " | " + str(cnt) + " | " + str((cnt-4)/8));
'''




'''x^52
x*y^17
x^2+

(x)(2y+1)(2z+1) + yx(min(x,y,z))


2zx+x+z

a=zx+(z+1)/2

x(2y+1)(2z+1)+((2y+1)(2z+1)+1)/2-1

((2x+1)(2y+1)(2z+1)-1)/2'''