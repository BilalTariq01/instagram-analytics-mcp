/**
 * Instagram Graph API Client
 * Handles all API requests to Instagram Graph API
 */

import axios, { AxiosInstance } from 'axios';
import {
  InstagramConfig,
  AccountInsight,
  MediaInsight,
  MediaItem,
  UserProfile,
  InsightsResponse,
  MediaResponse,
  AccountMetric,
  MediaMetric,
  Period,
  MetricType,
  BreakdownType,
  Timeframe,
  DemographicBreakdown,
} from './types.js';

const GRAPH_API_BASE_URL = 'https://graph.facebook.com/v20.0';

export class InstagramClient {
  private axios: AxiosInstance;
  private accessToken: string;
  private accountId?: string;

  constructor(config: InstagramConfig) {
    this.accessToken = config.accessToken;
    this.accountId = config.accountId;

    this.axios = axios.create({
      baseURL: GRAPH_API_BASE_URL,
      params: {
        access_token: this.accessToken,
      },
    });
  }

  /**
   * Get all available Instagram Business Accounts
   */
  async getAvailableAccounts(): Promise<Array<{ id: string; username: string; name: string; pageId: string; pageName: string }>> {
    try {
      // Get user's pages
      const response = await this.axios.get('/me/accounts');
      const pages = response.data.data;

      if (!pages || pages.length === 0) {
        throw new Error('No Facebook pages found. Please connect a Facebook page to your Instagram Business account.');
      }

      // Get Instagram accounts for all pages
      const accounts = [];
      for (const page of pages) {
        try {
          const igResponse = await this.axios.get(`/${page.id}`, {
            params: {
              fields: 'instagram_business_account{id,username,name}',
              access_token: this.accessToken,
            },
          });

          if (igResponse.data.instagram_business_account) {
            accounts.push({
              id: igResponse.data.instagram_business_account.id,
              username: igResponse.data.instagram_business_account.username || 'Unknown',
              name: igResponse.data.instagram_business_account.name || 'Unknown',
              pageId: page.id,
              pageName: page.name,
            });
          }
        } catch (error) {
          // Skip pages without Instagram accounts
          continue;
        }
      }

      if (accounts.length === 0) {
        throw new Error('No Instagram Business accounts found. Please ensure at least one Instagram account is connected to your Facebook pages.');
      }

      return accounts;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get available accounts: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get the Instagram Business Account ID
   * If multiple accounts are available, returns info for user to select
   */
  async getAccountId(): Promise<string> {
    if (this.accountId) {
      return this.accountId;
    }

    try {
      const accounts = await this.getAvailableAccounts();

      // If only one account, use it automatically
      if (accounts.length === 1) {
        this.accountId = accounts[0].id;
        console.error(`Using Instagram account: @${accounts[0].username}`);
        
        if (!this.accountId) {
          throw new Error('Failed to retrieve Instagram account ID');
        }
        
        return this.accountId;
      }

      // Multiple accounts found - throw error with account list for user to choose
      const accountList = accounts.map((acc, idx) => 
        `${idx + 1}. @${acc.username} (${acc.name}) - ID: ${acc.id}`
      ).join('\n');

      throw new Error(
        `Multiple Instagram accounts found. Please specify which account to use by adding the account_id parameter:\n\n${accountList}\n\nExample:\n{\n  "account_id": "${accounts[0].id}"\n}\n\nOr use list_available_accounts to see all accounts.`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get account ID: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(accountId?: string): Promise<UserProfile> {
    try {
      const targetAccountId = accountId || await this.getAccountId();

      const response = await this.axios.get(`/${targetAccountId}`, {
        params: {
          fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography,website',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data?.error;
        const errorDetails = {
          message: apiError?.message || error.message,
          type: apiError?.type || 'APIError',
          code: apiError?.code || error.response?.status,
          fbtrace_id: apiError?.fbtrace_id,
        };
        throw new Error(`Failed to get user profile: ${errorDetails.message}${errorDetails.code ? ` (Code: ${errorDetails.code})` : ''}${errorDetails.fbtrace_id ? ` [Trace: ${errorDetails.fbtrace_id}]` : ''}`);
      }
      throw error;
    }
  }

  /**
   * Get account insights with full API v23.0 support
   */
  async getAccountInsights(
    metrics: AccountMetric[],
    period: Period,
    options?: {
      since?: number;
      until?: number;
      accountId?: string;
      metricType?: MetricType;
      breakdown?: BreakdownType | DemographicBreakdown;
      timeframe?: Timeframe;
    }
  ): Promise<AccountInsight[]> {
    try {
      const targetAccountId = options?.accountId || await this.getAccountId();

      const params: any = {
        metric: metrics.join(','),
        period,
      };

      // Add metric_type if specified
      if (options?.metricType) {
        params.metric_type = options.metricType;
      }

      // Add breakdown if specified
      if (options?.breakdown) {
        params.breakdown = options.breakdown;
      }

      // Add timeframe for demographic metrics
      if (options?.timeframe) {
        params.timeframe = options.timeframe;
      }

      // Add time range
      if (options?.since) params.since = options.since;
      if (options?.until) params.until = options.until;

      const response = await this.axios.get<InsightsResponse>(`/${targetAccountId}/insights`, { params });

      return response.data.data as AccountInsight[];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data?.error;
        const errorDetails = {
          message: apiError?.message || error.message,
          type: apiError?.type || 'APIError',
          code: apiError?.code || error.response?.status,
          fbtrace_id: apiError?.fbtrace_id,
        };
        throw new Error(`Failed to get account insights: ${errorDetails.message}${errorDetails.code ? ` (Code: ${errorDetails.code})` : ''}${errorDetails.fbtrace_id ? ` [Trace: ${errorDetails.fbtrace_id}]` : ''}`);
      }
      throw error;
    }
  }

  /**
   * Get media list
   */
  async getMedia(limit: number = 25, accountId?: string): Promise<MediaItem[]> {
    try {
      const targetAccountId = accountId || await this.getAccountId();

      const response = await this.axios.get<MediaResponse>(`/${targetAccountId}/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
          limit,
        },
      });

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data?.error;
        const errorDetails = {
          message: apiError?.message || error.message,
          type: apiError?.type || 'APIError',
          code: apiError?.code || error.response?.status,
          fbtrace_id: apiError?.fbtrace_id,
        };
        throw new Error(`Failed to get media: ${errorDetails.message}${errorDetails.code ? ` (Code: ${errorDetails.code})` : ''}${errorDetails.fbtrace_id ? ` [Trace: ${errorDetails.fbtrace_id}]` : ''}`);
      }
      throw error;
    }
  }

  /**
   * Get insights for a specific media item
   */
  async getMediaInsights(mediaId: string, metrics: MediaMetric[], period: Period = 'lifetime'): Promise<MediaInsight[]> {
    try {
      const response = await this.axios.get<InsightsResponse>(`/${mediaId}/insights`, {
        params: {
          metric: metrics.join(','),
          period,
        },
      });

      return response.data.data as MediaInsight[];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data?.error;
        const errorDetails = {
          message: apiError?.message || error.message,
          type: apiError?.type || 'APIError',
          code: apiError?.code || error.response?.status,
          fbtrace_id: apiError?.fbtrace_id,
        };
        throw new Error(`Failed to get media insights: ${errorDetails.message}${errorDetails.code ? ` (Code: ${errorDetails.code})` : ''}${errorDetails.fbtrace_id ? ` [Trace: ${errorDetails.fbtrace_id}]` : ''}`);
      }
      throw error;
    }
  }

  /**
   * Get a specific media item details
   */
  async getMediaById(mediaId: string): Promise<MediaItem> {
    try {
      const response = await this.axios.get(`/${mediaId}`, {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data?.error;
        const errorDetails = {
          message: apiError?.message || error.message,
          type: apiError?.type || 'APIError',
          code: apiError?.code || error.response?.status,
          fbtrace_id: apiError?.fbtrace_id,
        };
        throw new Error(`Failed to get media details: ${errorDetails.message}${errorDetails.code ? ` (Code: ${errorDetails.code})` : ''}${errorDetails.fbtrace_id ? ` [Trace: ${errorDetails.fbtrace_id}]` : ''}`);
      }
      throw error;
    }
  }
}
