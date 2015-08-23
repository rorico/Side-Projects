#! python
import sys


sets = [[[0,0]]]

test = "23456781"
def start():
    digit = 0
    set = []
    base = 1
    cnt = 0
    check = test[len(test)-digit-1:]
    for i in range(0,digit):
        base*=10
        
    for k in range(len(sets[digit])):
        for i in range(1,9):
            num1 = sets[digit][k][0] + i*base
            for j in range (i,9):
                num2 = sets[digit][k][1] + j*base
                tnp = str(num1*num2)
                tnp = tnp[len(tnp)-digit-1:]
                #print(tnp)
                if tnp == check:
                    set.append([num1,num2])
                    cnt+=1
            
    sets.append(set)
    recursive(1)
    
def recursive(digit):
    if digit>5:
        return
    set = []
    base = 1
    cnt = 0
    check = test[len(test)-digit-1:]
    for i in range(0,digit):
        base*=10
        
    for k in range(len(sets[digit])):
        for i in range(1,9):
            num1 = sets[digit][k][0] + i*base
            for j in range (1,9):
                num2 = sets[digit][k][1] + j*base
                tnp = str(num1*num2)
                tnp = tnp[len(tnp)-digit-1:]
                #print(tnp)
                if tnp == check:
                    set.append([num1,num2])
                    #print(digit)
                    #print(set)
                    cnt+=1
            
    print (cnt)
    #print(digit)
    sets.append(set)
    digit+=1
    #print(set)
    recursive(digit)

start()
print(sets[2])