/**
 * Type definitions for Instagram Graph API responses
 */
export interface InstagramConfig {
    accessToken: string;
    accountId?: string;
}
export interface AccountInsight {
    name: string;
    period: string;
    values: Array<{
        value: number;
        end_time: string;
    }>;
    title: string;
    description: string;
    id: string;
}
export interface MediaInsight {
    name: string;
    period: string;
    values: Array<{
        value: number;
    }>;
    title: string;
    description: string;
    id: string;
}
export interface MediaItem {
    id: string;
    caption?: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url?: string;
    permalink?: string;
    timestamp: string;
    like_count?: number;
    comments_count?: number;
}
export interface UserProfile {
    id: string;
    username: string;
    name?: string;
    profile_picture_url?: string;
    followers_count?: number;
    follows_count?: number;
    media_count?: number;
    biography?: string;
    website?: string;
}
export interface InsightsResponse {
    data: AccountInsight[] | MediaInsight[];
    paging?: {
        previous?: string;
        next?: string;
    };
}
export interface MediaResponse {
    data: MediaItem[];
    paging?: {
        cursors?: {
            before: string;
            after: string;
        };
        next?: string;
    };
}
export type AccountMetric = 'accounts_engaged' | 'comments' | 'engaged_audience_demographics' | 'follows_and_unfollows' | 'follower_demographics' | 'likes' | 'profile_links_taps' | 'reach' | 'replies' | 'saved' | 'shares' | 'total_interactions' | 'views';
export type BreakdownType = 'contact_button_type' | 'follow_type' | 'media_product_type';
export type MetricType = 'time_series' | 'total_value';
export type Timeframe = 'last_14_days' | 'last_30_days' | 'last_90_days' | 'prev_month' | 'this_month' | 'this_week';
export type DemographicBreakdown = 'age' | 'city' | 'country' | 'gender';
export type MediaMetric = 'comments' | 'follows' | 'likes' | 'reach' | 'saved' | 'shares' | 'total_interactions' | 'views' | 'profile_visits' | 'profile_activity' | 'navigation' | 'replies' | 'avg_time_watched' | 'total_time_watched';
export type Period = 'day' | 'week' | 'days_28' | 'lifetime';
//# sourceMappingURL=types.d.ts.map