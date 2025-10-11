# Social Analytics MCP Server (Instagram & Facebook)

A Model Context Protocol (MCP) server that provides access to social analytics using Meta's Graph APIs. It currently supports Instagram Business/Creator accounts and Facebook Pages, exposing insights, media data, and validation tools through a unified MCP interface.

## Features

- 📊 **Instagram Account Insights**: Metrics like impressions, reach, profile views, follower count, and more
- 📸 **Instagram Media Insights**: Analyze individual posts with engagement, impressions, reach, and saves
- 📋 **Instagram Media Management**: List and retrieve details about your Instagram posts
- 👤 **Instagram Profile Information**: Access account profile data including followers, bio, and website
- 📈 **Facebook Page Insights**: Pull page- and post-level metrics such as impressions, engaged users, and page views
- 📰 **Facebook Post Listings**: Fetch posts with inline metrics for quick analysis
- ✅ **Token Validation**: Check Page access tokens against the `/me` endpoint to confirm scopes and validity
- 🔒 **Secure**: Uses environment variables for access token management
- 🚀 **Easy to Use**: Simple setup and integration with MCP-compatible clients

## Prerequisites

Before using this MCP server, you need:

### Instagram requirements

1. **Instagram Business Account** or **Instagram Creator Account**
2. **Facebook Page** connected to your Instagram account
3. **Facebook Developer Account** with an app created
4. **Instagram Graph API Access Token** with the following permissions:
   - `instagram_basic`
   - `instagram_manage_insights`
   - `pages_read_engagement`
   - `pages_show_list`

### Facebook requirements

1. **Facebook Page** with at least 30 likes (Insights require a minimum audience)
2. **Facebook Developer App** with permissions:
   - `read_insights`
   - `pages_read_engagement`
3. **Page Access Token** (must be a Page token, not a user token)
4. (Optional) **App Access Token** if you plan to run Graph `debug_token` manually outside this server

## Getting Your Access Token

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Business" as the app type
4. Fill in the required details

### Step 2: Add Instagram Graph API

1. In your app dashboard, click "Add Product"
2. Find "Instagram" and click "Set Up"
3. Follow the setup instructions

### Step 3: Generate Access Token

1. Go to **Graph API Explorer** in your app
2. Select your app from the dropdown
3. Click "Generate Access Token"
4. Select the required permissions:
   - `instagram_basic`
   - `instagram_manage_insights`
   - `pages_read_engagement`
   - `pages_show_list`
5. Copy the generated access token

### Step 4: Get Long-Lived Token (Recommended)

Short-lived tokens expire in 1 hour. Convert to a long-lived token (60 days):

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

For more details, see the [Instagram Platform Documentation](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/getting-started).

## Installation

1. **Clone or download this repository**

```bash
git clone <repository-url>
cd mcp-instagram-analytics
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
INSTAGRAM_ACCESS_TOKEN=your_access_token_here
INSTAGRAM_ACCOUNT_ID=your_account_id_here  # Optional - will be auto-detected
```

4. **Build the project**

```bash
npm run build
```

## Usage

### Running the Server

```bash
npm start
```

Or for development with auto-rebuild:

```bash
npm run dev
```

### Configuring with MCP Clients

Add this server to your MCP client configuration. For example, in Claude Desktop's config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "instagram-analytics": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-instagram-analytics/dist/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "your_access_token_here"
      }
    }
  }
}
```

## Available Tools

### 1. `list_available_accounts`

List all Instagram Business accounts connected to your Facebook pages. Use this when you have multiple accounts to see which ones are available.

**Parameters**: None

**Example Response**:
```json
[
  {
    "id": "123456789",
    "username": "my_business_account",
    "name": "My Business",
    "pageId": "987654321",
    "pageName": "My Facebook Page"
  },
  {
    "id": "987654321",
    "username": "my_other_account",
    "name": "My Other Business",
    "pageId": "123456789",
    "pageName": "Another Page"
  }
]
```

**Use Case**: If you have multiple Instagram accounts, run this tool first to see all available accounts and their IDs. Then set the `INSTAGRAM_ACCOUNT_ID` environment variable to the ID of the account you want to use.

### 2. `get_user_profile`

Get Instagram business account profile information.

**Parameters**: None

**Example Response**:
```json
{
  "id": "123456789",
  "username": "your_username",
  "name": "Your Name",
  "followers_count": 1500,
  "follows_count": 300,
  "media_count": 50,
  "biography": "Your bio",
  "website": "https://yourwebsite.com"
}
```

### 3. `get_account_insights`

Get account-level insights and analytics.

**Parameters**:
- `metrics` (required): Array of metrics to retrieve
  - Available: `impressions`, `reach`, `profile_views`, `follower_count`, `email_contacts`, `phone_call_clicks`, `text_message_clicks`, `get_directions_clicks`, `website_clicks`
- `period` (required): Time period (`day`, `week`, `days_28`)
- `since` (optional): Unix timestamp for start date
- `until` (optional): Unix timestamp for end date

**Example**:
```json
{
  "metrics": ["impressions", "reach", "profile_views"],
  "period": "day"
}
```

### 4. `list_media`

Get a list of recent media posts.

**Parameters**:
- `limit` (optional): Number of items to retrieve (default: 25, max: 100)

**Example Response**:
```json
[
  {
    "id": "media_id_123",
    "caption": "Check out this post!",
    "media_type": "IMAGE",
    "media_url": "https://...",
    "permalink": "https://instagram.com/p/...",
    "timestamp": "2024-01-15T10:30:00+0000",
    "like_count": 150,
    "comments_count": 25
  }
]
```

### 5. `get_media_insights`

Get insights for a specific media post.

**Parameters**:
- `media_id` (required): The ID of the media item
- `metrics` (required): Array of metrics
  - Available: `engagement`, `impressions`, `reach`, `saved`, `video_views`, `likes`, `comments`, `shares`

**Example**:
```json
{
  "media_id": "media_id_123",
  "metrics": ["engagement", "impressions", "reach", "saved"]
}
```

### 6. `get_media_details`

Get detailed information about a specific media post.

**Parameters**:
- `media_id` (required): The ID of the media item

## Example Use Cases

### Analyze Recent Performance

1. Use `list_media` to get your recent posts
2. Use `get_media_insights` on each post to analyze performance
3. Compare metrics across posts to identify what content performs best

### Track Account Growth

1. Use `get_account_insights` with `follower_count` metric over `days_28` period
2. Monitor `profile_views` and `reach` to understand visibility
3. Track `website_clicks` to measure traffic generation

### Content Strategy

1. Use `get_media_insights` to identify top-performing posts
2. Analyze `engagement` and `saved` metrics
3. Adjust content strategy based on insights

## Troubleshooting

### "Access token is invalid"

- Ensure your access token has the required permissions
- Check if the token has expired (short-lived tokens expire in 1 hour)
- Generate a new long-lived token

### "No Instagram Business account found"

- Ensure your Instagram account is a Business or Creator account
- Verify your Instagram account is connected to a Facebook Page
- Check that your Facebook Page is accessible with the current token

### "Unsupported metric"

- Some metrics are only available for certain account types
- Video-specific metrics (like `video_views`) only work for video posts
- Check the [Instagram Insights API documentation](https://developers.facebook.com/docs/instagram-platform/insights) for metric availability

## API Rate Limits

Instagram Graph API has rate limits:
- **200 calls per hour** per user access token
- **200 calls per hour** per app

Plan your usage accordingly and implement caching if needed.

## Development

### Project Structure

```
mcp-instagram-analytics/
├── src/
│   ├── index.ts              # MCP server implementation
│   ├── instagram-client.ts   # Instagram API client
│   └── types.ts              # TypeScript type definitions
├── dist/                     # Compiled JavaScript (generated)
├── .env                      # Environment variables (create this)
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

### Building

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this in your own projects!

## Resources

- [Instagram Platform Documentation](https://developers.facebook.com/docs/instagram-platform)
- [Instagram Insights API](https://developers.facebook.com/docs/instagram-platform/insights)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)

## Support

For issues and questions:
- Check the [Instagram Platform Documentation](https://developers.facebook.com/docs/instagram-platform)
- Review the troubleshooting section above
- Open an issue in this repository

---

**Note**: This is an unofficial tool and is not affiliated with Meta, Facebook, or Instagram.
