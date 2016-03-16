chrome.commands.onCommand.addListener(function(command) {
  window.open(chrome.extension.getURL("/SchedulePage/Schedule.html"));
});