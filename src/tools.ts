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
    description: 'Get Instagram business account profile information (username, followers, media count, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID (optional if set in environment)',
        },
      },
      required: ['account_id'],
    },
  },
  {
    name: 'instagram_get_account_insights',
    description: 'Get account-level insights and analytics for Instagram.',
    inputSchema: {
      type: 'object',
      required: ['metrics', 'metric_type', 'period', 'account_id'],
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID (optional if set in environment)',
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
          description: 'Unix timestamp for start of date range (optional)',
        },
        until: {
          type: 'number',
          description: 'Unix timestamp for end of date range (optional)',
        },
        timeframe: {
          type: 'string',
          enum: ['this_month', 'this_week'],
          description: 'Required for demographic metrics',
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
    description: 'Get a list of recent media posts from Instagram account.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID (optional if set in environment)',
        },
        limit: {
          type: 'number',
          description: 'Number of media items to retrieve (default: 25, max: 100)',
        },
      },
      required: ['account_id'],
    },
  },
  {
    name: 'instagram_get_media_details',
    description: 'Get detailed information about a specific Instagram media post.',
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
    description: 'Get insights for a specific Instagram media post.',
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
          description: 'Array of metrics to retrieve',
        },
        period: {
          type: 'string',
          enum: ['day', 'week', 'days_28', 'lifetime'],
          description: 'Time period (default: lifetime)',
        },
      },
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
    name: 'facebook_get_page_insights',
    description: 'Fetch page-level insights for Facebook Page. Requires page to be configured.',
    inputSchema: {
      type: 'object',
      required: ['metrics', 'page_id'],
      properties: {
        page_id: {
          type: 'string',
          description: 'Facebook Page ID (optional if set in environment)',
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
    description: 'Fetch insights for a specific Facebook Page post.',
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
    description: 'List Facebook Page posts including inline insight metrics.',
    inputSchema: {
      type: 'object',
      required: ['post_metrics', 'page_id'],
      properties: {
        page_id: {
          type: 'string',
          description: 'Facebook Page ID (optional if set in environment)',
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
          default: 25,
          description: 'Number of posts to retrieve',
        },
      },
    },
  },
];

export function getAllTools(): Tool[] {
  return [...INSTAGRAM_TOOLS, ...FACEBOOK_TOOLS];
}
