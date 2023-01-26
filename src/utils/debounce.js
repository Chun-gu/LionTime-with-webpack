export function promisedDebounce(func, timeout) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(func.apply(this, args)), timeout);
    });
  };
}
