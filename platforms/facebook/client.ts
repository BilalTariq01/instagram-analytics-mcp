import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  FacebookConfig,
  PageInsightsParams,
  PageInsightsResult,
  PostInsightsParams,
  ListPostsWithInsightsParams,
  PostsWithInsightsResponse,
  KnownMetricsResponse,
  ValidateTokenParams,
  ValidateTokenResult,
  InsightsResponse,
  NormalizedError,
  GraphApiError,
  FacebookApiError,
  KnownMetric,
  ListPagesResponse,
} from './types.js';

const GRAPH_API_BASE_URL = 'https://graph.facebook.com';
const DEFAULT_API_VERSION = 'v22.0';
const DEFAULT_POST_FIELDS = 'message,created_time,permalink_url';

const KNOWN_PAGE_METRICS: KnownMetric[] = [
  { name: 'page_impressions', periods: ['day', 'week', 'days_28'] },
  { name: 'page_impressions_unique', periods: ['day', 'week', 'days_28'] },
  { name: 'page_engaged_users', periods: ['day', 'week', 'days_28'] },
  { name: 'page_post_engagements', periods: ['day', 'week', 'days_28'] },
  { name: 'page_views_total', periods: ['day', 'week', 'days_28'] },
  { name: 'page_fans', periods: ['day', 'week', 'days_28', 'lifetime'] },
  { name: 'page_fan_adds_unique', periods: ['day', 'week', 'days_28', 'lifetime'], notes: 'Requires period when not lifetime' },
];

const KNOWN_POST_METRICS: KnownMetric[] = [
  { name: 'post_impressions', periods: ['day', 'week', 'days_28'] },
  { name: 'post_impressions_unique', periods: ['day', 'week', 'days_28'] },
  { name: 'post_engaged_users', periods: ['day', 'week', 'days_28'] },
];

export class FacebookClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly config: FacebookConfig;

  constructor(config: FacebookConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: GRAPH_API_BASE_URL,
    });
  }

  async getPageInsights(params: PageInsightsParams): Promise<PageInsightsResult> {
    const pageId = params.pageId || this.config.pageId;
    if (!pageId) {
      throw new FacebookApiError({ code: 'OAUTH', message: 'page_id is required', raw: null });
    }

    if (!params.metrics || params.metrics.length === 0) {
      throw new FacebookApiError({ code: 'VALIDATION', message: 'At least one metric is required', raw: null });
    }

    const apiVersion = this.resolveApiVersion(params.apiVersion);
    const accessToken = this.resolveAccessToken(params.accessToken);

    const query: Record<string, string> = {
      metric: params.metrics.join(','),
      access_token: accessToken,
    };

    if (params.period) {
      query.period = params.period;
    }
    if (params.since) {
      query.since = params.since;
    }
    if (params.until) {
      query.until = params.until;
    }
    if (typeof params.limit === 'number') {
      query.limit = String(params.limit);
    }
    if (params.after) {
      query.after = params.after;
    }
    if (params.before) {
      query.before = params.before;
    }

    const data = await this.requestWithRetry<InsightsResponse>({
      method: 'GET',
      url: this.buildPath(apiVersion, `${pageId}/insights`),
      params: query,
    });

    const warnings: string[] = [];
    if (!params.period) {
      warnings.push('No period provided. Some metrics may require a period parameter.');
    }

    const result: PageInsightsResult = {
      data: data.data,
      paging: data.paging,
    };

    if (warnings.length > 0) {
      result.warnings = warnings;
    }

    return result;
  }

  async getPostInsights(params: PostInsightsParams): Promise<InsightsResponse> {
    if (!params.postId) {
      throw new FacebookApiError({ code: 'VALIDATION', message: 'post_id is required', raw: null });
    }

    if (!params.metrics || params.metrics.length === 0) {
      throw new FacebookApiError({ code: 'VALIDATION', message: 'At least one metric is required', raw: null });
    }

    const apiVersion = this.resolveApiVersion(params.apiVersion);
    const accessToken = this.resolveAccessToken(params.accessToken);

    const query: Record<string, string> = {
      metric: params.metrics.join(','),
      access_token: accessToken,
    };

    if (params.period) {
      query.period = params.period;
    }

    return this.requestWithRetry<InsightsResponse>({
      method: 'GET',
      url: this.buildPath(apiVersion, `${params.postId}/insights`),
      params: query,
    });
  }

  async listPostsWithInsights(params: ListPostsWithInsightsParams): Promise<PostsWithInsightsResponse> {
    const pageId = params.pageId || this.config.pageId;
    if (!pageId) {
      throw new FacebookApiError({ code: 'VALIDATION', message: 'page_id is required', raw: null });
    }

    if (!params.postMetrics || params.postMetrics.length === 0) {
      throw new FacebookApiError({ code: 'VALIDATION', message: 'At least one post metric is required', raw: null });
    }

    const apiVersion = this.resolveApiVersion(params.apiVersion);
    const accessToken = this.resolveAccessToken(params.accessToken);

    const fields = `${DEFAULT_POST_FIELDS},insights.metric(${params.postMetrics.join(',')})`;

    const query: Record<string, string> = {
      fields,
      access_token: accessToken,
      limit: String(params.limit ?? 25),
    };

    if (params.after) {
      query.after = params.after;
    }
    if (params.before) {
      query.before = params.before;
    }

    return this.requestWithRetry<PostsWithInsightsResponse>({
      method: 'GET',
      url: this.buildPath(apiVersion, `${pageId}/posts`),
      params: query,
    });
  }

  async listPages(accessToken?: string): Promise<ListPagesResponse> {
    const token = this.resolveAccessToken(accessToken);
    const apiVersion = this.resolveApiVersion();

    const response = await this.requestWithRetry<ListPagesResponse>({
      method: 'GET',
      url: this.buildPath(apiVersion, 'me/accounts'),
      params: {
        access_token: token,
        fields: 'id,name,access_token,category,tasks',
      },
    });

    return response;
  }

  listKnownMetrics(): KnownMetricsResponse {
    return {
      page: KNOWN_PAGE_METRICS,
      post: KNOWN_POST_METRICS,
    };
  }

  async validateAccessToken(params: ValidateTokenParams): Promise<ValidateTokenResult> {
    if (!params.accessToken) {
      throw new FacebookApiError({ code: 'VALIDATION', message: 'access_token is required', raw: null });
    }

    const apiVersion = this.resolveApiVersion(params.apiVersion);

    try {
      const response = await this.requestWithRetry<{ id?: string; name?: string } & Record<string, unknown>>({
        method: 'GET',
        url: this.buildPath(apiVersion, 'me'),
        params: {
          access_token: params.accessToken,
          fields: params.fields?.join(',') || 'id,name',
        },
      });

      return {
        isValid: true,
        id: response.id as string | undefined,
        name: response.name as string | undefined,
        raw: response,
      };
    } catch (error) {
      if (error instanceof FacebookApiError) {
        return {
          isValid: false,
          raw: error.normalized.raw,
        };
      }

      throw error;
    }
  }

  private resolveApiVersion(version?: string) {
    return version || this.config.defaultApiVersion || DEFAULT_API_VERSION;
  }

  private resolveAccessToken(token?: string) {
    const resolved = token || this.config.accessToken;
    if (!resolved) {
      throw new FacebookApiError({ code: 'OAUTH', message: 'Facebook Page access token is required', raw: null });
    }
    return resolved;
  }

  private buildPath(version: string, path: string) {
    const cleanedPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${version}/${cleanedPath}`;
  }

  private async requestWithRetry<T>(config: AxiosRequestConfig, attempt = 0): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if ((status && status >= 500 && status < 600) || status === 429) {
          if (attempt < 2) {
            const retryAfterHeader = error.response?.headers?.['retry-after'] as string | undefined;
            const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : undefined;
            const backoffBase = Math.pow(2, attempt) * 500;
            const jitter = Math.floor(Math.random() * 250);
            const delay = retryAfterSeconds ? retryAfterSeconds * 1000 : backoffBase + jitter;
            await new Promise<void>((resolve) => setTimeout(resolve, delay));
            return this.requestWithRetry<T>(config, attempt + 1);
          }
        }
        throw this.wrapAxiosError(error as GraphApiError);
      }
      throw new FacebookApiError({ code: 'UNKNOWN', message: (error as Error)?.message || 'Unknown error', raw: error });
    }
  }

  private wrapAxiosError(error: GraphApiError) {
    const graphError = error.response?.data?.error;

    if (!graphError) {
      const normalized: NormalizedError = {
        code: 'NETWORK',
        message: error.message,
        raw: error.toJSON ? error.toJSON() : error,
      };
      return new FacebookApiError(normalized);
    }

    let code = 'GRAPH';
    let subcode: string | undefined;

    if (graphError.code === 190 || graphError.type === 'OAuthException') {
      code = 'OAUTH';
      subcode = graphError.error_subcode ? String(graphError.error_subcode) : 'TOKEN';
    } else if ([10, 200, 299].includes(graphError.code ?? 0)) {
      code = 'OAUTH';
      subcode = 'PERMISSION';
    } else if ([4, 17, 32, 613].includes(graphError.code ?? 0)) {
      code = 'RATE_LIMIT';
    } else if (graphError.code === 100) {
      code = 'VALIDATION';
    }

    const normalized: NormalizedError = {
      code,
      subcode,
      message: graphError.message,
      raw: error.response?.data,
    };

    return new FacebookApiError(normalized);
  }
}
