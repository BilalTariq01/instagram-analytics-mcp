/**
 * Prompt definitions for Social Analytics MCP Server
 */

import { Prompt } from '@modelcontextprotocol/sdk/types.js';

export const PROMPTS: Prompt[] = [
  {
    name: 'analyze_instagram_performance',
    description: 'Analyze Instagram account performance with key metrics and insights',
    arguments: [
      {
        name: 'account_id',
        description: 'Instagram account ID (optional if configured)',
        required: false,
      },
      {
        name: 'timeframe',
        description: 'Analysis timeframe: this_week or this_month',
        required: false,
      },
    ],
  },
  {
    name: 'analyze_facebook_performance',
    description: 'Analyze Facebook Page performance with key metrics and insights',
    arguments: [
      {
        name: 'page_id',
        description: 'Facebook Page ID (optional if configured)',
        required: false,
      },
      {
        name: 'period',
        description: 'Analysis period: day, week, or days_28',
        required: false,
      },
    ],
  },
  {
    name: 'compare_post_performance',
    description: 'Compare performance of recent posts on Instagram or Facebook',
    arguments: [
      {
        name: 'platform',
        description: 'Platform to analyze: instagram or facebook',
        required: true,
      },
      {
        name: 'account_id',
        description: 'Account/Page ID (optional if configured)',
        required: false,
      },
      {
        name: 'limit',
        description: 'Number of recent posts to compare (default: 10)',
        required: false,
      },
    ],
  },
  {
    name: 'get_audience_demographics',
    description: 'Get detailed audience demographics for Instagram or Facebook',
    arguments: [
      {
        name: 'platform',
        description: 'Platform to analyze: instagram or facebook',
        required: true,
      },
      {
        name: 'account_id',
        description: 'Account/Page ID (optional if configured)',
        required: false,
      },
    ],
  },
  {
    name: 'setup_platform',
    description: 'Guide user through setting up Instagram or Facebook analytics',
    arguments: [
      {
        name: 'platform',
        description: 'Platform to setup: instagram or facebook',
        required: true,
      },
    ],
  },
];

export function getPromptContent(
  name: string,
  args: Record<string, string>
): { messages: Array<{ role: 'user' | 'assistant'; content: { type: 'text'; text: string } }> } {
  switch (name) {
    case 'analyze_instagram_performance': {
      const accountId = args.account_id || 'configured account';
      const timeframe = args.timeframe || 'this_month';
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Analyze Instagram performance for ${accountId} over ${timeframe}. Please:

1. First, use instagram_list_accounts to verify the account is accessible
2. Get profile information using instagram_get_profile
3. Fetch account insights with these metrics:
   - accounts_engaged
   - reach
   - profile_links_taps
   - total_interactions
   - Use metric_type: total_value, period: lifetime, timeframe: ${timeframe}
4. Get recent media posts using instagram_list_media (limit: 10)
5. For top 3 posts, get detailed insights with metrics: likes, comments, reach, saved

Provide a comprehensive analysis including:
- Overall account health and growth
- Engagement trends
- Top performing content
- Audience interaction patterns
- Actionable recommendations`,
            },
          },
        ],
      };
    }

    case 'analyze_facebook_performance': {
      const pageId = args.page_id || 'configured page';
      const period = args.period || 'days_28';
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Analyze Facebook Page performance for ${pageId} over ${period}. Please:

1. First, use facebook_list_pages to verify the page is accessible
2. Fetch page insights with these metrics:
   - page_impressions
   - page_impressions_unique
   - page_engaged_users
   - page_post_engagements
   - page_views_total
   - Use period: ${period}
3. Get recent posts with insights using facebook_list_posts_with_insights
   - post_metrics: post_impressions, post_engaged_users
   - limit: 10

Provide a comprehensive analysis including:
- Overall page performance and reach
- Engagement metrics and trends
- Top performing posts
- Audience growth patterns
- Content strategy recommendations`,
            },
          },
        ],
      };
    }

    case 'compare_post_performance': {
      const platform = args.platform;
      const accountId = args.account_id || 'configured account';
      const limit = args.limit || '10';

      if (platform === 'instagram') {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Compare performance of the last ${limit} Instagram posts for ${accountId}:

1. Use instagram_list_media to get recent posts (limit: ${limit})
2. For each post, get insights with metrics:
   - likes
   - comments
   - reach
   - saved
   - shares (if available)
   - engagement_rate (calculate from likes + comments / reach)

Provide a comparison showing:
- Performance ranking of posts
- Best and worst performing content
- Content type analysis (photo vs video vs carousel)
- Engagement patterns
- Recommendations for future content`,
              },
            },
          ],
        };
      } else if (platform === 'facebook') {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Compare performance of the last ${limit} Facebook posts for ${accountId}:

1. Use facebook_list_posts_with_insights with post_metrics:
   - post_impressions
   - post_impressions_unique
   - post_engaged_users
   - limit: ${limit}

Provide a comparison showing:
- Performance ranking of posts
- Best and worst performing content
- Engagement rate analysis
- Content timing patterns
- Recommendations for optimization`,
              },
            },
          ],
        };
      }

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: 'Please specify platform as either "instagram" or "facebook"',
            },
          },
        ],
      };
    }

    case 'get_audience_demographics': {
      const platform = args.platform;
      const accountId = args.account_id || 'configured account';

      if (platform === 'instagram') {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Get detailed audience demographics for Instagram ${accountId}:

1. Use instagram_get_account_insights with:
   - metrics: ["engaged_audience_demographics", "follower_demographics"]
   - metric_type: total_value
   - period: lifetime
   - timeframe: this_month
   - breakdown: country (then repeat with age, city, gender)

Provide a comprehensive demographic report including:
- Geographic distribution (countries and cities)
- Age and gender breakdown
- Follower vs engaged audience comparison
- Insights about target audience alignment
- Recommendations for content localization`,
              },
            },
          ],
        };
      } else if (platform === 'facebook') {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Get detailed audience demographics for Facebook Page ${accountId}:

Note: Facebook Page Insights API has limited demographic data compared to Instagram.
Use facebook_get_page_insights with available demographic metrics if supported by your page type.

For detailed demographics, you may need to:
1. Check Facebook Page Insights dashboard directly
2. Use Facebook Ads Manager for audience insights
3. Request additional API permissions if available

Provide available demographic information and guide on accessing more detailed data.`,
              },
            },
          ],
        };
      }

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: 'Please specify platform as either "instagram" or "facebook"',
            },
          },
        ],
      };
    }

    case 'setup_platform': {
      const platform = args.platform;

      if (platform === 'instagram') {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Let's set up Instagram analytics. Follow these steps:

1. **Get Access Token**
   - Go to Facebook Graph API Explorer: https://developers.facebook.com/tools/explorer/
   - Select your app or create a new one
   - Request permissions: instagram_basic, instagram_manage_insights, pages_read_engagement
   - Generate User Access Token

2. **Discover Your Account**
   - Use the tool: instagram_list_accounts
   - This will show all Instagram Business accounts you have access to
   - Copy the account_id you want to analyze

3. **Configure MCP Settings**
   - In your MCP client settings (e.g., Claude Desktop config), add:
     {
       "INSTAGRAM_ACCESS_TOKEN": "your_access_token_here"
     }
   - Optionally add INSTAGRAM_ACCOUNT_ID if you want a default account

4. **Verify Setup**
   - Use instagram_get_profile to verify access
   - Try instagram_get_account_insights to test analytics

You're ready to analyze Instagram performance!`,
              },
            },
          ],
        };
      } else if (platform === 'facebook') {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Let's set up Facebook Page analytics. Follow these steps:

1. **Get Access Token**
   - Go to Facebook Graph API Explorer: https://developers.facebook.com/tools/explorer/
   - Select your app or create a new one
   - Request permissions: read_insights, pages_read_engagement
   - Generate User Access Token

2. **Discover Your Pages**
   - Use the tool: facebook_list_pages
   - This will show all Facebook Pages you manage
   - Copy the page id you want to analyze

3. **Configure MCP Settings**
   - In your MCP client settings (e.g., Claude Desktop config), add:
     {
       "FACEBOOK_ACCESS_TOKEN": "your_access_token_here"
     }
   - Optionally add FACEBOOK_PAGE_ID if you want a default page

4. **Verify Setup**
   - Use facebook_get_page_insights to test analytics
   - Try facebook_list_posts_with_insights to see recent posts

You're ready to analyze Facebook Page performance!`,
              },
            },
          ],
        };
      }

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: 'Please specify platform as either "instagram" or "facebook"',
            },
          },
        ],
      };
    }

    default:
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Unknown prompt: ${name}`,
            },
          },
        ],
      };
  }
}
