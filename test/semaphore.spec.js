const { Semaphore } = require('../src/');
const utils = require('./utils');

describe('Semaphore', () => {
  it('should always run one acquire at a time if the permits is 2', async () => {
    const semaphore = new Semaphore(2);
    await semaphore.acquire();
    semaphore.release();
    await utils.delay(100);
    await semaphore.acquire();
    semaphore.release();
    await utils.delay(100);
    await semaphore.acquire();
    semaphore.release();
    await utils.delay(100);
  });
  it('should block a 3rd thread and wait until a thread finishes when permits is 2', async () => {
    const semaphore = new Semaphore(2);
    const thread3 = jest.fn();
    await semaphore.acquire();
    await semaphore.acquire();
    semaphore.acquire().then(thread3);
    await utils.delay(100);
    expect(thread3).not.toHaveBeenCalled();
    semaphore.release();
    await utils.delay(100);
    expect(thread3).toHaveBeenCalled();
  });
  it('should only run 3rd thread after 2 releases when permits is 2', async () => {
    const semaphore = new Semaphore(2);
    const thread3 = jest.fn();
    const thread4 = jest.fn();
    await semaphore.acquire();
    await semaphore.acquire();
    semaphore.acquire().then(thread3);
    semaphore.acquire().then(thread4);
    await utils.delay(100);
    expect(thread3).not.toHaveBeenCalled();
    expect(thread4).not.toHaveBeenCalled();
    semaphore.release();
    await utils.delay(100);
    expect(thread3).toHaveBeenCalled();
    expect(thread4).not.toHaveBeenCalled();
  });
});
