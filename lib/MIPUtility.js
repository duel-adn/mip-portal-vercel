export function mipConcatenate(...args) {
  return args.filter(c => c !== undefined)
    .join(' ').trim()
}

export function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}