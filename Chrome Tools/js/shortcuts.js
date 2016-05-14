chrome.commands.onCommand.addListener(function(command) {
  window.open(chrome.extension.getURL("/html/schedule.html"));
});