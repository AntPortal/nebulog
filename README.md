# nebulog

A enhancement/wrapper around the wonderful Winston logger.

## Installation

### Installing npm (node package manager)
<pre>
  curl http://npmjs.org/install.sh | sh
</pre>

### Installing nebulog
<pre>
  [sudo] npm install nebulog
</pre>

## Motivation

[Winston](https://github.com/indexzero/winston) is a great logger, but there
were a few minor issues about it that I didn't like, or features I wish it had.
The enhancements over a vanilla implementation of Winston are:

* Outputting the filename of the file from which the logging message came from.
* Aligning the logging message by adding padding after the severity level.
* Use a more JSON-like syntax when printing the metadata object.
* Allow arbitrarily many metadata objects to be logged, rather than just one.

## Example usage:

### Basic Usage
<pre>
  var logger = require('nebulog').make({filename: __filename});

  logger.log('info', 'Logger is working');
  logger.info('This also works');
</pre>

### Setting minimum log level

<pre>
  var logger = require('nebulog').make({filename: __filename, level: 'warn'});

  logger.warn('This will be visible.');
  logger.info("But this won't");
</pre>

The log available log levels, from least serious to most serious, are:

['silly', 'verbose', 'info', 'warn', 'debug', 'error'];

### Logger per function

<pre>
  var loggerA = require('nebulog').make({filename: __filename + ':A'});
  var loggerB = require('nebulog').make({filename: __filename + ':B'});

  function A() {
    loggerA.info('This log message will be marked as coming from A');
  }

  function B() {
    loggerB.info('But this log message will be marked as coming from B');
  }
</pre>

