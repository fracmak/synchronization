const { resolvePromise, nextTick } = require('./common');

module.exports = class ReadWriteBarrier {
  constructor() {
    this._readers = [];
    this._writers = [];
  }
  read() {
    this._readers.push(true);
  }
  async releaseRead() {
    this._readers.shift();
    if (!this._readers.length) {
      // notify writers
      while (this._writers.length) {
        this._writers.shift().resolve();
        await nextTick(); // give the writer a chance to grab a lock before releasing the next writer
        if (this._readers.length) {
          break;
        }
      }
    }
  }
  async write() {
    if (this._readers.length) {
      const lock = resolvePromise();
      this._writers.push(lock);
      return lock;
    }
  }
};
