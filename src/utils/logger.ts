/**
 * Structured stderr logger for MCP servers
 * MCP servers must not write to stdout (reserved for protocol messages)
 */

const DEBUG_ENABLED = process.env.DEBUG?.includes('social-analytics-mcp') ?? false;

function timestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  info(message: string, data?: Record<string, unknown>): void {
    const entry = data
      ? `[${timestamp()}] INFO: ${message} ${JSON.stringify(data)}`
      : `[${timestamp()}] INFO: ${message}`;
    console.error(entry);
  },

  warn(message: string, data?: Record<string, unknown>): void {
    const entry = data
      ? `[${timestamp()}] WARN: ${message} ${JSON.stringify(data)}`
      : `[${timestamp()}] WARN: ${message}`;
    console.error(entry);
  },

  error(message: string, error?: unknown): void {
    const errorDetail = error instanceof Error ? error.message : String(error ?? '');
    const entry = errorDetail
      ? `[${timestamp()}] ERROR: ${message} - ${errorDetail}`
      : `[${timestamp()}] ERROR: ${message}`;
    console.error(entry);
  },

  debug(message: string, data?: Record<string, unknown>): void {
    if (!DEBUG_ENABLED) return;
    const entry = data
      ? `[${timestamp()}] DEBUG: ${message} ${JSON.stringify(data)}`
      : `[${timestamp()}] DEBUG: ${message}`;
    console.error(entry);
  },
};
