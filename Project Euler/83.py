#! python
import sys
import math

f = open('p083_matrix.txt','r')

lines = []
for line in f:
	lines.append(line.rstrip("\n").split(","))

data = []
for i in range(159):
	data.append([])
for i in range(len(lines)):
	for j in range(len(lines[i])):
		data[i+j].append(int(lines[i][j]))
print(data)
sys.exit()
currentLine = [0]*80
newLine = [0]*80
for i in range(len(data)):
	for j in range(len(data[i])):
		newLine[j] = data[i][j] + currentLine[j]
	ranges = sorted(range(len(newLine)), key=lambda k: newLine[k])
	print(ranges)
	check = True
	while(check):
		check = False
		for j in range(len(ranges)):
			index = ranges[j]
			if index!=0 and newLine[index-1] + data[i][index] < newLine[index]:
				newLine[index] = newLine[index-1] + data[i][index]
				check = True
			if index!=79 and newLine[index+1] + data[i][index] < newLine[index]:
				newLine[index] = newLine[index+1] + data[i][index]
				check = True

	currentLine = newLine
print(data[79])
print(currentLine)
print(min(currentLine))