type Level = 'debug' | 'info' | 'warn' | 'error'

/** Thin logging shim. Swap the sink for a real transport in production. */
function emit(level: Level, message: string, meta?: unknown): void {
  const method = level === 'debug' ? 'log' : level
  if (meta === undefined) {
    console[method](`[${level}]`, message)
  } else {
    console[method](`[${level}]`, message, meta)
  }
}

export const logger = {
  debug: (message: string, meta?: unknown) => emit('debug', message, meta),
  info: (message: string, meta?: unknown) => emit('info', message, meta),
  warn: (message: string, meta?: unknown) => emit('warn', message, meta),
  error: (message: string, meta?: unknown) => emit('error', message, meta),
}
