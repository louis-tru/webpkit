
if (!window.WeakSet) {
	window.WeakSet = function() {this.m_set = {}}
	window.WeakSet.prototype = {
		has() {return false},
		add() {},
		delete() {}
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
