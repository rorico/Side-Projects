file = open('schedule.html', 'r');
output = open('template.js', 'w');
output.write("var templateInfoPart1 = ")
for line in file:
	if line.startswith("    var scheduleInfo"):
		output.write("'    var scheduleInfo =';\nvar templateInfoPart2 = ';\\n'+\n")
	else:
		output.write("'"+line.replace("\\","\\\\").replace("'","\\'").replace("\n","\\n'+\n"))
output.write("'';")