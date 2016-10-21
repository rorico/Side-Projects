var allLogs = [];

//for logging information, and display to console. Only takes in 1 argument
function log(arg) {
	//should only contain strings
	allLogs.push(JSON.stringify(arg));
	console.log(arg);
}

window.onerror = function(message, source, lineno, colno, error){
	allLogs.push(message);
};