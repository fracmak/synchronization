const { resolvePromise } = require('./common');

module.exports = class Lock {
  constructor() {
    this.queue = [];
  }
  lock() {
    const lock = resolvePromise();
    try {
      return Promise.all(this.queue);
    } finally {
      this.queue.push(lock);
    }
  }
  unlock() {
    this.queue.shift().resolve();
  }
};
