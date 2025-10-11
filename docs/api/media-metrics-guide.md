# Instagram Media Insights Guide

Complete guide to Instagram Media Insights based on the latest API (effective April 21, 2025).

## Important Changes

### Deprecated Metrics (April 21, 2025)
- ❌ `plays` - Deprecated
- ❌ `clips_replays_count` - Deprecated
- ❌ `ig_reels_aggregated_all_plays_count` - Deprecated
- ❌ `impressions` - Deprecated for media created after July 1, 2024
- ❌ `video_views` - Deprecated
- ❌ `engagement` - Use `total_interactions` instead

### New Metrics
- ✅ `views` - Introduced for FEED, STORY, and REELS

## Available Metrics by Media Type

### All Media Types

#### `comments`
- **Description**: Number of comments on the media
- **Media Types**: All (Feed, Stories, Reels)
- **Use Case**: Measure conversation and engagement

#### `follows`
- **Description**: Number of followers gained from this media
- **Media Types**: All
- **Use Case**: Track follower acquisition

#### `likes`
- **Description**: Number of likes on the media
- **Media Types**: All
- **Use Case**: Measure popularity

#### `saved`
- **Description**: Number of times the media was saved
- **Media Types**: All
- **Use Case**: Content value indicator

### Stories & Reels

#### `reach`
- **Description**: Number of unique accounts that saw the media
- **Media Types**: Stories, Reels
- **Use Case**: Audience size measurement

#### `profile_visits`
- **Description**: Number of profile visits from this media
- **Media Types**: Stories, Reels
- **Use Case**: Track profile discovery

#### `profile_activity`
- **Description**: Actions taken on profile from this media
- **Media Types**: Stories, Reels
- **Breakdown**: `action_type` (email, text, direction, bio_link_clicked)
- **Use Case**: Measure profile engagement

### Reels Only

#### `shares`
- **Description**: Number of times the Reel was shared
- **Media Types**: Reels
- **Use Case**: Measure virality

#### `total_interactions`
- **Description**: Total interactions (likes + saves + comments + shares - unlikes - unsaves - deleted comments)
- **Media Types**: Reels
- **Use Case**: Overall engagement metric

#### `avg_time_watched`
- **Description**: Average watch time in milliseconds
- **Media Types**: Reels
- **Use Case**: Content quality indicator

#### `total_time_watched`
- **Description**: Total watch time in milliseconds
- **Media Types**: Reels
- **Use Case**: Total engagement time

### Stories Only

#### `navigation`
- **Description**: Story navigation actions
- **Media Types**: Stories
- **Breakdown**: `story_navigation_action_type` (tap_forward, tap_back, tap_exit, swipe_forward)
- **Use Case**: Story engagement patterns

#### `replies`
- **Description**: Number of replies to the story
- **Media Types**: Stories
- **Use Case**: Direct engagement measurement

### Feed, Stories & Reels

#### `views`
- **Description**: Total number of views
- **Media Types**: Feed, Stories, Reels
- **Use Case**: Primary visibility metric (replaces `video_views` and `impressions`)

## Usage Examples

### Feed Post Insights

```
Use get_media_insights

Parameters:
{
  "media_id": "your_feed_post_id",
  "metrics": ["views", "likes", "comments", "saved", "follows"]
}
```

### Story Insights

```
Use get_media_insights

Parameters:
{
  "media_id": "your_story_id",
  "metrics": ["views", "reach", "replies", "profile_visits", "navigation"]
}
```

### Reel Insights

```
Use get_media_insights

Parameters:
{
  "media_id": "your_reel_id",
  "metrics": ["views", "reach", "likes", "comments", "shares", "saved", "total_interactions", "avg_time_watched", "total_time_watched"]
}
```

### Comprehensive Analysis

```
Use get_media_insights

Parameters:
{
  "media_id": "your_media_id",
  "metrics": ["views", "likes", "comments", "saved", "follows"]
}
```

## Metric Combinations by Goal

### Engagement Analysis (All Media)
```json
{
  "metrics": ["views", "likes", "comments", "saved", "follows"]
}
```

### Story Performance
```json
{
  "metrics": ["views", "reach", "replies", "profile_visits", "navigation"]
}
```

### Reel Performance
```json
{
  "metrics": ["views", "reach", "total_interactions", "shares", "avg_time_watched"]
}
```

### Follower Growth
```json
{
  "metrics": ["views", "follows", "profile_visits"]
}
```

### Content Quality (Reels)
```json
{
  "metrics": ["avg_time_watched", "total_time_watched", "total_interactions"]
}
```

## Breakdown Options

### Profile Activity Breakdown

Use with `profile_activity` metric:

```json
{
  "metrics": ["profile_activity"],
  "breakdown": "action_type"
}
```

**Action Types**:
- `email` - Email button clicks
- `text` - Text button clicks
- `direction` - Get directions clicks
- `bio_link_clicked` - Bio link clicks

### Story Navigation Breakdown

Use with `navigation` metric:

```json
{
  "metrics": ["navigation"],
  "breakdown": "story_navigation_action_type"
}
```

**Navigation Types**:
- `tap_forward` - Tapped to next story
- `tap_back` - Tapped to previous story
- `tap_exit` - Exited story
- `swipe_forward` - Swiped to next story

## Media Type Detection

Before requesting metrics, check the media type:

```
Use get_media_details

Parameters:
{
  "media_id": "your_media_id"
}
```

Response includes `media_type`:
- `IMAGE` - Feed post (image)
- `VIDEO` - Feed post (video)
- `CAROUSEL_ALBUM` - Feed post (carousel)
- `STORY` - Story
- `REELS` - Reel

## Common Errors & Solutions

### Error: "Unsupported get request"

**Cause**: Metric not available for this media type

**Example**:
```
❌ Requesting "shares" for a Feed post
❌ Requesting "navigation" for a Reel
❌ Requesting "avg_time_watched" for a Story
```

**Solution**: Check media type first and use appropriate metrics

### Error: "Invalid metric"

**Cause**: Using deprecated metrics

**Migration**:
- `video_views` → Use `views`
- `impressions` → Use `views`
- `engagement` → Use `total_interactions` (Reels only)

### Error: "Metric not available for this media"

**Cause**: Media was created before metric was available or after deprecation

**Solution**: Use alternative metrics or check media creation date

## Best Practices

### 1. Check Media Type First

```
# Step 1: Get media details
Use get_media_details with media_id

# Step 2: Based on media_type, request appropriate metrics
```

### 2. Use Appropriate Metrics

**For Feed Posts**:
```json
["views", "likes", "comments", "saved", "follows"]
```

**For Stories**:
```json
["views", "reach", "replies", "profile_visits", "navigation"]
```

**For Reels**:
```json
["views", "reach", "total_interactions", "shares", "avg_time_watched"]
```

### 3. Combine Related Metrics

Group metrics that tell a complete story:
```json
{
  "metrics": ["views", "total_interactions", "avg_time_watched"]
}
```

### 4. Use Breakdowns for Deeper Insights

```json
{
  "metrics": ["profile_activity"],
  "breakdown": "action_type"
}
```

## Metric Availability Matrix

| Metric | Feed | Stories | Reels |
|--------|------|---------|-------|
| comments | ✅ | ✅ | ✅ |
| follows | ✅ | ✅ | ✅ |
| likes | ✅ | ✅ | ✅ |
| saved | ✅ | ✅ | ✅ |
| views | ✅ | ✅ | ✅ |
| reach | ❌ | ✅ | ✅ |
| shares | ❌ | ❌ | ✅ |
| total_interactions | ❌ | ❌ | ✅ |
| profile_visits | ❌ | ✅ | ✅ |
| profile_activity | ❌ | ✅ | ✅ |
| navigation | ❌ | ✅ | ❌ |
| replies | ❌ | ✅ | ❌ |
| avg_time_watched | ❌ | ❌ | ✅ |
| total_time_watched | ❌ | ❌ | ✅ |

## Migration Guide

### From Deprecated Metrics

| Old Metric | New Alternative | Notes |
|------------|-----------------|-------|
| `video_views` | `views` | Universal metric for all media |
| `impressions` | `views` | For media after July 1, 2024 |
| `engagement` | `total_interactions` | Reels only |
| `plays` | `views` | Unified metric |
| `clips_replays_count` | N/A | No direct replacement |

### Example Migration

**Before (Deprecated)**:
```json
{
  "metrics": ["video_views", "impressions", "engagement"]
}
```

**After (Current)**:
```json
{
  "metrics": ["views", "total_interactions", "likes", "comments"]
}
```

## Response Format

```json
{
  "data": [
    {
      "name": "views",
      "period": "lifetime",
      "values": [
        {
          "value": 1234
        }
      ],
      "title": "Views",
      "description": "Total number of times the media was viewed",
      "id": "media_id/insights/views/lifetime"
    }
  ]
}
```

With breakdown:
```json
{
  "name": "profile_activity",
  "period": "lifetime",
  "total_value": {
    "breakdowns": [
      {
        "dimension_keys": ["action_type"],
        "results": [
          {
            "dimension_values": ["email"],
            "value": 10
          },
          {
            "dimension_values": ["bio_link_clicked"],
            "value": 25
          }
        ]
      }
    ]
  }
}
```

## Workflow Examples

### Complete Post Analysis

```
# 1. Get post details
Use get_media_details with media_id

# 2. Check media_type in response

# 3. Request appropriate insights
Use get_media_insights based on media_type

# 4. Analyze results
```

### Compare Multiple Posts

```
# 1. List recent media
Use list_media

# 2. For each post:
Use get_media_insights with consistent metrics

# 3. Compare results to identify top performers
```

### Story Performance Tracking

```
# 1. Get story insights
Use get_media_insights with:
{
  "metrics": ["views", "reach", "replies", "navigation"],
  "breakdown": "story_navigation_action_type"
}

# 2. Analyze engagement patterns
```

## Resources

- [Instagram Media Insights API](https://developers.facebook.com/docs/instagram-api/reference/ig-media/insights)
- [Metric Definitions](https://developers.facebook.com/docs/instagram-api/guides/insights)
- [Deprecation Notice](https://developers.facebook.com/docs/instagram-api/changelog)

---

**Last Updated**: Based on Instagram Graph API (effective April 21, 2025)
**API Version**: v18.0+
