/**
 * Tool handlers for Social Analytics MCP Server
 */

import { InstagramClient } from '../platforms/instagram/client.js';
import { FacebookClient } from '../platforms/facebook/client.js';

export async function handleInstagramTool(
  toolName: string,
  args: Record<string, unknown>,
  client: InstagramClient | null
): Promise<unknown> {
  if (!client) {
    throw new Error('Instagram client not initialized. Please set INSTAGRAM_ACCESS_TOKEN in your MCP settings.');
  }

  switch (toolName) {
    case 'instagram_list_accounts':
      return await client.getAvailableAccounts();

    case 'instagram_get_profile': {
      const accountId = args.account_id as string | undefined;
      return await client.getUserProfile(accountId);
    }

    case 'instagram_get_account_insights': {
      const accountId = args.account_id as string | undefined;
      const metrics = args.metrics as any[];
      const metricType = args.metric_type as 'time_series' | 'total_value' | undefined;
      const period = args.period as any;
      const since = args.since as number | undefined;
      const until = args.until as number | undefined;
      const timeframe = args.timeframe as any;
      const breakdown = args.breakdown as any;

      return await client.getAccountInsights(metrics, period, {
        accountId,
        metricType,
        since,
        until,
        timeframe,
        breakdown,
      });
    }

    case 'instagram_list_media': {
      const accountId = args.account_id as string | undefined;
      const limit = args.limit as number | undefined;
      return await client.getMedia(limit, accountId);
    }

    case 'instagram_get_media_details': {
      const mediaId = args.media_id as string;
      return await client.getMediaById(mediaId);
    }

    case 'instagram_get_media_insights': {
      const mediaId = args.media_id as string;
      const metrics = args.metrics as any[];
      const period = args.period as any;
      return await client.getMediaInsights(mediaId, metrics, period);
    }

    default:
      throw new Error(`Unknown Instagram tool: ${toolName}`);
  }
}

export async function handleFacebookTool(
  toolName: string,
  args: Record<string, unknown>,
  client: FacebookClient | null
): Promise<unknown> {
  if (!client) {
    throw new Error('Facebook client not initialized. Please set FACEBOOK_ACCESS_TOKEN in your MCP settings.');
  }

  switch (toolName) {
    case 'facebook_list_pages':
      return await client.listPages();

    case 'facebook_get_page_insights': {
      const pageId = args.page_id as string | undefined;
      const metrics = args.metrics as string[];
      const period = args.period as string | undefined;
      const since = args.since as string | undefined;
      const until = args.until as string | undefined;
      const limit = args.limit as number | undefined;

      return await client.getPageInsights({
        pageId,
        metrics,
        period,
        since,
        until,
        limit,
      });
    }

    case 'facebook_get_post_insights': {
      const postId = args.post_id as string;
      const metrics = args.metrics as string[];
      const period = args.period as string | undefined;

      return await client.getPostInsights({
        postId,
        metrics,
        period,
      });
    }

    case 'facebook_list_posts_with_insights': {
      const pageId = args.page_id as string | undefined;
      const postMetrics = args.post_metrics as string[];
      const limit = args.limit as number | undefined;

      return await client.listPostsWithInsights({
        pageId,
        postMetrics,
        limit,
      });
    }

    default:
      throw new Error(`Unknown Facebook tool: ${toolName}`);
  }
}
