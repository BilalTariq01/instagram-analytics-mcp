/**
 * Instagram Graph API Client
 * Handles all API requests to Instagram Graph API
 */
import { InstagramConfig, AccountInsight, MediaInsight, MediaItem, UserProfile, AccountMetric, MediaMetric, Period, MetricType, BreakdownType, Timeframe, DemographicBreakdown } from './types.js';
export declare class InstagramClient {
    private axios;
    private accessToken;
    private accountId?;
    constructor(config: InstagramConfig);
    /**
     * Get all available Instagram Business Accounts
     */
    getAvailableAccounts(): Promise<Array<{
        id: string;
        username: string;
        name: string;
        pageId: string;
        pageName: string;
    }>>;
    /**
     * Get the Instagram Business Account ID
     * If multiple accounts are available, returns info for user to select
     */
    getAccountId(): Promise<string>;
    /**
     * Get user profile information
     */
    getUserProfile(accountId?: string): Promise<UserProfile>;
    /**
     * Get account insights with full API v23.0 support
     */
    getAccountInsights(metrics: AccountMetric[], period: Period, options?: {
        since?: number;
        until?: number;
        accountId?: string;
        metricType?: MetricType;
        breakdown?: BreakdownType | DemographicBreakdown;
        timeframe?: Timeframe;
    }): Promise<AccountInsight[]>;
    /**
     * Get media list
     */
    getMedia(limit?: number, accountId?: string): Promise<MediaItem[]>;
    /**
     * Get insights for a specific media item
     */
    getMediaInsights(mediaId: string, metrics: MediaMetric[], period?: Period): Promise<MediaInsight[]>;
    /**
     * Get a specific media item details
     */
    getMediaById(mediaId: string): Promise<MediaItem>;
}
//# sourceMappingURL=client.d.ts.map