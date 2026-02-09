/**
 * Tool definitions for Social Analytics MCP Server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const INSTAGRAM_TOOLS: Tool[] = [
  {
    name: 'instagram_list_accounts',
    description: 'List all available Instagram Business accounts. Use this first to discover account IDs.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'instagram_get_profile',
    description: 'Get Instagram business account profile information (username, followers, media count, etc.). If account_id is not provided, it will be auto-detected from the environment or discovered automatically.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via INSTAGRAM_ACCOUNT_ID environment variable or if only one account exists.',
        },
      },
      required: [],
    },
  },
  {
    name: 'instagram_get_account_insights',
    description: 'Get account-level insights and analytics for Instagram. Supports demographic breakdowns and time series data.',
    inputSchema: {
      type: 'object',
      required: ['metrics', 'metric_type', 'period'],
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
        metrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'accounts_engaged',
              'comments',
              'engaged_audience_demographics',
              'follows_and_unfollows',
              'follower_demographics',
              'likes',
              'profile_links_taps',
              'reach',
              'replies',
              'saved',
              'shares',
              'total_interactions',
              'views',
            ],
          },
          description: 'Array of metrics to retrieve',
        },
        metric_type: {
          type: 'string',
          enum: ['time_series', 'total_value'],
          description: 'How to aggregate results',
        },
        period: {
          type: 'string',
          enum: ['day', 'week', 'days_28', 'lifetime'],
          description: 'Time period for insights',
        },
        since: {
          type: 'number',
          description: 'Unix timestamp for start of date range',
        },
        until: {
          type: 'number',
          description: 'Unix timestamp for end of date range',
        },
        timeframe: {
          type: 'string',
          enum: ['this_month', 'this_week', 'last_14_days', 'last_30_days', 'last_90_days', 'prev_month'],
          description: 'Required for demographic metrics (engaged_audience_demographics, follower_demographics)',
        },
        breakdown: {
          type: 'string',
          enum: ['contact_button_type', 'follow_type', 'media_product_type', 'age', 'city', 'country', 'gender'],
          description: 'Break down results by dimensions (only with metric_type=total_value)',
        },
      },
    },
  },
  {
    name: 'instagram_list_media',
    description: 'Get a list of recent media posts from Instagram account. Returns posts with basic engagement data.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
        limit: {
          type: 'number',
          description: 'Number of media items to retrieve (default: 25, max: 100)',
        },
      },
      required: [],
    },
  },
  {
    name: 'instagram_get_media_details',
    description: 'Get detailed information about a specific Instagram media post including caption, type, URL, and engagement counts.',
    inputSchema: {
      type: 'object',
      required: ['media_id'],
      properties: {
        media_id: {
          type: 'string',
          description: 'The ID of the media item',
        },
      },
    },
  },
  {
    name: 'instagram_get_media_insights',
    description:
      'Get insights for a specific Instagram media post. Note: Available metrics depend on media type. For Reels/Videos: use views, likes, comments, shares, reach, saved, total_interactions, replies, avg_time_watched, total_time_watched. For Images/Carousels: use likes, comments, reach, saved, shares, total_interactions. Story-specific metrics (replies, navigation) only work on story media.',
    inputSchema: {
      type: 'object',
      required: ['media_id', 'metrics'],
      properties: {
        media_id: {
          type: 'string',
          description: 'The ID of the media item',
        },
        metrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'comments',
              'follows',
              'likes',
              'reach',
              'saved',
              'shares',
              'total_interactions',
              'views',
              'profile_visits',
              'profile_activity',
              'navigation',
              'replies',
              'avg_time_watched',
              'total_time_watched',
            ],
          },
          description: 'Array of metrics to retrieve. Choose metrics appropriate for the media type.',
        },
        period: {
          type: 'string',
          enum: ['day', 'week', 'days_28', 'lifetime'],
          description: 'Time period (default: lifetime)',
        },
      },
    },
  },
  {
    name: 'instagram_get_stories',
    description: 'Get recent Instagram Stories for the account. Stories are only available for 24 hours after posting. Returns story media items with basic fields.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
      },
      required: [],
    },
  },
  {
    name: 'instagram_get_hashtag_search',
    description: 'Search for an Instagram hashtag ID by name. The returned ID can be used with instagram_get_hashtag_media to fetch top/recent media. Limited to 30 unique hashtag searches per 7-day rolling window per account.',
    inputSchema: {
      type: 'object',
      required: ['hashtag'],
      properties: {
        hashtag: {
          type: 'string',
          description: 'Hashtag name to search for (without the # symbol)',
        },
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
      },
    },
  },
  {
    name: 'instagram_get_hashtag_media',
    description: 'Get top or recent media for a hashtag. Use instagram_get_hashtag_search first to get the hashtag ID.',
    inputSchema: {
      type: 'object',
      required: ['hashtag_id'],
      properties: {
        hashtag_id: {
          type: 'string',
          description: 'The hashtag ID from instagram_get_hashtag_search',
        },
        type: {
          type: 'string',
          enum: ['top_media', 'recent_media'],
          description: 'Whether to get top or recent media (default: top_media)',
        },
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
        limit: {
          type: 'number',
          description: 'Number of media items to retrieve (default: 25)',
        },
      },
    },
  },
  {
    name: 'instagram_get_content_publishing_limit',
    description: 'Check the content publishing rate limit status for the Instagram account. Shows current quota usage and limits.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
      },
      required: [],
    },
  },
  {
    name: 'instagram_get_mentioned_media',
    description: 'Get media where the Instagram account is mentioned or tagged by other users.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
        limit: {
          type: 'number',
          description: 'Number of media items to retrieve (default: 25)',
        },
      },
      required: [],
    },
  },
];

export const FACEBOOK_TOOLS: Tool[] = [
  {
    name: 'facebook_list_pages',
    description: 'List all Facebook Pages accessible with the current access token. Use this first to discover page IDs.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'facebook_get_page_details',
    description: 'Get detailed information about a Facebook Page including name, category, follower count, about section, contact info, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        page_id: {
          type: 'string',
          description: 'Facebook Page ID. Optional if set via FACEBOOK_PAGE_ID environment variable.',
        },
      },
      required: [],
    },
  },
  {
    name: 'facebook_get_page_insights',
    description: 'Fetch page-level insights for a Facebook Page. Common metrics: page_impressions, page_impressions_unique, page_engaged_users, page_post_engagements, page_views_total, page_fans.',
    inputSchema: {
      type: 'object',
      required: ['metrics'],
      properties: {
        page_id: {
          type: 'string',
          description: 'Facebook Page ID. Optional if set via environment variable.',
        },
        metrics: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          description: 'List of page insight metric names (e.g., page_impressions, page_engaged_users)',
        },
        period: {
          type: 'string',
          enum: ['day', 'week', 'days_28', 'lifetime'],
          description: 'Period to aggregate metrics',
        },
        since: {
          type: 'string',
          description: 'Start of date range: YYYY-MM-DD or UNIX timestamp',
        },
        until: {
          type: 'string',
          description: 'End of date range: YYYY-MM-DD or UNIX timestamp',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 200,
          description: 'Limit for number of insight values',
        },
      },
    },
  },
  {
    name: 'facebook_get_post_insights',
    description: 'Fetch insights for a specific Facebook Page post. Common metrics: post_impressions, post_impressions_unique, post_engaged_users.',
    inputSchema: {
      type: 'object',
      required: ['post_id', 'metrics'],
      properties: {
        post_id: {
          type: 'string',
          description: 'Facebook Post ID',
        },
        metrics: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          description: 'List of post insight metric names',
        },
        period: {
          type: 'string',
          enum: ['day', 'week', 'days_28', 'lifetime'],
          description: 'Period to aggregate metrics',
        },
      },
    },
  },
  {
    name: 'facebook_list_posts_with_insights',
    description: 'List Facebook Page posts including inline insight metrics. Combines post data with metrics in a single request.',
    inputSchema: {
      type: 'object',
      required: ['post_metrics'],
      properties: {
        page_id: {
          type: 'string',
          description: 'Facebook Page ID. Optional if set via environment variable.',
        },
        post_metrics: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          description: 'List of post metrics to include inline',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          description: 'Number of posts to retrieve (default: 25)',
        },
      },
    },
  },
  {
    name: 'facebook_get_page_feed',
    description: 'Get the Facebook Page feed with full post details including reactions, comments, and shares counts.',
    inputSchema: {
      type: 'object',
      properties: {
        page_id: {
          type: 'string',
          description: 'Facebook Page ID. Optional if set via environment variable.',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          description: 'Number of posts to retrieve (default: 25)',
        },
      },
      required: [],
    },
  },
  {
    name: 'facebook_list_known_metrics',
    description: 'List all known/supported Facebook Page and Post metrics with their valid periods. Useful for discovering what metrics are available.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'facebook_validate_token',
    description: 'Validate a Facebook access token by checking it against the /me endpoint. Returns token validity, user ID, and name.',
    inputSchema: {
      type: 'object',
      required: ['access_token'],
      properties: {
        access_token: {
          type: 'string',
          description: 'The access token to validate',
        },
        fields: {
          type: 'array',
          items: { type: 'string' },
          description: 'Fields to request (default: id, name)',
        },
      },
    },
  },
];

export function getAllTools(): Tool[] {
  return [...INSTAGRAM_TOOLS, ...FACEBOOK_TOOLS];
}
