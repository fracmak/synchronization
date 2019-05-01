function resolvePromise() {
  let resolve;
  const lock = new Promise((r) => {
    resolve = r;
  });
  lock.resolve = resolve;
  return lock;
}

async function nextTick() {
  await Promise.resolve();
}

module.exports.resolvePromise = resolvePromise;
module.exports.nextTick = nextTick;
