# Usage Examples

This document provides practical examples of using the Instagram Analytics MCP Server.

## Getting Started

All examples assume you have:
1. Installed and configured the MCP server
2. Connected it to your MCP client (e.g., Claude Desktop)
3. Set up your Instagram access token

## Example 1: Weekly Performance Report

Get a comprehensive overview of your account's performance over the past week.

### Step 1: Get Account Insights

```json
{
  "tool": "get_account_insights",
  "arguments": {
    "metrics": ["impressions", "reach", "profile_views", "follower_count"],
    "period": "week"
  }
}
```

### Step 2: Get Recent Posts

```json
{
  "tool": "list_media",
  "arguments": {
    "limit": 10
  }
}
```

### Step 3: Analyze Top Posts

For each post from Step 2, get detailed insights:

```json
{
  "tool": "get_media_insights",
  "arguments": {
    "media_id": "POST_ID_HERE",
    "metrics": ["engagement", "impressions", "reach", "saved"]
  }
}
```

## Example 2: Content Performance Analysis

Identify which types of content perform best.

### Get All Recent Media

```json
{
  "tool": "list_media",
  "arguments": {
    "limit": 50
  }
}
```

### Analyze Each Post Type

For images:
```json
{
  "tool": "get_media_insights",
  "arguments": {
    "media_id": "IMAGE_POST_ID",
    "metrics": ["engagement", "impressions", "reach", "saved", "likes", "comments"]
  }
}
```

For videos:
```json
{
  "tool": "get_media_insights",
  "arguments": {
    "media_id": "VIDEO_POST_ID",
    "metrics": ["engagement", "impressions", "reach", "saved", "video_views", "likes", "comments"]
  }
}
```

## Example 3: Growth Tracking

Monitor your account growth over time.

### Daily Growth Check

```json
{
  "tool": "get_account_insights",
  "arguments": {
    "metrics": ["follower_count", "profile_views"],
    "period": "day"
  }
}
```

### Monthly Overview

```json
{
  "tool": "get_account_insights",
  "arguments": {
    "metrics": ["impressions", "reach", "follower_count"],
    "period": "days_28"
  }
}
```

## Example 4: Engagement Analysis

Understand how users interact with your content.

### Account-Level Engagement

```json
{
  "tool": "get_account_insights",
  "arguments": {
    "metrics": ["email_contacts", "phone_call_clicks", "text_message_clicks", "website_clicks"],
    "period": "week"
  }
}
```

### Post-Level Engagement

```json
{
  "tool": "get_media_insights",
  "arguments": {
    "media_id": "POST_ID",
    "metrics": ["engagement", "likes", "comments", "shares", "saved"]
  }
}
```

## Example 5: Best Time to Post Analysis

Analyze when your posts get the most engagement.

### Step 1: Get All Recent Posts

```json
{
  "tool": "list_media",
  "arguments": {
    "limit": 100
  }
}
```

### Step 2: Get Insights for Each Post

```json
{
  "tool": "get_media_insights",
  "arguments": {
    "media_id": "POST_ID",
    "metrics": ["engagement", "impressions", "reach"]
  }
}
```

### Step 3: Analyze

Compare the `timestamp` from the media details with the engagement metrics to identify patterns.

## Example 6: Competitor Benchmarking Setup

While you can't directly access competitor data, you can track your own metrics for comparison.

### Create a Baseline

```json
{
  "tool": "get_user_profile",
  "arguments": {}
}
```

```json
{
  "tool": "get_account_insights",
  "arguments": {
    "metrics": ["impressions", "reach", "follower_count"],
    "period": "days_28"
  }
}
```

Save these metrics and compare them over time to track your growth relative to your goals.

## Example 7: Video Performance Analysis

Specifically analyze video content performance.

### Get Video Posts

First, list media and identify video posts (media_type: "VIDEO"):

```json
{
  "tool": "list_media",
  "arguments": {
    "limit": 25
  }
}
```

### Analyze Video Metrics

```json
{
  "tool": "get_media_insights",
  "arguments": {
    "media_id": "VIDEO_POST_ID",
    "metrics": ["video_views", "engagement", "impressions", "reach", "saved"]
  }
}
```

## Example 8: Story Performance (if available)

Note: Story insights require additional setup and may not be available in all configurations.

### Get Story Insights

```json
{
  "tool": "get_media_insights",
  "arguments": {
    "media_id": "STORY_ID",
    "metrics": ["impressions", "reach", "replies"]
  }
}
```

## Example 9: Custom Date Range Analysis

Analyze performance for a specific time period.

### Calculate Unix Timestamps

For example, to analyze January 1-31, 2024:
- Since: `1704067200` (Jan 1, 2024 00:00:00 UTC)
- Until: `1706745599` (Jan 31, 2024 23:59:59 UTC)

```json
{
  "tool": "get_account_insights",
  "arguments": {
    "metrics": ["impressions", "reach", "profile_views"],
    "period": "day",
    "since": 1704067200,
    "until": 1706745599
  }
}
```

## Example 10: Complete Profile Audit

Get a comprehensive view of your Instagram presence.

### Step 1: Profile Information

```json
{
  "tool": "get_user_profile",
  "arguments": {}
}
```

### Step 2: Overall Performance

```json
{
  "tool": "get_account_insights",
  "arguments": {
    "metrics": ["impressions", "reach", "profile_views", "follower_count", "website_clicks"],
    "period": "days_28"
  }
}
```

### Step 3: Content Overview

```json
{
  "tool": "list_media",
  "arguments": {
    "limit": 25
  }
}
```

### Step 4: Top Performing Content

Identify your top 5 posts by likes/comments and get detailed insights for each.

## Tips for Using the MCP Server

### 1. Rate Limiting

Instagram API has rate limits (200 calls/hour). To stay within limits:
- Batch your requests
- Cache results when possible
- Avoid unnecessary repeated calls

### 2. Metric Availability

Not all metrics are available for all account types:
- Some metrics require Business accounts
- Video metrics only work for video posts
- Story metrics require story media IDs

### 3. Data Freshness

Instagram insights data may have a delay:
- Account insights: Usually updated within 24 hours
- Media insights: Available shortly after posting
- Historical data: May take time to populate

### 4. Best Practices

- **Regular monitoring**: Check insights weekly for trends
- **Compare periods**: Use different period values to spot patterns
- **Track consistently**: Use the same metrics over time for accurate comparison
- **Document findings**: Keep notes on what works for your audience

## Automation Ideas

### Daily Summary Script

Create a script that runs daily to:
1. Get yesterday's account insights
2. List new posts
3. Analyze engagement on recent posts
4. Send you a summary report

### Weekly Report

Every Monday:
1. Get previous week's insights
2. Compare to the week before
3. Identify top-performing posts
4. Suggest content strategies

### Content Calendar Optimization

Before posting:
1. Analyze historical performance by day/time
2. Identify best posting times
3. Schedule content accordingly

## Need Help?

- Check the main README.md for troubleshooting
- Review the SETUP_GUIDE.md for configuration help
- Consult Instagram Platform documentation for API details

Happy analyzing! 📊
