function resolvePromise() {
  let resolve;
  const lock = new Promise((r) => {
    resolve = r;
  });
  lock.resolve = resolve;
  return lock;
}

module.exports.resolvePromise = resolvePromise;
