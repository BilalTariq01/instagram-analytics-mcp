# Quick Reference Guide

A quick reference for using the Instagram Analytics MCP Server.

## Installation (Quick)

```bash
# 1. Install dependencies
npm install

# 2. Configure
cp .env.example .env
# Edit .env and add your INSTAGRAM_ACCESS_TOKEN

# 3. Build
npm run build

# 4. Run
npm start
```

## Available Tools

### 1. get_user_profile
Get profile information.

**Parameters**: None

**Example**:
```json
{}
```

---

### 2. get_account_insights
Get account-level analytics.

**Parameters**:
- `metrics` (required): Array of metric names
- `period` (required): `"day"`, `"week"`, or `"days_28"`
- `since` (optional): Unix timestamp
- `until` (optional): Unix timestamp

**Available Metrics**:
- `impressions` - Total views
- `reach` - Unique accounts reached
- `profile_views` - Profile visits
- `follower_count` - Current followers
- `email_contacts` - Email button clicks
- `phone_call_clicks` - Call button clicks
- `text_message_clicks` - Text button clicks
- `get_directions_clicks` - Directions clicks
- `website_clicks` - Website link clicks

**Example**:
```json
{
  "metrics": ["impressions", "reach", "profile_views"],
  "period": "week"
}
```

---

### 3. list_media
List recent posts.

**Parameters**:
- `limit` (optional): Number of posts (default: 25, max: 100)

**Example**:
```json
{
  "limit": 10
}
```

---

### 4. get_media_insights
Get insights for a specific post.

**Parameters**:
- `media_id` (required): Post ID
- `metrics` (required): Array of metric names

**Available Metrics**:
- `engagement` - Total interactions
- `impressions` - Total views
- `reach` - Unique accounts reached
- `saved` - Number of saves
- `video_views` - Video views (videos only)
- `likes` - Like count
- `comments` - Comment count
- `shares` - Share count

**Example**:
```json
{
  "media_id": "123456789",
  "metrics": ["engagement", "impressions", "reach", "saved"]
}
```

---

### 5. get_media_details
Get detailed post information.

**Parameters**:
- `media_id` (required): Post ID

**Example**:
```json
{
  "media_id": "123456789"
}
```

## Common Workflows

### Weekly Report
```
1. get_account_insights (week period)
2. list_media (limit: 10)
3. get_media_insights for top posts
```

### Post Analysis
```
1. list_media
2. get_media_details for specific post
3. get_media_insights for that post
```

### Growth Tracking
```
1. get_user_profile
2. get_account_insights (follower_count, days_28)
```

## Time Periods

- `day` - Last 24 hours
- `week` - Last 7 days
- `days_28` - Last 28 days

## Unix Timestamp Conversion

**JavaScript**:
```javascript
// Current time
Math.floor(Date.now() / 1000)

// Specific date
Math.floor(new Date('2024-01-01').getTime() / 1000)
```

**Online Tools**:
- https://www.unixtimestamp.com/

## Rate Limits

- **200 calls per hour** per access token
- **200 calls per hour** per app

## Common Errors

| Error | Solution |
|-------|----------|
| "Access token is invalid" | Generate new token with correct permissions |
| "No Instagram Business account found" | Convert to Business account and connect to Facebook Page |
| "Unsupported metric" | Check metric availability for your account type |
| "Rate limit exceeded" | Wait an hour or reduce request frequency |

## MCP Client Configuration

### Claude Desktop

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "instagram-analytics": {
      "command": "node",
      "args": ["/absolute/path/to/dist/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "your_token"
      }
    }
  }
}
```

## Required Permissions

- ✅ `instagram_basic`
- ✅ `instagram_manage_insights`
- ✅ `pages_read_engagement`
- ✅ `pages_show_list`

## Useful Links

- [Instagram Platform Docs](https://developers.facebook.com/docs/instagram-platform)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Access Token Tool](https://developers.facebook.com/tools/accesstoken/)

## Support

- 📖 Full docs: See `README.md`
- 🛠️ Setup help: See `SETUP_GUIDE.md`
- 💡 Examples: See `examples/usage-examples.md`
- 🤝 Contributing: See `CONTRIBUTING.md`
