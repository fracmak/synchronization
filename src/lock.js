const { resolvePromise } = require('./common');

module.exports = class Lock {
  constructor() {
    this._queue = [];
  }
  lock() {
    const lock = resolvePromise();
    try {
      return Promise.all(this._queue);
    } finally {
      this._queue.push(lock);
    }
  }
  unlock() {
    this._queue.shift().resolve();
  }
};
