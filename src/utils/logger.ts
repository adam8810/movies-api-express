// Note: Ran out of time to implement a better logging mechanism but this should
// be general enough to allow for a better logger implemented later like winston

const logger = {
  log: (...inputs: any[]) => {
    console.log(...inputs);
  },
  info: (...inputs: any[]) => {
    console.log(...inputs);
  },
  error: (...inputs: any[]) => {
    console.error(...inputs);
  },
  warn: (...inputs: any[]) => {
    console.warn(...inputs);
  },
};

export default logger;
