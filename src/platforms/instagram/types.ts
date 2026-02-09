/**
 * Type definitions for Instagram Graph API responses
 */

export interface InstagramConfig {
  accessToken: string;
  accountId?: string;
  apiVersion?: string;
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
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'REELS';
  media_url?: string;
  permalink?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  media_product_type?: string;
  thumbnail_url?: string;
}

export interface StoryItem {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO';
  media_url?: string;
  permalink?: string;
  timestamp: string;
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

export interface StoryResponse {
  data: StoryItem[];
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export interface HashtagSearchResponse {
  data: Array<{ id: string }>;
}

export interface HashtagMediaResponse {
  data: MediaItem[];
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export interface ContentPublishingLimitResponse {
  config: {
    quota_total: number;
    quota_duration: number;
  };
  quota_usage: number;
}

export interface MentionedMediaResponse {
  mentioned_media: {
    data: MediaItem[];
  };
}

// Metric types for account insights
// Based on Instagram Graph API v23.0 official documentation
export type AccountMetric =
  // Interaction Metrics
  | 'accounts_engaged'
  | 'comments'
  | 'engaged_audience_demographics'
  | 'follows_and_unfollows'
  | 'follower_demographics'
  | 'likes'
  | 'profile_links_taps'
  | 'reach'
  | 'replies'
  | 'saved'
  | 'shares'
  | 'total_interactions'
  | 'views';

// Breakdown types for account insights
export type BreakdownType =
  | 'contact_button_type'
  | 'follow_type'
  | 'media_product_type';

// Metric type for aggregation
export type MetricType = 'time_series' | 'total_value';

// Timeframe for demographic metrics
export type Timeframe =
  | 'last_14_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'prev_month'
  | 'this_month'
  | 'this_week';

// Demographic breakdown types
export type DemographicBreakdown =
  | 'age'
  | 'city'
  | 'country'
  | 'gender';

// Metric types for media insights
// Based on Instagram Graph API - effective April 21, 2025
export type MediaMetric =
  | 'comments'
  | 'follows'
  | 'likes'
  | 'reach'
  | 'saved'
  | 'shares'
  | 'total_interactions'
  | 'views'
  | 'profile_visits'
  | 'profile_activity'
  | 'navigation'
  | 'replies'
  | 'avg_time_watched'
  | 'total_time_watched';

// Period types
export type Period = 'day' | 'week' | 'days_28' | 'lifetime';
