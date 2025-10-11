#!/usr/bin/env node
/**
 * Instagram Analytics MCP Server
 * Provides tools for accessing Instagram insights and analytics via MCP protocol
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { InstagramClient } from './client.js';
// Load environment variables
dotenv.config();
// Validate required environment variables
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;
if (!INSTAGRAM_ACCESS_TOKEN) {
    console.error('Error: INSTAGRAM_ACCESS_TOKEN environment variable is required');
    process.exit(1);
}
// Initialize Instagram client
const instagramClient = new InstagramClient({
    accessToken: INSTAGRAM_ACCESS_TOKEN,
    accountId: INSTAGRAM_ACCOUNT_ID,
});
// Define MCP tools
const TOOLS = [
    {
        name: 'list_available_accounts',
        description: 'List all available Instagram Business accounts connected to your Facebook pages. Use this to see which accounts you can access and get their IDs for configuration.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'get_user_profile',
        description: 'Get Instagram business account profile information including username, followers count, media count, biography, etc.',
        inputSchema: {
            type: 'object',
            properties: {
                account_id: {
                    type: 'string',
                    description: 'Instagram account ID (required - use list_available_accounts to get account IDs)',
                },
            },
            required: ['account_id'],
        },
    },
    {
        name: 'get_account_insights',
        description: 'Get account-level insights and analytics. Supports interaction metrics (accounts_engaged, comments, likes, reach, replies, saved, shares, total_interactions, views, profile_links_taps) and demographic metrics (engaged_audience_demographics, follower_demographics, follows_and_unfollows). Demographic metrics automatically use "country" as breakdown if none specified.',
        inputSchema: {
            type: 'object',
            properties: {
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
                period: {
                    type: 'string',
                    enum: ['day', 'week', 'days_28', 'lifetime'],
                    description: 'Time period for the insights. Use lifetime for demographic metrics.',
                },
                metric_type: {
                    type: 'string',
                    enum: ['time_series', 'total_value'],
                    description: 'How to aggregate results: time_series (by time period) or total_value (simple total with optional breakdowns)',
                },
                breakdown: {
                    type: 'string',
                    enum: ['contact_button_type', 'follow_type', 'media_product_type', 'age', 'city', 'country', 'gender'],
                    description: 'Break down results by specific dimensions. Only works with metric_type=total_value. For demographic metrics (engaged_audience_demographics, follower_demographics, etc.), defaults to "country" if not specified.',
                },
                timeframe: {
                    type: 'string',
                    enum: ['this_month', 'this_week'],
                    description: 'Required for demographic metrics. this_month = last 30 days, this_week = last 7 days. Note: last_14_days, last_30_days, last_90_days, prev_month deprecated in v20+.',
                },
                since: {
                    type: 'number',
                    description: 'Unix timestamp for the start of the date range (optional, not used with demographic metrics)',
                },
                until: {
                    type: 'number',
                    description: 'Unix timestamp for the end of the date range (optional, not used with demographic metrics)',
                },
                account_id: {
                    type: 'string',
                    description: 'Instagram account ID (required - use list_available_accounts to get account IDs)',
                },
            },
            required: ['metrics', 'period', 'account_id'],
        },
    },
    {
        name: 'list_media',
        description: 'Get a list of recent media posts from the Instagram account with basic information like caption, media type, timestamp, likes, and comments.',
        inputSchema: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Number of media items to retrieve (default: 25, max: 100)',
                },
                account_id: {
                    type: 'string',
                    description: 'Instagram account ID (required - use list_available_accounts to get account IDs)',
                },
            },
            required: ['account_id'],
        },
    },
    {
        name: 'get_media_insights',
        description: 'Get insights for a specific media post. Available metrics vary by media type: comments, follows, likes, reach (Stories/Reels), saved, shares (Reels), total_interactions (Reels), views (Feed/Stories/Reels), profile_visits (Stories/Reels), profile_activity (Stories/Reels), navigation (Stories), replies (Stories), avg_time_watched (Reels), total_time_watched (Reels).',
        inputSchema: {
            type: 'object',
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
                    description: 'Array of metrics to retrieve for the media. Note: Some metrics are only available for specific media types (Feed, Stories, Reels).',
                },
                period: {
                    type: 'string',
                    enum: ['day', 'week', 'days_28', 'lifetime'],
                    description: 'Time period for the insights (default: lifetime). Media insights are typically lifetime metrics.',
                },
            },
            required: ['media_id', 'metrics'],
        },
    },
    {
        name: 'get_media_details',
        description: 'Get detailed information about a specific media post including caption, media type, URL, permalink, timestamp, likes, and comments.',
        inputSchema: {
            type: 'object',
            properties: {
                media_id: {
                    type: 'string',
                    description: 'The ID of the media item',
                },
            },
            required: ['media_id'],
        },
    },
];
// Create MCP server
const server = new Server({
    name: 'instagram-analytics',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: TOOLS,
    };
});
// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'list_available_accounts': {
                const accounts = await instagramClient.getAvailableAccounts();
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(accounts, null, 2),
                        },
                    ],
                };
            }
            case 'get_user_profile': {
                const { account_id } = args;
                const profile = await instagramClient.getUserProfile(account_id);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(profile, null, 2),
                        },
                    ],
                };
            }
            case 'get_account_insights': {
                const { metrics, period, since, until, account_id, metric_type, breakdown, timeframe } = args;
                const insights = await instagramClient.getAccountInsights(metrics, period, {
                    since,
                    until,
                    accountId: account_id,
                    metricType: metric_type,
                    breakdown: breakdown,
                    timeframe: timeframe,
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(insights, null, 2),
                        },
                    ],
                };
            }
            case 'list_media': {
                const { limit = 25, account_id } = args;
                const media = await instagramClient.getMedia(limit, account_id);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(media, null, 2),
                        },
                    ],
                };
            }
            case 'get_media_insights': {
                const { media_id, metrics, period = 'lifetime' } = args;
                const insights = await instagramClient.getMediaInsights(media_id, metrics, period);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(insights, null, 2),
                        },
                    ],
                };
            }
            case 'get_media_details': {
                const { media_id } = args;
                const media = await instagramClient.getMediaById(media_id);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(media, null, 2),
                        },
                    ],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ error: errorMessage }, null, 2),
                },
            ],
            isError: true,
        };
    }
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Instagram Analytics MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
// Export server creation function
export function createInstagramServer() {
    return {
        start: async () => {
            const transport = new StdioServerTransport();
            await server.connect(transport);
            console.error('Instagram Analytics MCP Server running on stdio');
        },
        getServer: () => server,
    };
}
//# sourceMappingURL=server.js.map