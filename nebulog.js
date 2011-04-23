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


const config_JSON_Schema = {
	'description': 'Configuration settings for nebulog',
	'type': 'object',
	'properties': {
		'filename': {
			'description': 'set to __filename to allow nebulog to insert the source filename each message comes from.',
			'type': 'string',
			'required': false
		},
		'transports': {
			'description': 'The different Winston transports to log to',
			'type': 'array',
			'required': false,
			'items': {
				'description': 'A description of one particular transport',
				'type': 'object',
				'properties': {
					'name': {
						'description': 'the name of the Winston transport to use.',
						'type': 'string',
						'required': true,
						'enum': ['Console', 'File', 'Loggly']
					},
					'config': {
						'description': 'The configuration settings to pass onto the Winston transport.',
						'type': 'object',
					}
				}
			}
		},
		'level': {
			'description': 'If no transport is provided, then a default Console transport will be provided, with this level.',
			'type': 'string',
			'required': 'false'
		}
	}
}

function computeFormattedShortFilename(filename) {
	if (filename) {
		var shortFileName;
		var lastSlash = filename.lastIndexOf('/');
		if (lastSlash >= 0) {
			shortFileName = filename.substring(lastSlash + 1);
		} else {
			shortFileName = filename;
		}
		return '[' + shortFileName + ']';
	} else {
		return '';
	}
}


exports.make = function(config) {
	var formattedShortFilename = computeFormattedShortFilename(config.filename);
	if (!config.transports) {
		config.transports = [{name:'Console', config: {colorize: true, level: config.level || 'verbose'}}];
	}
	var transports = [];
	config.transports.forEach(function(transport) {
		transports.push(new winston.transports[transport.name](transport.config));
	});
	var winstonLogger = new (winston.Logger)({transports: transports});
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
