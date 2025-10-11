#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { FacebookClient } from './client.js';
import { FacebookApiError, KnownMetricsResponse, NormalizedError } from './types.js';

dotenv.config();

const config = {
  accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
  pageId: process.env.FACEBOOK_PAGE_ID,
  defaultApiVersion: process.env.FACEBOOK_API_VERSION,
  appAccessToken: process.env.FACEBOOK_APP_ACCESS_TOKEN,
};

const facebookClient = new FacebookClient(config);

const TOOLS: Tool[] = [
  {
    name: 'list_pages',
    description: 'List all Facebook Pages accessible with the current access token. Use this to discover page IDs and select which page to configure for analytics.',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Override access token (optional).',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_page_insights',
    description: 'Fetch page-level insights for the configured Facebook Page using the Graph API insights edge. Requires FACEBOOK_PAGE_ID to be set in environment.',
    inputSchema: {
      type: 'object',
      required: ['metrics'],
      properties: {
        metrics: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          description: 'List of page insight metric names.',
        },
        period: {
          type: 'string',
          enum: ['day', 'week', 'days_28', 'lifetime'],
          description: 'Period to aggregate metrics, varies per metric.',
        },
        since: {
          type: 'string',
          description: 'Start of date range: YYYY-MM-DD or UNIX timestamp.',
        },
        until: {
          type: 'string',
          description: 'End of date range: YYYY-MM-DD or UNIX timestamp.',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 200,
          description: 'Limit for the number of insight values returned.',
        },
        after: {
          type: 'string',
          description: 'Pagination cursor for next page.',
        },
        before: {
          type: 'string',
          description: 'Pagination cursor for previous page.',
        },
        api_version: {
          type: 'string',
          description: 'Graph API version, defaults to v22.0.',
        },
        access_token: {
          type: 'string',
          description: 'Override Page access token.',
        },
      },
    },
  },
  {
    name: 'get_post_insights',
    description: 'Fetch insights for a specific Facebook Page post.',
    inputSchema: {
      type: 'object',
      required: ['post_id', 'metrics'],
      properties: {
        post_id: {
          type: 'string',
          description: 'Facebook Post ID.',
        },
        metrics: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          description: 'List of post insight metric names.',
        },
        period: {
          type: 'string',
          enum: ['day', 'week', 'days_28', 'lifetime'],
          description: 'Period to aggregate metrics, varies per metric.',
        },
        api_version: {
          type: 'string',
          description: 'Graph API version, defaults to v22.0.',
        },
        access_token: {
          type: 'string',
          description: 'Override Page access token.',
        },
      },
    },
  },
  {
    name: 'list_posts_with_insights',
    description: 'List Facebook Page posts including selected inline insight metrics. Requires FACEBOOK_PAGE_ID to be set in environment.',
    inputSchema: {
      type: 'object',
      required: ['post_metrics'],
      properties: {
        post_metrics: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          description: 'List of post metrics to include inline.',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 25,
          description: 'Number of posts to retrieve.',
        },
        after: {
          type: 'string',
          description: 'Pagination cursor for next page.',
        },
        before: {
          type: 'string',
          description: 'Pagination cursor for previous page.',
        },
        api_version: {
          type: 'string',
          description: 'Graph API version, defaults to v22.0.',
        },
        access_token: {
          type: 'string',
          description: 'Override Page access token.',
        },
      },
    },
  },
  {
    name: 'list_known_metrics',
    description: 'Return a curated list of commonly used Facebook Page and Post metrics.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'validate_access_token',
    description: 'Validate a Facebook access token using the Graph debug_token endpoint.',
    inputSchema: {
      type: 'object',
      required: ['access_token'],
      properties: {
        access_token: {
          type: 'string',
          description: 'Access token to validate.',
        },
        api_version: {
          type: 'string',
          description: 'Graph API version, defaults to v22.0.',
        },
        fields: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional list of fields to request from /me.',
        },
      },
    },
  },
];

const server = new Server(
  {
    name: 'facebook-analytics',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_pages': {
        const { access_token } = (args ?? {}) as Record<string, unknown>;
        const result = await facebookClient.listPages(access_token as string | undefined);
        return formatSuccess(result);
      }

      case 'get_page_insights': {
        const {
          metrics,
          period,
          since,
          until,
          limit,
          after,
          before,
          api_version,
          access_token,
        } = (args ?? {}) as Record<string, unknown>;

        const result = await facebookClient.getPageInsights({
          pageId: undefined,
          metrics: Array.isArray(metrics) ? (metrics as string[]) : [],
          period: period as string | undefined,
          since: since as string | undefined,
          until: until as string | undefined,
          limit: typeof limit === 'number' ? (limit as number) : undefined,
          after: after as string | undefined,
          before: before as string | undefined,
          apiVersion: api_version as string | undefined,
          accessToken: access_token as string | undefined,
        });

        return formatSuccess(result);
      }

      case 'get_post_insights': {
        const { post_id, metrics, period, api_version, access_token } = (args ?? {}) as Record<string, unknown>;

        const result = await facebookClient.getPostInsights({
          postId: post_id as string,
          metrics: Array.isArray(metrics) ? (metrics as string[]) : [],
          period: period as string | undefined,
          apiVersion: api_version as string | undefined,
          accessToken: access_token as string | undefined,
        });

        return formatSuccess(result);
      }

      case 'list_posts_with_insights': {
        const {
          post_metrics,
          limit,
          after,
          before,
          api_version,
          access_token,
        } = (args ?? {}) as Record<string, unknown>;

        const result = await facebookClient.listPostsWithInsights({
          pageId: undefined,
          postMetrics: Array.isArray(post_metrics) ? (post_metrics as string[]) : [],
          limit: typeof limit === 'number' ? (limit as number) : undefined,
          after: after as string | undefined,
          before: before as string | undefined,
          apiVersion: api_version as string | undefined,
          accessToken: access_token as string | undefined,
        });

        return formatSuccess(result);
      }

      case 'list_known_metrics': {
        const metrics: KnownMetricsResponse = facebookClient.listKnownMetrics();
        return formatSuccess(metrics);
      }

      case 'validate_access_token': {
        const { access_token, api_version, fields } = (args ?? {}) as Record<string, unknown>;
        const result = await facebookClient.validateAccessToken({
          accessToken: access_token as string,
          apiVersion: api_version as string | undefined,
          fields: Array.isArray(fields) ? (fields as string[]) : undefined,
        });

        return formatSuccess(result);
      }

      default:
        throw new FacebookApiError({ code: 'VALIDATION', message: `Unknown tool: ${name}`, raw: null });
    }
  } catch (error) {
    if (error instanceof FacebookApiError) {
      return formatError(error.normalized);
    }

    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return formatError({ code: 'UNKNOWN', message, raw: error });
  }
});

function formatSuccess(data: unknown) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

function formatError(error: NormalizedError) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error }, null, 2),
      },
    ],
    isError: true,
  };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Facebook Analytics MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export function createFacebookServer() {
  return {
    start: async () => {
      const transport = new StdioServerTransport();
      await server.connect(transport);
      console.error('Facebook Analytics MCP Server running on stdio');
    },
    getServer: () => server,
  };
}
