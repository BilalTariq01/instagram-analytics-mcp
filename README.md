# Social Analytics MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server for Instagram and Facebook analytics via the Meta Graph API.

## Features

### Instagram

- Account discovery and profile information
- Account-level insights with demographic breakdowns
- Media listing with engagement data
- Per-post insights (images, videos, reels, carousels)
- Stories retrieval
- Hashtag search and media discovery
- Content publishing rate limits
- Mentioned/tagged media

### Facebook

- Page discovery and detailed page info
- Page-level insights (impressions, engagement, fans, views)
- Post-level insights
- Posts with inline metrics
- Page feed with reactions/comments/shares
- Known metrics reference
- Access token validation

### Shared

- Pre-built analysis prompts for common workflows
- Retry with exponential backoff on 429/5xx errors
- Structured error handling across both platforms
- Debug logging via `DEBUG=social-analytics-mcp`

## Quick Start

1. **Install and build**

   ```bash
   git clone <repository-url>
   cd social-analytics-mcp
   npm install
   npm run build
   ```

2. **Get an access token** from the [Graph API Explorer](https://developers.facebook.com/tools/explorer/) with permissions:
   - Instagram: `instagram_basic`, `instagram_manage_insights`, `pages_read_engagement`
   - Facebook: `read_insights`, `pages_read_engagement`

3. **Add to your MCP client** (see configuration below)

## Configuration

| Variable | Required | Default | Description |
|---|---|---|---|
| `INSTAGRAM_ACCESS_TOKEN` | For Instagram | — | Facebook User Access Token with Instagram permissions |
| `INSTAGRAM_ACCOUNT_ID` | No | Auto-detected | Instagram Business Account ID |
| `INSTAGRAM_API_VERSION` | No | `v23.0` | Instagram Graph API version |
| `FACEBOOK_ACCESS_TOKEN` | For Facebook | — | Facebook User/Page Access Token |
| `FACEBOOK_PAGE_ID` | No | Use discovery tool | Facebook Page ID |
| `FACEBOOK_API_VERSION` | No | `v22.0` | Facebook Graph API version |
| `DEBUG` | No | — | Set to `social-analytics-mcp` for debug logs |

You only need to configure access tokens for the platforms you want to use. Account and page IDs can be discovered using the built-in tools.

## MCP Client Setup

### Claude Desktop

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "social-analytics": {
      "command": "node",
      "args": ["/absolute/path/to/social-analytics-mcp/dist/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "your_token_here",
        "FACEBOOK_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add social-analytics node /absolute/path/to/social-analytics-mcp/dist/index.js \
  -e INSTAGRAM_ACCESS_TOKEN=your_token_here \
  -e FACEBOOK_ACCESS_TOKEN=your_token_here
```

## Available Tools

### Instagram Tools

| Tool | Description | Required Params |
|---|---|---|
| `instagram_list_accounts` | List available Instagram Business accounts | — |
| `instagram_get_profile` | Get account profile info | — |
| `instagram_get_account_insights` | Get account-level analytics | `metrics`, `metric_type`, `period` |
| `instagram_list_media` | List recent media posts | — |
| `instagram_get_media_details` | Get details for a specific post | `media_id` |
| `instagram_get_media_insights` | Get insights for a specific post | `media_id`, `metrics` |
| `instagram_get_stories` | Get recent stories | — |
| `instagram_get_hashtag_search` | Search for a hashtag ID | `hashtag` |
| `instagram_get_hashtag_media` | Get media for a hashtag | `hashtag_id` |
| `instagram_get_content_publishing_limit` | Check publishing rate limits | — |
| `instagram_get_mentioned_media` | Get media where account is tagged | — |

### Facebook Tools

| Tool | Description | Required Params |
|---|---|---|
| `facebook_list_pages` | List accessible Facebook Pages | — |
| `facebook_get_page_details` | Get page profile information | — |
| `facebook_get_page_insights` | Get page-level insights | `metrics` |
| `facebook_get_post_insights` | Get insights for a specific post | `post_id`, `metrics` |
| `facebook_list_posts_with_insights` | List posts with inline metrics | `post_metrics` |
| `facebook_get_page_feed` | Get page feed with engagement data | — |
| `facebook_list_known_metrics` | List supported metrics reference | — |
| `facebook_validate_token` | Validate an access token | `access_token` |

### Common Parameters

Most Instagram tools accept an optional `account_id` parameter. If not provided, the account is auto-detected from the `INSTAGRAM_ACCOUNT_ID` environment variable or discovered automatically if only one account exists.

Most Facebook tools accept an optional `page_id` parameter with similar auto-detection behavior via `FACEBOOK_PAGE_ID`.

## Available Prompts

| Prompt | Description |
|---|---|
| `analyze_instagram_performance` | Comprehensive Instagram account analysis |
| `analyze_facebook_performance` | Comprehensive Facebook Page analysis |
| `compare_post_performance` | Compare recent posts on either platform |
| `get_audience_demographics` | Audience demographic breakdown |
| `setup_platform` | Interactive setup guide |

## Programmatic Usage

```typescript
import { InstagramClient, FacebookClient, createServer } from 'social-analytics-mcp';

// Use clients directly
const instagram = new InstagramClient({
  accessToken: 'your_token',
  accountId: 'optional_account_id',
});
const profile = await instagram.getUserProfile();

// Or create an MCP server programmatically
const server = createServer();
```

## Troubleshooting

### "Access token is invalid"

- Ensure your token has the required permissions
- Short-lived tokens expire in 1 hour — generate a long-lived token

### "No Instagram Business account found"

- Your Instagram account must be a Business or Creator account
- It must be connected to a Facebook Page

### "Unsupported metric"

- Some metrics are media-type specific (e.g., `avg_time_watched` only works for videos/reels)
- Use `facebook_list_known_metrics` to see supported Facebook metrics

### Rate limits

- Instagram: 200 calls/hour per user token
- The server automatically retries on 429/5xx with exponential backoff

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT

---

**Note**: This is an unofficial tool and is not affiliated with Meta, Facebook, or Instagram.
