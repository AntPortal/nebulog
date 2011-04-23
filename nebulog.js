/**
 * log4j style Logger.
 *
 * Mostly delegates to Winston, but we do a few extra things like log the
 * originating filename.
 */
 
var winston = require('winston');
var util = require('util');
var logLevels = ['silly', 'verbose', 'info', 'warn', 'debug', 'error'];
var maxLogLevelLength = 0;
for (var i = 0; i < logLevels.length; ++i) {
	if (logLevels[i].length > maxLogLevelLength) {
		maxLogLevelLength = logLevels[i].length;
	}
}

function makeLoggingFunction(level) {
	return function(msg, optionalArgs) {
		var args = [level];
		for (var i = 0; i < arguments.length; ++i) {
			args.push(arguments[i]);
		}
		this.log.apply(this, args);
	}
}

function getPadding(len) {
	if (len < 1) {
		return '';
	}
	return ' ' + getPadding(len - 1);
}

exports.make = function(config) {
	var formattedShortFilename = shortFileName ? '[' + shortFileName + '] ' : '';
	if (config.filename) {
		var lastSlash = config.filename.lastIndexOf('/');
		var shortFileName = config.filename.substring();
		if (lastSlash >= 0) {
			shortFileName = config.filename.substring(lastSlash + 1);
		} else {
			shortFileName = config.filename;
		}
		formattedShortFilename = '[' + shortFileName + ']';
	} else {
		formattedShortFilename = '';
	}
	config.colorize = (typeof config.colorize === 'undefined') ? true : config.colorize;
	config.transport = config.transport || winston.transports.Console;
	var minLogLevel = config.level || 'verbose';
	var winstonLogger = new (winston.Logger)({transports: [new (config.transport)(config)]});
	var retVal = {
		log: function(level, msg, optionalArgs) {
			var finalMessage = [getPadding(maxLogLevelLength - level.length), formattedShortFilename, msg];
			for (var i = 2; i < arguments.length; ++i) { //Start at 2 to skip level and msg
				finalMessage.push(util.inspect(arguments[i]));
			}
			winstonLogger.log(level, finalMessage.join(''));
		}
	};
	for(key in logLevels) {
		retVal[logLevels[key]] = makeLoggingFunction(logLevels[key]);
	}
	return retVal;
}
