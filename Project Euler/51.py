#! python
import sys
import math

def isPrime(number):
    if(number<2):
        return False
    for i in range(2,math.ceil(math.sqrt(number))):
        if number%i==0:
            return False
    return True

def checkNumber(number,digits):
    """log = ""
    for i in range(digits):
        log += "\t"
    print(log + "test" + str(digits))
    """

    if(digits == 0):
        cnt = 0
        for i in range(10):
            test = number.replace("a",str(i))
            if isPrime(int(test)):
                cnt+=1
        return cnt

    for i in range(len(number)):
        if number[i] == "a":
            continue
        part1 = number[:i]
        part2 = number[i:]
        num = part1 + "a" + part2 
        test = checkNumber(num,digits-1)
        if test>7:
            print(num)
    return 0

number = "a2a3a3"   ####
cnt = 0
for i in range(10):
    test = number.replace("a",str(i))
    if isPrime(int(test)):
        print(test)
        cnt+=1
                    #remove up to here to redo solution

check = True;
for digits in range(1,100):

    print("DIGITS" + str(digits))
    for i in range(1,digits):
        base1 = 10**(digits-i-1)
        base2 = 10**(digits-i)
        for j in range (base1,base2):
            checkNumber(str(j),i)