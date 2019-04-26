const { resolvePromise } = require('./common');

module.exports = class Latch {
  constructor(count) {
    this._count = count;
    this._lock = resolvePromise();
  }
  wait() {
    return this._lock;
  }
  countdown() {
    this._count--;
    if (!this._count) {
      this._lock.resolve();
    }
  }
};
