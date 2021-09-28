export function mipConcatenate(...args) {
  return args.filter(c => c !== undefined)
    .join(' ').trim()
}