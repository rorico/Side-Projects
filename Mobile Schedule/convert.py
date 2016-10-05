file = open('schedule.html', 'r');
output = open('template.js', 'w');
output.write("var templateInfoPart1 = ")

def getFile(line,type):
	start = line.find(type) + len(type)
	end = line.find("\"",start)
	link = line[start:end]
	return link

def addFormatLine(line):
	output.write("'"+line.replace("\\","\\\\").replace("'","\\'").replace("\n","") + "\\n'+\n")

for line in file:
	if "<link" in line:
		link = getFile(line,"href=\"")
		linkFile = open(link, 'r');
		output.write("'<style>'+\n")
		for linkLine in linkFile:
			addFormatLine(linkLine)
		output.write("'</style>'+\n")
	elif "<script" in line:
		link = getFile(line,"src=\"")
		if link == "scheduleInfo.js":
			output.write("'<script>var scheduleInfo =';\nvar templateInfoPart2 = ';</script>\\n'+\n")
		else:
			linkFile = open(link, 'r');
			output.write("'<script>'+\n")
			for linkLine in linkFile:
				addFormatLine(linkLine)
			output.write("'</script>'+\n")
	else:
		addFormatLine(line)
output.write("'';")