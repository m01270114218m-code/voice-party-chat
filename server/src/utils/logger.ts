const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
}

export const logger = {
  info: (msg: string, data?: any) => {
    console.log(`${colors.blue}[INFO]${colors.reset}`, msg, data || '')
  },
  error: (msg: string, error?: any) => {
    console.error(`${colors.red}[ERROR]${colors.reset}`, msg, error || '')
  },
  warn: (msg: string, data?: any) => {
    console.warn(`${colors.yellow}[WARN]${colors.reset}`, msg, data || '')
  },
  success: (msg: string, data?: any) => {
    console.log(`${colors.green}[SUCCESS]${colors.reset}`, msg, data || '')
  },
  debug: (msg: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors.magenta}[DEBUG]${colors.reset}`, msg, data || '')
    }
  },
}
