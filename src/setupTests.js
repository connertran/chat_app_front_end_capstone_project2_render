global.setImmediate = (callback, ...args) => {
  return setTimeout(callback, 0, ...args);
};
global.clearImmediate = (immediateId) => {
  return clearTimeout(immediateId);
};
