#!/usr/bin/env node

/**
 * Social Analytics MCP Server
 * Unified server supporting Instagram and Facebook analytics
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { InstagramClient } from './platforms/instagram/client.js';
import { FacebookClient } from './platforms/facebook/client.js';
import { getAllTools } from './tools.js';
import { PROMPTS, getPromptContent } from './prompts.js';
import { handleInstagramTool, handleFacebookTool } from './handlers.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

// Package version kept in sync
const VERSION = '3.0.0';

// Initialize clients
const instagramClient = process.env.INSTAGRAM_ACCESS_TOKEN
  ? new InstagramClient({
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
      accountId: process.env.INSTAGRAM_ACCOUNT_ID,
      apiVersion: process.env.INSTAGRAM_API_VERSION,
    })
  : null;

const facebookClient = process.env.FACEBOOK_ACCESS_TOKEN
  ? new FacebookClient({
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
      pageId: process.env.FACEBOOK_PAGE_ID,
      defaultApiVersion: process.env.FACEBOOK_API_VERSION,
    })
  : null;

/**
 * Create and configure the MCP server
 */
export function createServer() {
  const server = new Server(
    {
      name: 'social-analytics-mcp',
      version: VERSION,
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
      },
    }
  );

  // Helper to format success responses
  function formatSuccess(data: unknown) {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  // Helper to format error responses
  function formatError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ error: message }, null, 2),
        },
      ],
      isError: true,
    };
  }

  // Register list tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: getAllTools(),
    };
  });

  // Register call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result: unknown;

      if (name.startsWith('instagram_')) {
        result = await handleInstagramTool(name, (args ?? {}) as Record<string, unknown>, instagramClient);
      } else if (name.startsWith('facebook_')) {
        result = await handleFacebookTool(name, (args ?? {}) as Record<string, unknown>, facebookClient);
      } else {
        throw new Error(`Unknown tool: ${name}`);
      }

      return formatSuccess(result);
    } catch (error) {
      return formatError(error);
    }
  });

  // Register list prompts handler
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: PROMPTS,
    };
  });

  // Register get prompt handler
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const promptContent = getPromptContent(name, (args ?? {}) as Record<string, string>);
      return promptContent;
    } catch (error) {
      throw new Error(`Failed to get prompt: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  return server;
}

// Create server instance
const server = createServer();

// Export for programmatic usage
export { server, InstagramClient, FacebookClient };
export { getAllTools } from './tools.js';
export { PROMPTS, getPromptContent } from './prompts.js';
export { handleInstagramTool, handleFacebookTool } from './handlers.js';
export type { InstagramConfig } from './platforms/instagram/types.js';
export type { FacebookConfig } from './platforms/facebook/types.js';

// Start server when run directly
const transport = new StdioServerTransport();

logger.info(`Social Analytics MCP Server v${VERSION} starting...`, {
  instagram: !!instagramClient,
  facebook: !!facebookClient,
});

server.connect(transport).catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
