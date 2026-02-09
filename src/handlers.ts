/**
 * Tool handlers for Social Analytics MCP Server
 */

import { InstagramClient } from './platforms/instagram/client.js';
import { FacebookClient } from './platforms/facebook/client.js';

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
      const metrics = args.metrics as string[];
      const metricType = args.metric_type as 'time_series' | 'total_value' | undefined;
      const period = args.period as string;
      const since = args.since as number | undefined;
      const until = args.until as number | undefined;
      const timeframe = args.timeframe as string | undefined;
      const breakdown = args.breakdown as string | undefined;

      return await client.getAccountInsights(metrics as any[], period as any, {
        accountId,
        metricType,
        since,
        until,
        timeframe: timeframe as any,
        breakdown: breakdown as any,
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
      const metrics = args.metrics as string[];
      const period = args.period as string | undefined;
      return await client.getMediaInsights(mediaId, metrics as any[], period as any);
    }

    case 'instagram_get_stories': {
      const accountId = args.account_id as string | undefined;
      return await client.getStories(accountId);
    }

    case 'instagram_get_hashtag_search': {
      const hashtag = args.hashtag as string;
      const accountId = args.account_id as string | undefined;
      const hashtagId = await client.searchHashtag(hashtag, accountId);
      return { hashtag, hashtag_id: hashtagId };
    }

    case 'instagram_get_hashtag_media': {
      const hashtagId = args.hashtag_id as string;
      const type = (args.type as 'top_media' | 'recent_media') || 'top_media';
      const accountId = args.account_id as string | undefined;
      const limit = args.limit as number | undefined;
      return await client.getHashtagMedia(hashtagId, type, accountId, limit);
    }

    case 'instagram_get_content_publishing_limit': {
      const accountId = args.account_id as string | undefined;
      return await client.getContentPublishingLimit(accountId);
    }

    case 'instagram_get_mentioned_media': {
      const accountId = args.account_id as string | undefined;
      const limit = args.limit as number | undefined;
      return await client.getMentionedMedia(accountId, limit);
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

    case 'facebook_get_page_details': {
      const pageId = args.page_id as string | undefined;
      return await client.getPageDetails(pageId);
    }

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

    case 'facebook_get_page_feed': {
      const pageId = args.page_id as string | undefined;
      const limit = args.limit as number | undefined;
      return await client.getPageFeed(pageId, limit);
    }

    case 'facebook_list_known_metrics':
      return client.listKnownMetrics();

    case 'facebook_validate_token': {
      const accessToken = args.access_token as string;
      const fields = args.fields as string[] | undefined;
      return await client.validateAccessToken({ accessToken, fields });
    }

    default:
      throw new Error(`Unknown Facebook tool: ${toolName}`);
  }
}
