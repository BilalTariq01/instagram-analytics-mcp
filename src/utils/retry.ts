/**
 * Shared retry utility with exponential backoff
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 2,
  baseDelayMs: 500,
  maxDelayMs: 10000,
};

/**
 * Execute an Axios request with retry logic for 5xx and 429 errors.
 * Respects Retry-After header when present.
 */
export async function requestWithRetry<T>(
  axiosInstance: AxiosInstance,
  config: AxiosRequestConfig,
  options?: RetryOptions,
  attempt = 0
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };

  try {
    const response = await axiosInstance.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const isRetryable = (status && status >= 500 && status < 600) || status === 429;

      if (isRetryable && attempt < opts.maxRetries) {
        const retryAfterHeader = error.response?.headers?.['retry-after'] as string | undefined;
        const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : undefined;
        const backoffBase = Math.pow(2, attempt) * opts.baseDelayMs;
        const jitter = Math.floor(Math.random() * 250);
        const delay = retryAfterSeconds
          ? Math.min(retryAfterSeconds * 1000, opts.maxDelayMs)
          : Math.min(backoffBase + jitter, opts.maxDelayMs);

        await new Promise<void>((resolve) => setTimeout(resolve, delay));
        return requestWithRetry<T>(axiosInstance, config, options, attempt + 1);
      }
    }
    throw error;
  }
}
