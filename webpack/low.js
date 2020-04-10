
if (!window.WeakSet) {
	window.WeakSet = function() {this.m_set = {}}
	window.WeakSet.prototype = {
		has(name) {return name in this.m_set},
		add(name) {this.m_set[name]=1},
		delete(name) {delete this.m_set[name]},
		clear() {this.m_set = {}}
	};
}

if (!Object.values) {
	Object.values = function(o) {
		var r = [];
		for (var i in o) {
			r.push(o[i]);
		}
		return r;
	};
	Object.keys = function(o) {
		var r = [];
		for (var i in o) {
			r.push(i);
		}
		return r;
	};
	Object.assign = function(o) {
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0; i < args.length; i++) {
			var arg = args[i];
			for (var j in arg) {
				o[j] = arg[j];
			}
		}
		return o;
	};
}

var AudioContext = window.AudioContext || window.webkitAudioContext;

if (AudioContext) {

	if (!AudioContext.prototype.suspend) {
		AudioContext.prototype.suspend = function(){};
	}

	if (!AudioContext.prototype.resume) {
		AudioContext.prototype.resume = function(){};
	}

	if (!AudioContext.prototype.close) {
		AudioContext.prototype.close = function(){};
	}
}

window.requestAnimationFrame = 
	window.requestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame;