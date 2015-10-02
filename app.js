'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var clc = require('cli-color'),
	path = require('path'),
	stackTrace = require('stack-trace'),
	util = require('util');
var mapping = {
	log: clc.blue,
	warn: clc.yellow,
	error: clc.red,
	debug: clc.cyan
};

//Add date time to log command
['log', 'warn', 'error'].forEach(function(method) {
	var oldMethod = console[method].bind(console, mapping[method](new Date().toLocaleString().replace(/ \(.+\)/, '')));
	console[method] = function() {
		var args = [].slice.apply(arguments);
		for (var i in args) {
			if (typeof(args[i]) !== 'string') args[i] = util.inspect(args[i], true, 3);
		}
		oldMethod.apply(
			console, args
		);
	};
});

var spaces = function(sp) {
	var s = '';
	for (var z = 0; z < sp; z++) {
		s += ' ';
	}
	return s;
};
var maxTagLength = 60,
	maxFileName = 20,
	indentation = 2;

//Add debug to console
console.debug = function() {
	if (process.env.NODE_DEBUG === 'true') {
		var args = [].slice.apply(arguments);
		for (var i in args) {
			if (typeof(args[i]) !== 'string') args[i] = util.inspect(args[i], true, 3);
			if ((typeof(args[i]) === 'string') && (args[i].toLowerCase().indexOf('start') === 0)) args[i] = args[i].replace(/start/i, '>>> start');
			if ((typeof(args[i]) === 'string') && (args[i].toLowerCase().indexOf('end') === 0)) args[i] = args[i].replace(/end/i, '<<< end');
		}
		var frame = stackTrace.get()[1],
			method = frame.getFunctionName() || '',
			line = frame.getLineNumber(),
			file = path.basename(frame.getFileName()) + ':' + line;

		file = file + spaces(maxFileName - file.length);
		var date = new Date();
		var tmp = '[' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds();
		var strDate = tmp + spaces(24 - tmp.length) + ']';
		var tag = strDate + ' [' + file + ']',
			tab = spaces(maxTagLength - tag.length);

		return process.stdout.write(clc.cyan(tag) + tab + clc.yellow(args) + '\n');
	}
};


var server = require('./app/server');

server.start(function() {
	console.log('Server listening at port ' + server.port + ' on ' + process.env.NODE_ENV + ' environment');
});