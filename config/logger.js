const appRoot = require('app-root-path');
var path = require('path');
var PROJECT_ROOT = path.join(__dirname, '..');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, file, line, timestamp }) => {
  return `[${timestamp}][${level}] ${message}`;
});


var options = {
        // file: {
        //         level: 'info',
        //         filename: `${appRoot}/logs/app.log`,
        //         handleExceptions: true,
        //         json: true,
        //         maxsize: 5242880, // 5MB
        //         maxFiles: 5,
        //         colorize: false,
        // },
        console: {
                format: combine(
                        timestamp(),
                        myFormat
                      ),
                level: 'info',
                handleExceptions: true,
                json: false,
                colorize: true,
        },
};

var logger =  createLogger({
        transports: [
          new transports.Console(options.console)
        ],
        exitOnError: false,
});

logger.stream = {
        write: function(message, encoding) {
          // use the 'info' log level so the output will be picked up by both transports (file and console)
          logger.info(message);
        },
};



module.exports.debug = module.exports.log = function () {
        logger.debug.apply(logger, formatLogArguments(arguments))
};
      
module.exports.info = function () {
        logger.info.apply(logger, formatLogArguments(arguments))
};
      
module.exports.warn = function () {
        logger.warn.apply(logger, formatLogArguments(arguments))
};
      
module.exports.error = function () {
        logger.error.apply(logger, formatLogArguments(arguments))
};
      
module.exports.stream = logger.stream;

const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };
      
      
      
      /**
       * Attempts to add file and line number info to the given log arguments.
       */
function formatLogArguments (args) {
        args = Array.prototype.slice.call(args)
      
        var stackInfo = getStackInfo(1);
      
        if (stackInfo) {
          // get file path relative to project root
          var calleeStr = '[' + stackInfo.relativePath + ':' + stackInfo.line + ']: '
      
          if (typeof (args[0]) === 'string') {
            args[0] = calleeStr + ' ' + args[0];
          } else {
            args[0] = calleeStr + ' ' + JSON.stringify(args[0], getCircularReplacer());;
          }
        }
      
        return args
}
      
      /**
       * Parses and returns info about the call stack at the given index.
       */
function getStackInfo (stackIndex) {
        // get call stack, and analyze it
        // get all file, method, and line numbers
        var stacklist = (new Error()).stack.split('\n').slice(3)
      
        // stack trace format:
        // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
        // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
        var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
        var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi
      
        var s = stacklist[stackIndex] || stacklist[0]
        var sp = stackReg.exec(s) || stackReg2.exec(s)
      
        if (sp && sp.length === 5) {
          return {
            method: sp[1],
            relativePath: path.relative(PROJECT_ROOT, sp[2]),
            line: sp[3],
            pos: sp[4],
            file: path.basename(sp[2]),
            stack: stacklist.join('\n')
          }
        }
}