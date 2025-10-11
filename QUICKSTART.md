# Quick Start Guide

Get started with Social Analytics MCP Server in 3 simple steps!

## Step 1: Get Your Access Tokens

### For Instagram Analytics

1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app (or create one)
3. Request these permissions:
   - `instagram_basic`
   - `instagram_manage_insights`
   - `pages_read_engagement`
4. Click "Generate Access Token"
5. Copy the token

### For Facebook Analytics

1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app (or create one)
3. Request these permissions:
   - `read_insights`
   - `pages_read_engagement`
4. Click "Generate Access Token"
5. Copy the token

## Step 2: Configure MCP Client

Add this to your MCP client configuration (e.g., Claude Desktop `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "social-analytics": {
      "command": "node",
      "args": ["/absolute/path/to/social-analytics-mcp/src/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "paste_your_instagram_token_here",
        "FACEBOOK_ACCESS_TOKEN": "paste_your_facebook_token_here"
      }
    }
  }
}
```

**That's it!** No need to configure account IDs or page IDs.

## Step 3: Discover Your Accounts

### For Instagram

Ask your AI assistant:

> "Use the instagram_list_accounts tool to show me my Instagram accounts"

The server will list all your Instagram Business accounts with their IDs.

### For Facebook

Ask your AI assistant:

> "Use the facebook_list_pages tool to show me my Facebook pages"

The server will list all your Facebook Pages with their IDs.

## Using Prompts

The server includes pre-built prompts for common analytics tasks:

### Analyze Instagram Performance

> "Use the analyze_instagram_performance prompt for this_month"

### Analyze Facebook Performance

> "Use the analyze_facebook_performance prompt with period days_28"

### Compare Post Performance

> "Use the compare_post_performance prompt for instagram with limit 10"

### Get Audience Demographics

> "Use the get_audience_demographics prompt for instagram"

### Setup Help

> "Use the setup_platform prompt for instagram"

## Available Tools

### Instagram Tools

- `instagram_list_accounts` - Discover your Instagram Business accounts
- `instagram_get_profile` - Get profile information
- `instagram_get_account_insights` - Get account-level analytics
- `instagram_list_media` - List recent posts
- `instagram_get_media_details` - Get details about a specific post
- `instagram_get_media_insights` - Get analytics for a specific post

### Facebook Tools

- `facebook_list_pages` - Discover your Facebook Pages
- `facebook_get_page_insights` - Get page-level analytics
- `facebook_get_post_insights` - Get analytics for a specific post
- `facebook_list_posts_with_insights` - List recent posts with metrics

## Tips

1. **Start with discovery tools** (`instagram_list_accounts`, `facebook_list_pages`) to find your account/page IDs
2. **Use prompts** for guided analysis - they'll call the right tools in the right order
3. **Only tokens needed** - The server handles account/page discovery automatically
4. **Both platforms work together** - You can analyze Instagram and Facebook in the same conversation

## Troubleshooting

### "Client not initialized" error

Make sure you've added the access token to your MCP client configuration and restarted the client.

### "Permission denied" error

Your access token might be missing required permissions. Go back to Graph API Explorer and ensure you've requested all necessary permissions.

### Token expired

Access tokens expire. Generate a new one from Graph API Explorer and update your configuration.

## Next Steps

- Check out the full [README](./README.md) for detailed documentation
- Explore [platform-specific guides](./docs/platforms/) for advanced features
- Review [example usage](./examples/usage-examples.md) for inspiration

Happy analyzing! 📊
