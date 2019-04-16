
var AudioContext = window.AudioContext || window.webkitAudioContext;

if (!AudioContext.prototype.suspend) {
	AudioContext.prototype.suspend = function(){};
}

if (!AudioContext.prototype.resume) {
	AudioContext.prototype.resume = function(){};
}

if (!AudioContext.prototype.close) {
	AudioContext.prototype.close = function(){};
}

window.requestAnimationFrame = 
	window.requestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame;
