# Dynamic Account Selection

The Instagram Analytics MCP Server now supports **dynamic account selection** - you can analyze any of your Instagram accounts without changing environment variables!

## How It Works

All tools now accept an optional `account_id` parameter. You can:
- **Omit the parameter**: Uses the default account (or prompts if multiple exist)
- **Specify an account_id**: Analyzes that specific account

## Quick Start

### Step 1: List Your Accounts

```
Use list_available_accounts to show all my Instagram accounts
```

**Response:**
```json
[
  {
    "id": "17841471286039698",
    "username": "merrakii_edu",
    "name": "Merrakii Education",
    "pageId": "123456789",
    "pageName": "Merrakii Page"
  },
  {
    "id": "17841453340834745",
    "username": "mybeautifulearth1",
    "name": "Beautiful Earth",
    "pageId": "987654321",
    "pageName": "Beautiful Earth Page"
  },
  {
    "id": "17841454628238556",
    "username": "topviewsport",
    "name": "Topviewsports",
    "pageId": "456789123",
    "pageName": "Topview Page"
  }
]
```

### Step 2: Analyze Any Account

Now you can analyze any account by passing its `id`:

#### Get Profile for Specific Account

```
Use get_user_profile for account 17841471286039698
```

Or with parameters:
```json
{
  "account_id": "17841471286039698"
}
```

#### Get Insights for Specific Account

```
Use get_account_insights for Merrakii Education account

Parameters:
{
  "metrics": ["impressions", "reach", "follower_count"],
  "period": "week",
  "account_id": "17841471286039698"
}
```

#### List Media for Specific Account

```
Use list_media for Beautiful Earth account

Parameters:
{
  "limit": 10,
  "account_id": "17841453340834745"
}
```

## All Tools Support account_id

### 1. list_available_accounts
No parameters needed - always shows all accounts.

### 2. get_user_profile
```json
{
  "account_id": "17841471286039698"  // Optional
}
```

### 3. get_account_insights
```json
{
  "metrics": ["impressions", "reach"],
  "period": "week",
  "account_id": "17841471286039698"  // Optional
}
```

### 4. list_media
```json
{
  "limit": 25,
  "account_id": "17841471286039698"  // Optional
}
```

### 5. get_media_insights
```json
{
  "media_id": "media_id_here",
  "metrics": ["engagement", "impressions"]
  // Note: media_id already identifies the account
}
```

### 6. get_media_details
```json
{
  "media_id": "media_id_here"
  // Note: media_id already identifies the account
}
```

## Use Cases

### Compare Multiple Accounts

```
# Get insights for Account 1
Use get_account_insights with account_id 17841471286039698

# Get insights for Account 2
Use get_account_insights with account_id 17841453340834745

# Compare the results
```

### Analyze Different Accounts in Same Session

```
# Check Merrakii Education profile
Use get_user_profile for account 17841471286039698

# Check Beautiful Earth recent posts
Use list_media for account 17841453340834745

# Check Topviewsports insights
Use get_account_insights for account 17841454628238556
```

### Agency Workflow

```
1. List all client accounts
2. For each client:
   - Get profile info
   - Get weekly insights
   - Get top posts
   - Generate report
3. All without changing configuration!
```

## Benefits

✅ **No Configuration Changes**: Switch between accounts instantly
✅ **Multiple Accounts in One Session**: Analyze different accounts without restarting
✅ **Flexible**: Use default account or specify any account
✅ **Perfect for Agencies**: Manage multiple client accounts easily
✅ **Simple**: Just pass the account_id parameter

## Examples

### Example 1: Weekly Report for All Accounts

```
# Get list of accounts
Use list_available_accounts

# For each account, get weekly insights
Use get_account_insights with:
{
  "metrics": ["impressions", "reach", "profile_views"],
  "period": "week",
  "account_id": "17841471286039698"
}

# Repeat for other accounts
```

### Example 2: Compare Follower Growth

```
# Merrakii Education
Use get_account_insights with:
{
  "metrics": ["follower_count"],
  "period": "days_28",
  "account_id": "17841471286039698"
}

# Beautiful Earth
Use get_account_insights with:
{
  "metrics": ["follower_count"],
  "period": "days_28",
  "account_id": "17841453340834745"
}

# Topviewsports
Use get_account_insights with:
{
  "metrics": ["follower_count"],
  "period": "days_28",
  "account_id": "17841454628238556"
}
```

### Example 3: Content Performance Across Accounts

```
# Get recent posts from each account
Use list_media for account 17841471286039698
Use list_media for account 17841453340834745
Use list_media for account 17841454628238556

# Analyze top post from each
Use get_media_insights for each top post
```

## Default Behavior

If you **don't** specify an `account_id`:

- **Single Account**: Automatically uses that account
- **Multiple Accounts**: Shows error with list of available accounts

## Configuration

### Environment Variables

You only need the access token:

```env
INSTAGRAM_ACCESS_TOKEN=your_token_here
```

**No need for INSTAGRAM_ACCOUNT_ID** - it's now optional!

### MCP Config (Windsurf/Claude)

```json
{
  "mcpServers": {
    "instagram-analytics": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

That's it! No account ID needed in config.

## Tips

1. **Save Account IDs**: Keep a note of your account IDs for quick reference
2. **Use Descriptive Names**: When asking, use account names (e.g., "Merrakii Education")
3. **Batch Analysis**: Analyze multiple accounts in one conversation
4. **Compare Metrics**: Easy to compare performance across accounts

## Migration from Old Version

If you were using `INSTAGRAM_ACCOUNT_ID` environment variable:

**Before:**
```env
INSTAGRAM_ACCESS_TOKEN=token
INSTAGRAM_ACCOUNT_ID=17841471286039698  # Had to change this to switch accounts
```

**After:**
```env
INSTAGRAM_ACCESS_TOKEN=token
# No INSTAGRAM_ACCOUNT_ID needed!
```

Now just pass `account_id` in your tool calls!

## Summary

The Instagram Analytics MCP Server now provides **ultimate flexibility** for multi-account management:

- 🎯 **Dynamic Selection**: Choose account per request
- 🚀 **No Restarts**: Switch accounts instantly
- 💼 **Agency-Ready**: Perfect for managing multiple clients
- 🔄 **Backward Compatible**: Still works with single accounts
- ✨ **Simple**: Just add `account_id` parameter

Start analyzing all your Instagram accounts with ease! 🎉
