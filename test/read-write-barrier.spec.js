const { ReadWriteBarrier } = require('../src/');
const utils = require('./utils');

describe('ReadWriteBarrier', () => {
  it('should allow a write when no reads', async () => {
    const rwb = new ReadWriteBarrier();
    await rwb.write();
  });
  it('should block a write if a read is in progress', async () => {
    const rwb = new ReadWriteBarrier(2);
    const write = jest.fn();
    rwb.read();
    rwb.write().then(write);
    await utils.delay(100);
    expect(write).not.toHaveBeenCalled();
    rwb.releaseRead();
    await utils.delay(100);
    expect(write).toHaveBeenCalled();
  });
  it('should block a write if 2 reads are in progress and only 1 releases', async () => {
    const rwb = new ReadWriteBarrier(2);
    const write = jest.fn();
    rwb.read();
    rwb.read();
    rwb.write().then(write);
    await utils.delay(100);
    expect(write).not.toHaveBeenCalled();
    rwb.releaseRead();
    await utils.delay(100);
    expect(write).not.toHaveBeenCalled();
    rwb.releaseRead();
    await utils.delay(100);
    expect(write).toHaveBeenCalled();
  });
  it('should notify all writers if no reads are in progress', async () => {
    const rwb = new ReadWriteBarrier(2);
    const write1 = jest.fn();
    const write2 = jest.fn();
    rwb.read();
    rwb.write().then(write1);
    rwb.write().then(write2);
    await utils.delay(100);
    expect(write1).not.toHaveBeenCalled();
    expect(write2).not.toHaveBeenCalled();
    rwb.releaseRead();
    await utils.delay(100);
    expect(write1).toHaveBeenCalled();
    expect(write2).toHaveBeenCalled();
  });
});
