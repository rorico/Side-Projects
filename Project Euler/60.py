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

def recursive(array,lower):
    #if len(array)>4:
    #    limit = 150000
    #else:
    #    limit = 10000
    limit = 10000
    for i in range(lower + 2,limit,2):
        if(i%5==0):
            continue
        check = True
        for j in array:
            if not (isPrime(int(str(j)+str(i))) and isPrime(int(str(i)+str(j)))):
                check = False
                break
        if(check):
            if not isPrime(i):
                continue
            array.append(i)
            if(len(array)==5):
                total = 0
                for j in array:
                    if not isPrime(j):
                        print("!",end="")
                    print(j," ",end="")
                    total += j
                print(total)
                array.pop()
                return
            else:
                recursive(array,i)
            array.pop()

recursive([],11)
sys.exit(0)


print(isPrime(3))
print(isPrime(37))
print(isPrime(67))
print(isPrime(2059))
print(isPrime(6721))

#done = ["3","31","259","12253"]
done = ["3","37","67","2059"]
for i in range(6721,70000000,2):
    if(i%5==0):
        continue
    if(i%3==0):
        continue
    if((i-2)%3==0):
        continue
    #print(i)
    check = True
    for j in done:
        if not (isPrime(int(j+str(i))) and isPrime(int(str(i)+j))):
            check = False
            break
    if(check):
        print(i)
        break
