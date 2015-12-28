#! python
import sys
import math



triple = []
square = []
penta = []
hexa = []
hepta = []
octa = []

allA = [triple,square,penta,hexa,hepta,octa]

for i in range(1,70000000):
    num = math.floor(i*(i+1)/2)
    length = len(str(num))
    if(length==4):
        triple.append(str(num))
    elif length>5:
        break

for i in range(1,70000000):
    num = math.floor(i*i)
    length = len(str(num))
    if(length==4):
        square.append(str(num))
    elif length>5:
        break

for i in range(1,70000000):
    num = math.floor(i*(3*i-1)/2)
    length = len(str(num))
    if(length==4):
        penta.append(str(num))
    elif length>5:
        break

for i in range(1,70000000):
    num = math.floor(i*(2*i-1))
    length = len(str(num))
    if(length==4):
        hexa.append(str(num))
    elif length>5:
        break

for i in range(1,70000000):
    num = math.floor(i*(5*i-3)/2)
    length = len(str(num))
    if(length==4):
        hepta.append(str(num))
    elif length>5:
        break

for i in range(1,70000000):
    num = math.floor(i*(3*i-2))
    length = len(str(num))
    if(length==4):
        octa.append(str(num))
    elif length>5:
        break

def recursive(array,lastnum,cnt,pastArray):
    for subA in allA:
        if subA in pastArray:
            continue
        for num in subA:
            if lastnum[2:] == num[:2]:
                if cnt == 5:
                    if num[2:] == array[0][:2]:
                        array.append(num)
                        total = 0
                        for i in array:
                            total += int(i)
                        print(array)
                        print(total)
                        array.pop()
                    return
                array.append(num)
                pastArray.append(subA)
                recursive(array,num,cnt+1,pastArray)
                array.pop()
                pastArray.pop()
for num in triple:
    recursive([num],num,1,[triple])

