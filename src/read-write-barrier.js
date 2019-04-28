const { resolvePromise } = require('./common');

module.exports = class ReadWriteBarrier {
  constructor() {
    this._readers = [];
    this._writers = [];
  }
  read() {
    this._readers.push(true);
  }
  releaseRead() {
    this._readers.shift();
    if (!this._readers.length) {
      // notify writers
      this._writers.forEach(writer => writer.resolve());
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
