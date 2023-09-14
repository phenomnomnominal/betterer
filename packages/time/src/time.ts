/**
 * @internal This could change at any point! Please don't use!
 */
export function getPreciseTime__(): number {
  return performance.now();
}

/**
 * @internal This could change at any point! Please don't use!
 */
export function getTime__(): number {
  return Date.now();
}
