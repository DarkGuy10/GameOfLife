// Utility shenanigans

/**
 * Get random element from array
 * @param arr Array to pick from
 * @returns Random element
 */
export const randomFrom = <T>(arr: Array<T>) =>
  arr[Math.floor(Math.random() * arr.length)];

/**
 * Returns a promise that can be awaited to pause execution for a duration
 * @param ms Sleep duration in milliseconds
 * @returns Promise
 */
export const sleep = (ms: number) => {
  return new Promise((res) => setTimeout(res, ms));
};

/**
 * Return parsed integer if successful or undefined
 * @param str Target string
 * @returns parsed value
 */
export const tryParseInt = (str?: string) => {
  if (str && parseInt(str)) {
    return parseInt(str);
  }
};
