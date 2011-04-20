function basicDemo() {
	var logger = require('./nebulog.js').make(__filename);

	logger.log('info', 'Logger is working');
	logger.info('This also works');
}
basicDemo();

function logLevelsDemo() {
	var logger = require('./nebulog.js').make(__filename, 'warn');

	logger.warn('This will be visible.');
	logger.info("But this won't");
}
logLevelsDemo();

function logPerFunctionDemo() {
	var loggerA = require('./nebulog.js').make(__filename + ':A');
	var loggerB = require('./nebulog.js').make(__filename + ':B');

	function A() {
		loggerA.debug('This log message will be marked as coming from A');
	}

	function B() {
		loggerB.error('But this log message will be marked as coming from B');
	}

	A();
	B();
}
logPerFunctionDemo();
