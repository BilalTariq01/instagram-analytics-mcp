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

// Metric types for account insights
// Based on Instagram Graph API v18.0+ requirements
export type AccountMetric =
  | 'reach'
  | 'follower_count'
  | 'website_clicks'
  | 'profile_views'
  | 'online_followers'
  | 'accounts_engaged'
  | 'total_interactions'
  | 'likes'
  | 'comments'
  | 'shares'
  | 'saves'
  | 'replies';

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
