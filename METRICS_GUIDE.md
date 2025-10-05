# Instagram Metrics Guide

Complete guide to available metrics in the Instagram Analytics MCP Server, based on Instagram Graph API v18.0+.

## Account Metrics

### Basic Metrics

#### `reach`
- **Description**: Number of unique accounts that saw your content
- **Period**: day, week, days_28
- **Type**: Time series
- **Use Case**: Measure content visibility

#### `follower_count`
- **Description**: Total number of followers
- **Period**: day, week, days_28
- **Type**: Total value
- **Use Case**: Track account growth

#### `profile_views`
- **Description**: Number of times your profile was viewed
- **Period**: day, week, days_28
- **Type**: Total value (requires `metric_type=total_value`)
- **Use Case**: Measure profile interest

#### `website_clicks`
- **Description**: Number of taps on the website link in your profile
- **Period**: day, week, days_28
- **Type**: Total value (requires `metric_type=total_value`)
- **Use Case**: Track traffic to your website

### Engagement Metrics

#### `accounts_engaged`
- **Description**: Number of unique accounts that engaged with your content
- **Period**: day, week, days_28
- **Type**: Time series
- **Use Case**: Measure audience engagement

#### `total_interactions`
- **Description**: Total number of interactions (likes, comments, shares, saves)
- **Period**: day, week, days_28
- **Type**: Time series
- **Use Case**: Overall engagement tracking

#### `likes`
- **Description**: Total number of likes on your posts
- **Period**: day, week, days_28
- **Type**: Time series
- **Use Case**: Track like activity

#### `comments`
- **Description**: Total number of comments on your posts
- **Period**: day, week, days_28
- **Type**: Time series
- **Use Case**: Track conversation

#### `shares`
- **Description**: Number of times your content was shared
- **Period**: day, week, days_28
- **Type**: Time series
- **Use Case**: Measure content virality

#### `saves`
- **Description**: Number of times your content was saved
- **Period**: day, week, days_28
- **Type**: Time series
- **Use Case**: Measure content value

#### `replies`
- **Description**: Number of replies to your content
- **Period**: day, week, days_28
- **Type**: Time series
- **Use Case**: Track direct responses

### Audience Metrics

#### `online_followers`
- **Description**: Number of your followers who were online
- **Period**: day, week, days_28
- **Type**: Time series
- **Use Case**: Optimize posting times

## Media Metrics

### Post-Level Metrics

#### `engagement`
- **Description**: Total interactions on a post (likes + comments + saves + shares)
- **Media Types**: All
- **Use Case**: Overall post performance

#### `impressions`
- **Description**: Total number of times the post was seen
- **Media Types**: All
- **Use Case**: Post visibility

#### `reach`
- **Description**: Unique accounts that saw the post
- **Media Types**: All
- **Use Case**: Post audience size

#### `saved`
- **Description**: Number of times the post was saved
- **Media Types**: All
- **Use Case**: Content value indicator

#### `video_views`
- **Description**: Number of times the video was viewed
- **Media Types**: VIDEO only
- **Use Case**: Video performance

#### `likes`
- **Description**: Number of likes on the post
- **Media Types**: All
- **Use Case**: Post popularity

#### `comments`
- **Description**: Number of comments on the post
- **Media Types**: All
- **Use Case**: Conversation level

#### `shares`
- **Description**: Number of times the post was shared
- **Media Types**: All
- **Use Case**: Content virality

## Removed Metrics (No Longer Available)

The following metrics from older API versions are **no longer supported**:

- ❌ `impressions` (account-level) - Use `reach` instead
- ❌ `email_contacts` - No longer available
- ❌ `phone_call_clicks` - No longer available
- ❌ `text_message_clicks` - No longer available
- ❌ `get_directions_clicks` - No longer available

## Usage Examples

### Basic Account Insights

```
Use get_account_insights

Parameters:
{
  "metrics": ["reach", "follower_count", "profile_views"],
  "period": "week",
  "account_id": "17841471286039698"
}
```

### Engagement Analysis

```
Use get_account_insights

Parameters:
{
  "metrics": ["accounts_engaged", "total_interactions", "likes", "comments", "shares", "saves"],
  "period": "days_28",
  "account_id": "17841471286039698"
}
```

### Website Traffic

```
Use get_account_insights

Parameters:
{
  "metrics": ["website_clicks", "profile_views"],
  "period": "week",
  "account_id": "17841471286039698"
}
```

### Post Performance

```
Use get_media_insights

Parameters:
{
  "media_id": "your_media_id",
  "metrics": ["engagement", "impressions", "reach", "saved", "likes", "comments"]
}
```

### Video Performance

```
Use get_media_insights

Parameters:
{
  "media_id": "your_video_id",
  "metrics": ["video_views", "engagement", "reach", "likes", "comments"]
}
```

## Metric Combinations

### Growth Tracking
```json
{
  "metrics": ["follower_count", "reach", "profile_views"],
  "period": "days_28"
}
```

### Engagement Analysis
```json
{
  "metrics": ["accounts_engaged", "total_interactions", "likes", "comments", "shares"],
  "period": "week"
}
```

### Content Performance
```json
{
  "metrics": ["reach", "accounts_engaged", "saves", "shares"],
  "period": "week"
}
```

### Audience Activity
```json
{
  "metrics": ["online_followers", "reach", "accounts_engaged"],
  "period": "day"
}
```

## Time Periods

### `day`
- Last 24 hours
- Best for: Daily monitoring

### `week`
- Last 7 days
- Best for: Weekly reports

### `days_28`
- Last 28 days
- Best for: Monthly analysis, trend identification

## API Requirements

### Metrics Requiring `metric_type=total_value`

The following metrics automatically include `metric_type=total_value`:
- `profile_views`
- `website_clicks`

**Note**: The MCP server handles this automatically - you don't need to specify it!

### Permissions Required

Your access token must have:
- ✅ `instagram_basic`
- ✅ `instagram_manage_insights`
- ✅ `pages_read_engagement`
- ✅ `pages_show_list`

## Common Errors

### Error: "metric[0] must be one of the following values..."

**Cause**: Using an invalid or deprecated metric

**Solution**: Use only the metrics listed in this guide

**Example**:
```
❌ "impressions" (account-level - deprecated)
✅ "reach" (use this instead)
```

### Error: "The following metrics should be specified with parameter metric_type=total_value"

**Cause**: Metric requires `metric_type` parameter

**Solution**: The server now handles this automatically. Restart Claude Desktop to use the updated version.

### Error: "Unsupported get request"

**Cause**: Metric not available for the media type (e.g., `video_views` on an image)

**Solution**: Check media type first with `list_media` or `get_media_details`

## Best Practices

### 1. Choose Relevant Metrics

Don't request all metrics at once. Focus on what matters:
- **Growth**: `follower_count`, `reach`, `profile_views`
- **Engagement**: `accounts_engaged`, `total_interactions`, `likes`, `comments`
- **Content**: `reach`, `saves`, `shares`

### 2. Use Appropriate Periods

- **Daily monitoring**: `period: "day"`
- **Weekly reports**: `period: "week"`
- **Trend analysis**: `period: "days_28"`

### 3. Combine Related Metrics

Group metrics that tell a story:
```json
{
  "metrics": ["reach", "accounts_engaged", "total_interactions"],
  "period": "week"
}
```

### 4. Track Over Time

Request the same metrics regularly to identify trends:
- Compare week-over-week
- Track monthly growth
- Identify seasonal patterns

## Migration from Old Metrics

If you were using deprecated metrics:

| Old Metric | New Alternative |
|------------|-----------------|
| `impressions` (account) | `reach` |
| `email_contacts` | Not available |
| `phone_call_clicks` | Not available |
| `text_message_clicks` | Not available |
| `get_directions_clicks` | Not available |

## Resources

- [Instagram Insights API Documentation](https://developers.facebook.com/docs/instagram-api/reference/ig-user/insights)
- [Available Metrics Reference](https://developers.facebook.com/docs/instagram-api/reference/ig-user/insights#metrics)
- [Metric Definitions](https://developers.facebook.com/docs/instagram-api/guides/insights)

---

**Last Updated**: Based on Instagram Graph API v18.0+
