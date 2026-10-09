/** Tiny structured logger — no external dependency, colourised in dev. */
const c = {
  reset: '\x1b[0m', gray: '\x1b[90m', red: '\x1b[31m',
  green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m',
};

function ts() { return new Date().toISOString(); }

const logger = {
  info: (...a) => console.log(`${c.gray}${ts()}${c.reset} ${c.cyan}INFO${c.reset}`, ...a),
  warn: (...a) => console.warn(`${c.gray}${ts()}${c.reset} ${c.yellow}WARN${c.reset}`, ...a),
  error: (...a) => console.error(`${c.gray}${ts()}${c.reset} ${c.red}ERROR${c.reset}`, ...a),
  success: (...a) => console.log(`${c.gray}${ts()}${c.reset} ${c.green}OK${c.reset}`, ...a),
};

module.exports = logger;
