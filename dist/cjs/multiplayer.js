'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./reducer-2ab02669.js');
require('redux');
require('immer');
require('./initialize-2552b9df.js');
require('./base-bdd9c13b.js');
var socketio = require('./socketio-8698d79e.js');
require('./master-7a9a4de2.js');
require('socket.io-client');



exports.Local = socketio.Local;
exports.SocketIO = socketio.SocketIO;
