# Quick Start Guide

Get started with Instagram Analytics in 2 minutes!

## Your Accounts

You have 3 Instagram accounts available:

1. **Merrakii Education** (@merrakii_edu)
   - ID: `17841471286039698`

2. **Beautiful Earth** (@mybeautifulearth1)
   - ID: `17841453340834745`

3. **Topviewsports** (@topviewsport)
   - ID: `17841454628238556`

## How to Use

### Step 1: List All Accounts (Required First Step)

```
Use list_available_accounts
```

This shows all your Instagram accounts with their IDs. **You must do this first to get your account IDs.**

### Step 2: Analyze Any Account

**Important**: All tools now require the `account_id` parameter. You must specify which account to analyze.

## Examples

### Get Profile Information

```
Use get_user_profile for Merrakii Education

Parameters:
{
  "account_id": "17841471286039698"
}
```

### Get Account Insights

```
Use get_account_insights for Beautiful Earth

Parameters:
{
  "metrics": ["impressions", "reach", "follower_count"],
  "period": "week",
  "account_id": "17841453340834745"
}
```

### List Recent Posts

```
Use list_media for Topviewsports

Parameters:
{
  "limit": 10,
  "account_id": "17841454628238556"
}
```

### Get Media Insights

First, get the media ID from `list_media`, then:

```
Use get_media_insights

Parameters:
{
  "media_id": "your_media_id_here",
  "metrics": ["views", "likes", "comments", "saved"]
}
```

For Reels:
```
{
  "media_id": "your_reel_id",
  "metrics": ["views", "reach", "total_interactions", "shares", "avg_time_watched"]
}
```

## Available Metrics

### Account Metrics
- `impressions` - Total views
- `reach` - Unique accounts reached
- `profile_views` - Profile visits
- `follower_count` - Current followers
- `email_contacts` - Email button clicks
- `phone_call_clicks` - Call button clicks
- `text_message_clicks` - Text button clicks
- `get_directions_clicks` - Directions clicks
- `website_clicks` - Website link clicks

### Media Metrics
- `engagement` - Total interactions
- `impressions` - Total views
- `reach` - Unique accounts reached
- `saved` - Number of saves
- `video_views` - Video views (videos only)
- `likes` - Like count
- `comments` - Comment count
- `shares` - Share count

### Time Periods
- `day` - Last 24 hours
- `week` - Last 7 days
- `days_28` - Last 28 days

## Common Workflows

### Weekly Report for One Account

```
# 1. Get profile info
Use get_user_profile with account_id 17841471286039698

# 2. Get weekly insights
Use get_account_insights with:
{
  "metrics": ["impressions", "reach", "profile_views", "follower_count"],
  "period": "week",
  "account_id": "17841471286039698"
}

# 3. Get recent posts
Use list_media with:
{
  "limit": 10,
  "account_id": "17841471286039698"
}
```

### Compare All Accounts

```
# Get insights for each account
Use get_account_insights for account 17841471286039698
Use get_account_insights for account 17841453340834745
Use get_account_insights for account 17841454628238556

# Compare the results
```

### Analyze Top Posts

```
# 1. List recent posts
Use list_media with account_id 17841471286039698

# 2. Get insights for top posts
Use get_media_insights for each post's media_id
```

## Tips

1. **Save Account IDs**: Keep this guide handy for quick reference to your account IDs

2. **Use Descriptive Names**: When asking, mention the account name (e.g., "Merrakii Education")

3. **Batch Requests**: Analyze multiple accounts in one conversation

4. **Check Logs**: If something goes wrong, check logs:
   ```bash
   tail -f ~/Library/Logs/Claude/mcp*.log
   ```

## Troubleshooting

### "Multiple Instagram accounts found"

**Solution**: Add the `account_id` parameter to your request.

**Example**:
```json
{
  "account_id": "17841471286039698"
}
```

### "Access token is invalid"

**Solution**: Token may have expired. Generate a new one from Facebook Graph API Explorer.

### Server not responding

**Solution**: Restart Claude Desktop (Cmd+Q, then reopen).

## Next Steps

- Read [DYNAMIC_ACCOUNT_SELECTION.md](DYNAMIC_ACCOUNT_SELECTION.md) for advanced usage
- Check [DEBUGGING.md](DEBUGGING.md) for troubleshooting
- See [examples/usage-examples.md](examples/usage-examples.md) for more examples

---

**Ready to analyze!** Just remember to include the `account_id` parameter since you have multiple accounts. 🚀
