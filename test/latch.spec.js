const { Latch } = require('../src/');
const utils = require('./utils');

describe('Latch', () => {
  it('should wait until countdown to resolve wait', async () => {
    const latch = new Latch(2);
    const thread2 = jest.fn();
    latch.wait().then(thread2);
    expect(thread2).not.toHaveBeenCalled();
    latch.countdown();
    await utils.delay(100);
    expect(thread2).not.toHaveBeenCalled();
    latch.countdown();
    await utils.delay(100);
    expect(thread2).toHaveBeenCalled();
  });
});
