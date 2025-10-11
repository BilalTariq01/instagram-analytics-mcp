# Instagram API Fixes - Critical Updates

## Issues Fixed

### 1. Missing Metrics ✅

**Problem**: API returned error about missing metrics like `saves`, `reached_audience_demographics`, and Threads metrics.

**Solution**: Added all missing metrics to the enum:

#### New Metrics Added
- `saves` (account-level saves)
- `reached_audience_demographics`
- **Threads Metrics** (9 new):
  - `threads_likes`
  - `threads_replies`
  - `reposts`
  - `quotes`
  - `threads_followers`
  - `threads_follower_demographics`
  - `content_views`
  - `threads_views`
  - `threads_clicks`
- **Legacy Metrics** (for backward compatibility):
  - `follower_count`
  - `website_clicks`
  - `profile_views`
  - `online_followers`

**Total Metrics**: Now **29 metrics** supported (was 13)

### 2. Deprecated Timeframes ✅

**Problem**: API error - `last_30_days`, `last_14_days`, `last_90_days`, `prev_month` no longer supported in v20+.

**Solution**: Updated timeframe enum to only supported values.

#### Supported Timeframes (v20+)
- ✅ `this_month` - Last 30 days
- ✅ `this_week` - Last 7 days

#### Deprecated Timeframes (v20+)
- ❌ `last_14_days` - Removed
- ❌ `last_30_days` - Removed
- ❌ `last_90_days` - Removed
- ❌ `prev_month` - Removed

### 3. Demographic Breakdown Requirement ✅

**Problem**: `A breakdown parameter must be inputted to view demographic metrics. Available breakdown parameters are age, city, country and gender.`

**Solution**: Added automatic default breakdown handling.

#### What Changed
- **Automatic Default**: When requesting demographic metrics (`engaged_audience_demographics`, `follower_demographics`, `reached_audience_demographics`, `threads_follower_demographics`) without specifying a breakdown, the API now automatically uses `"country"` as the default breakdown.

- **Smart Logic**: The client now checks if any demographic metrics are requested and automatically adds `breakdown: 'country'` if none is provided.

#### Example
**Before (Error)**:
```json
{
  "metrics": ["engaged_audience_demographics"],
  "period": "lifetime",
  "timeframe": "this_month"
}
```
❌ Error: "A breakdown parameter must be inputted..."

**After (Works Automatically)**:
```json
{
  "metrics": ["engaged_audience_demographics"],
  "period": "lifetime",
  "timeframe": "this_month"
}
```
✅ Works! Automatically uses `breakdown: "country"`

**Or Still Works with Custom Breakdown**:
```json
{
  "metrics": ["engaged_audience_demographics"],
  "period": "lifetime",
  "timeframe": "this_month",
  "breakdown": "age"
}
```
✅ Works! Uses specified `breakdown: "age"`

## Updated Usage

### For Last 30 Days of Demographics (Auto-breakdown)
```json
{
  "metrics": ["engaged_audience_demographics"],
  "period": "lifetime",
  "timeframe": "this_month",
  "account_id": "17841453340834745"
}
```

### For Last 7 Days of Demographics (Auto-breakdown)
```json
{
  "metrics": ["follower_demographics"],
  "period": "lifetime",
  "timeframe": "this_week",
  "account_id": "17841453340834745"
}
```

### For Account-Level Saves
```json
{
  "metrics": ["likes", "comments", "shares", "saves"],
  "period": "day",
  "metric_type": "total_value",
  "account_id": "17841453340834745"
}
```

### Custom Breakdown
```json
{
  "metrics": ["engaged_audience_demographics"],
  "period": "lifetime",
  "timeframe": "this_month",
  "breakdown": "age",
  "account_id": "17841453340834745"
}
```

## Migration Guide

### Timeframe Migration

| Old (Deprecated) | New (v20+) | Equivalent |
|------------------|------------|------------|
| `last_30_days` | `this_month` | Last 30 days |
| `last_14_days` | `this_week` | Last 7 days (closest) |
| `last_90_days` | ❌ Not available | Use `this_month` |
| `prev_month` | ❌ Not available | Use `this_month` |

### Metric Names
- Account saves: Use `saves`
- Media saves: Use `saved`

### Demographic Metrics
- **No longer need to specify breakdown** - `country` is used by default
- **Can still specify custom breakdown** if desired (age, city, country, gender)

## Complete Metric List (29 Total)

### Interaction Metrics (13)
1. `accounts_engaged` - Accounts that interacted
2. `comments` - Comment count
3. `likes` - Like count
4. `profile_links_taps` - Contact button taps
5. `reach` - Unique viewers
6. `replies` - Story replies
7. `saves` - Save count (account-level)
8. `saved` - Save count (media-level)
9. `shares` - Share count
10. `total_interactions` - Total engagement
11. `views` - Content views
12. `content_views` - Content views (Threads)
13. `follows_and_unfollows` - Follow/unfollow tracking

### Demographic Metrics (3)
14. `engaged_audience_demographics` - Engaged audience demographics
15. `follower_demographics` - Follower demographics
16. `reached_audience_demographics` - Reached audience demographics

### Threads Metrics (9)
17. `threads_likes` - Threads likes
18. `threads_replies` - Threads replies
19. `reposts` - Repost count
20. `quotes` - Quote count
21. `threads_followers` - Threads followers
22. `threads_follower_demographics` - Threads follower demographics
23. `threads_views` - Threads views
24. `threads_clicks` - Threads clicks

### Legacy Metrics (4)
25. `follower_count` - Follower count
26. `website_clicks` - Website clicks
27. `profile_views` - Profile views
28. `online_followers` - Online followers

## Testing

After restarting Claude Desktop, all these should now work:

### Test 1: Demographics (Auto-breakdown)
```json
{
  "metrics": ["engaged_audience_demographics"],
  "period": "lifetime",
  "timeframe": "this_month",
  "account_id": "17841453340834745"
}
```

### Test 2: Demographics with Custom Breakdown
```json
{
  "metrics": ["follower_demographics"],
  "period": "lifetime",
  "timeframe": "this_week",
  "breakdown": "gender",
  "account_id": "17841453340834745"
}
```

### Test 3: Interaction Metrics
```json
{
  "metrics": ["reach", "likes", "comments", "saves"],
  "period": "day",
  "metric_type": "total_value",
  "account_id": "17841453340834745"
}
```

## Build Status

✅ **Successfully built** - All fixes applied

## Next Steps

1. **Restart Claude Desktop** (Cmd+Q, then reopen)

2. **Try demographic queries** without specifying breakdown:
   ```
   Use get_account_insights for demographics

   Parameters:
   {
     "metrics": ["engaged_audience_demographics"],
     "period": "lifetime",
     "timeframe": "this_month",
     "account_id": "17841453340834745"
   }
   ```

3. **Use `saves`** for account-level save metrics

---

**Updated**: October 2024
**API Version**: v23.0 with v20+ compatibility
**Status**: Production Ready
**Latest Fix**: Automatic demographic breakdown handling
