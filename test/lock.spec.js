const { Lock } = require('../src/');
const utils = require('./utils');

describe('Lock', () => {
  it('should not lock on first function', async () => {
    const lock = new Lock();
    await lock.lock();
    expect(true).toEqual(true);
  });
  it('should hold second thread until first has unlocked', async () => {
    const lock = new Lock();
    const thread2 = jest.fn();
    await lock.lock();
    lock.lock().then(thread2);
    await utils.delay(100);
    expect(thread2).not.toHaveBeenCalled();
    lock.unlock();
    await utils.delay(100);
    expect(thread2).toHaveBeenCalled();
  });
  it('should hold third thread until second has unlocked', async () => {
    const lock = new Lock();
    const thread2 = jest.fn();
    const thread3 = jest.fn();
    await lock.lock();
    lock.lock().then(thread2);
    lock.lock().then(thread3);
    await utils.delay(100);
    expect(thread2).not.toHaveBeenCalled();
    expect(thread3).not.toHaveBeenCalled();
    lock.unlock();
    await utils.delay(100);
    expect(thread2).toHaveBeenCalled();
    expect(thread3).not.toHaveBeenCalled();
    lock.unlock();
    await utils.delay(100);
    expect(thread3).toHaveBeenCalled();
  });
});
