const { resolvePromise } = require('./common');

module.exports = class Semaphore {
  constructor(permits) {
    this._permits = permits;
    this._workers = [];
    this._queue = [];
  }
  acquire() {
    const lock = resolvePromise();
    if (this._workers.length < this._permits) {
      this._workers.push(lock);
    } else {
      this._queue.push(lock);
      return lock;
    }
  }
  release() {
    this._workers.shift().resolve();
    if (this._queue.length) {
      const lock = resolvePromise();
      this._workers.push(lock);
      this._queue.shift().resolve();
    }
  }
};
