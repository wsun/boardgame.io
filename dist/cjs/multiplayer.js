'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./reducer-2ab02669.js');
require('redux');
require('immer');
require('./initialize-2552b9df.js');
require('./base-bdd9c13b.js');
var socketio = require('./socketio-b202b6fb.js');
require('./master-a58a6d14.js');
require('socket.io-client');



exports.Local = socketio.Local;
exports.SocketIO = socketio.SocketIO;
