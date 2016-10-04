#! python
import sys


def print_binary(array):
    str = "["
    for ele in array:
        if isinstance(ele,list):
            str+=print_binary(ele)
        else:
            str+=bin(ele)
        str+=","
    str = str[:len(str)-1] + "]"
    return str


sets = [[[0,0]]]

test = "23456781"
test = bin(int(test))
test = test[2:]
print(test)
def recursive(digit):
    if digit>8:
        return
    set = []
    base = 1
    front = ""
    cnt = 0
    check = test[len(test)-digit-1:]
    for i in range(0,digit):
        base*=2
        front+="0"
        
    for k in range(len(sets[digit])):
        if sets[digit][k][0] != sets[digit][k][1]:
            for i in range(0,2):
                num1 = sets[digit][k][0] + i*base
                for j in range (0,2):
                    num2 = sets[digit][k][1] + j*base
                    tnp = bin(num1*num2)
                    tnp = front+tnp[2:]
                    tnp = tnp[len(tnp)-digit-1:]
                    if tnp == check:
                        set.append([num1,num2])
                        cnt+=1
        else:                
            for i in range(0,2):
                num1 = sets[digit][k][0] + i*base
                for j in range (i,2):
                    num2 = sets[digit][k][1] + j*base
                    tnp = bin(num1*num2)
                    tnp = front+tnp[2:]
                    tnp = tnp[len(tnp)-digit-1:]
                    if tnp == check:
                        set.append([num1,num2])
                        cnt+=1
            
    print (str(cnt) + " " + check)
    for num in set:
        str2 = ""
        str3 = 1
        for num2 in num:
            str2 += bin(num2)+" "
            str3*=num2
        str2+=bin(str3)
        print(str2)
    #print(digit)
    sets.append(set)
    digit+=1
    #print(set)
    recursive(digit)

recursive(0)
print(print_binary(sets[2]))




