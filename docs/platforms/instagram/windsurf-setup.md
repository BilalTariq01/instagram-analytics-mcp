# Setting Up Instagram Analytics MCP Server in Windsurf

Quick guide to add and run the Instagram Analytics MCP Server in Windsurf.

## Step 1: Get Your Access Token

### Quick Method (1-hour token for testing)
1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Click "Get Token" → "Get User Access Token"
3. Select permissions:
   - `instagram_basic`
   - `instagram_manage_insights`
   - `pages_read_engagement`
   - `pages_show_list`
4. Click "Generate Access Token"
5. **Copy the token**

### For Long-Term Use (60-day token)
See [SETUP_GUIDE.md](SETUP_GUIDE.md) for instructions on getting a long-lived token.

## Step 2: Build the Project

```bash
cd /Users/bilaltariq01/Documents/work/me/CascadeProjects/windsurf-project
npm install
npm run build
```

## Step 3: Configure Windsurf

1. In Windsurf, open the MCP config file:
   - Path: `~/.codeium/windsurf/mcp_config.json`
   - Or click the file icon in Windsurf's MCP panel

2. Click **"Edit"** and add this configuration:

```json
{
  "mcpServers": {
    "instagram-analytics": {
      "command": "node",
      "args": [
        "/Users/bilaltariq01/Documents/work/me/CascadeProjects/windsurf-project/dist/index.js"
      ],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "paste_your_token_here"
      }
    }
  }
}
```

3. Replace `"paste_your_token_here"` with your actual access token

4. **Save the file**

## Step 4: Restart Windsurf

Close and reopen Windsurf completely for the changes to take effect.

## Step 5: Test the Server

Once Windsurf restarts, try these commands:

### List Your Instagram Accounts
```
Use list_available_accounts to show me all my Instagram accounts
```

### Get Your Profile
```
Use get_user_profile to show my Instagram profile
```

### Get Weekly Insights
```
Use get_account_insights to show me impressions and reach for the last week

Parameters:
{
  "metrics": ["impressions", "reach"],
  "period": "week"
}
```

## Multiple Accounts?

If you have multiple Instagram Business accounts:

1. First, run `list_available_accounts` to see all your accounts
2. Copy the `id` of the account you want to use
3. Add it to your config:

```json
{
  "mcpServers": {
    "instagram-analytics": {
      "command": "node",
      "args": [
        "/Users/bilaltariq01/Documents/work/me/CascadeProjects/windsurf-project/dist/index.js"
      ],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "your_token_here",
        "INSTAGRAM_ACCOUNT_ID": "your_account_id_here"
      }
    }
  }
}
```

See [MULTIPLE_ACCOUNTS.md](MULTIPLE_ACCOUNTS.md) for detailed instructions.

## Available Tools

Once configured, you have access to 6 tools:

1. **list_available_accounts** - List all your Instagram accounts
2. **get_user_profile** - Get profile information
3. **get_account_insights** - Get account analytics
4. **list_media** - List recent posts
5. **get_media_insights** - Get post analytics
6. **get_media_details** - Get detailed post information

## Troubleshooting

### "Access token is invalid"
- Ensure you copied the complete token
- Check that all required permissions were selected
- The token might have expired (get a new one)

### "No Instagram Business account found"
- Ensure your Instagram is set to Business/Creator account
- Verify it's connected to a Facebook Page
- Check the connection in Instagram Settings

### Server doesn't start
- Run `npm run build` again
- Check that Node.js is installed: `node --version`
- Verify the path in the config is correct

### "Multiple Instagram accounts found"
- Run `list_available_accounts` to see all accounts
- Add the `INSTAGRAM_ACCOUNT_ID` to your config
- See [MULTIPLE_ACCOUNTS.md](MULTIPLE_ACCOUNTS.md) for help

## Quick Reference

### Config File Location
```
~/.codeium/windsurf/mcp_config.json
```

### Project Path
```
/Users/bilaltariq01/Documents/work/me/CascadeProjects/windsurf-project
```

### Build Command
```bash
npm run build
```

### Rebuild After Changes
```bash
cd /Users/bilaltariq01/Documents/work/me/CascadeProjects/windsurf-project
npm run build
```

## Next Steps

- Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for all available commands
- Check [examples/usage-examples.md](examples/usage-examples.md) for practical examples
- See [MULTIPLE_ACCOUNTS.md](MULTIPLE_ACCOUNTS.md) if you have multiple accounts
- Review [README.md](README.md) for complete documentation

## Need Help?

- **Setup Issues**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Multiple Accounts**: [MULTIPLE_ACCOUNTS.md](MULTIPLE_ACCOUNTS.md)
- **Quick Commands**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Examples**: [examples/usage-examples.md](examples/usage-examples.md)

---

**You're all set!** Start analyzing your Instagram data with Cascade in Windsurf! 🚀
