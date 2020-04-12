'use strict';

(function (Type) {
    Type[Type["SYNC"] = 0] = "SYNC";
    Type[Type["ASYNC"] = 1] = "ASYNC";
})(exports.Type || (exports.Type = {}));
class Async {
    /* istanbul ignore next */
    type() {
        /* istanbul ignore next */
        return exports.Type.ASYNC;
    }
}
class Sync {
    type() {
        return exports.Type.SYNC;
    }
    /**
     * Connect.
     */
    connect() {
        return;
    }
}

exports.Async = Async;
exports.Sync = Sync;
