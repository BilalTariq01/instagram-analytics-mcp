/**
 * Unified error types for Social Analytics MCP Server
 */

export class SocialAnalyticsError extends Error {
  public readonly platform: string;
  public readonly code: string;

  constructor(message: string, platform: string, code: string) {
    super(message);
    this.name = 'SocialAnalyticsError';
    this.platform = platform;
    this.code = code;
  }
}

export class InstagramApiError extends SocialAnalyticsError {
  public readonly apiCode?: number;
  public readonly apiType?: string;
  public readonly fbtrace_id?: string;

  constructor(opts: {
    message: string;
    code?: number;
    type?: string;
    fbtrace_id?: string;
  }) {
    const parts = [opts.message];
    if (opts.code) parts.push(`(Code: ${opts.code})`);
    if (opts.fbtrace_id) parts.push(`[Trace: ${opts.fbtrace_id}]`);

    super(parts.join(' '), 'instagram', opts.type || 'APIError');
    this.name = 'InstagramApiError';
    this.apiCode = opts.code;
    this.apiType = opts.type;
    this.fbtrace_id = opts.fbtrace_id;
  }
}

export interface NormalizedError {
  code: string;
  subcode?: string;
  message: string;
  raw?: unknown;
}

export class FacebookApiError extends Error {
  normalized: NormalizedError;

  constructor(normalized: NormalizedError) {
    super(normalized.message);
    this.name = 'FacebookApiError';
    this.normalized = normalized;
  }
}
