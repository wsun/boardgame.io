'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./reducer-2ab02669.js');
require('redux');
require('immer');
require('./initialize-2552b9df.js');
require('./base-bdd9c13b.js');
var socketio = require('./socketio-0f1f0296.js');
require('./master-a92e41c9.js');
require('socket.io-client');



exports.Local = socketio.Local;
exports.SocketIO = socketio.SocketIO;
