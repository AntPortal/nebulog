function basicDemo() {
	var logger = require('./nebulog.js').make({filename: __filename});

	logger.log('info', 'Logger is working');
	logger.info('This also works');
}
basicDemo();
console.log();

function logLevelsDemo() {
	var logger = require('./nebulog.js').make({filename: __filename, level: 'warn'});

	logger.warn('This will be visible.');
	logger.info("But this won't");
}
logLevelsDemo();
console.log();

function logPerFunctionDemo() {
	var loggerA = require('./nebulog.js').make({filename: __filename + 'A'});
	var loggerB = require('./nebulog.js').make({filename: __filename + 'B'});

	function A() {
		loggerA.error('This log message will be marked as coming from A');
	}

	function B() {
		loggerB.error('But this log message will be marked as coming from B');
	}

	A();
	B();
}
logPerFunctionDemo();
console.log();

function comparionBetweenWinstonAndNebulog() {
	var nebulog = require('./nebulog.js').make({filename: __filename, level: 'silly'});
	var Winston = require('winston');
	var winston = new (Winston.Logger)({transports: [new (Winston.transports.Console)({level: 'silly', colorize: true})]});
	
	nebulog.silly('nebulog silly');
	nebulog.verbose('nebulog verbose');
	nebulog.info('nebulog info');
	nebulog.warn('nebulog warn');
	nebulog.debug('nebulog debug');
	nebulog.error('nebulog error');
	
	winston.silly('winston silly');
	winston.verbose('winston verbose');
	winston.info('winston info');
	winston.warn('winston warn');
	winston.debug('winston debug');
	winston.error('winston error');
}
comparionBetweenWinstonAndNebulog();
