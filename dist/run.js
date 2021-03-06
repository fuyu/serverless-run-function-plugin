'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = undefined;

var _path = require('path');
const fs = require("fs");

var _path2 = _interopRequireDefault(_path);

var _callback = require('./callback');

var _callback2 = _interopRequireDefault(_callback);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var run = exports.run = function run(serverless, options) {
  var requireFn = arguments.length <= 2 || arguments[2] === undefined ? require : arguments[2];
  var contextFn = arguments.length <= 3 || arguments[3] === undefined ? _context2.default : arguments[3];
  var callbackFn = arguments.length <= 4 || arguments[4] === undefined ? _callback2.default : arguments[4];
  var functionName = options.functionName;

  var functionObj = serverless.service.getFunction(functionName);
  // Temporarily use this plugin to set ENV vars in AWS Lambda environment:
  // https://github.com/silvermine/serverless-plugin-write-env-vars
  // But also make the variables defined in serverless.yml available during
  // local runs
  writeEnv(serverless);

  var filename = functionObj.handler.split('.')[0] + '.js';
  var servicePath = serverless.config.servicePath;

  var importedModule = requireFn(_path2.default.join(servicePath, filename));
  const method = functionObj.handler.split('.').pop();


  var event;
  if (functionObj.handler.indexOf('/') !== -1) {
    event = requireFn(_path2.default.join(servicePath, functionObj.handler.split('/')[0], 'event.json'));
  }
  else {
    event = requireFn(_path2.default.join(servicePath, 'event.json'));
  }

  importedModule[method](event, contextFn(functionName, serverless), callbackFn(serverless));
};


function writeEnv(serverless) {
  const filePath = _path.join(serverless.config.servicePath, '.env');
  const vars = serverless.service.custom.writeEnvVars;

  var str = "";
  for (var key in vars) {
    str += key + "=" + vars[key] + "\n";
  }

  fs.writeFileSync(filePath, str);
  serverless.cli.log('Wrote .env file to ' + filePath);
}
