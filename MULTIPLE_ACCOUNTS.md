# Managing Multiple Instagram Accounts

This guide explains how to work with multiple Instagram Business accounts using the Instagram Analytics MCP Server.

## Overview

The MCP server now supports multiple Instagram accounts! Here's how it works:

- **Single Account**: Automatically detected and used
- **Multiple Accounts**: Lists all available accounts and prompts you to select one

## How It Works

### Automatic Detection

When you start the server without specifying an `INSTAGRAM_ACCOUNT_ID`:

1. **One Account Found**: The server automatically uses it
2. **Multiple Accounts Found**: The server shows you all available accounts and asks you to choose

### Discovering Your Accounts

Use the `list_available_accounts` tool to see all Instagram Business accounts connected to your Facebook pages.

## Step-by-Step Guide

### Step 1: List Your Accounts

In Windsurf or your MCP client, use the tool:

```
Use list_available_accounts to show me all my Instagram accounts
```

**Example Response**:
```json
[
  {
    "id": "17841405309211844",
    "username": "my_business",
    "name": "My Business Account",
    "pageId": "123456789",
    "pageName": "My Business Page"
  },
  {
    "id": "17841405309211999",
    "username": "my_personal_brand",
    "name": "Personal Brand",
    "pageId": "987654321",
    "pageName": "Personal Brand Page"
  }
]
```

### Step 2: Choose an Account

Copy the `id` of the account you want to use.

### Step 3: Configure the Account ID

#### For Windsurf

Edit your MCP config file (`~/.codeium/windsurf/mcp_config.json`):

```json
{
  "mcpServers": {
    "instagram-analytics": {
      "command": "node",
      "args": [
        "/path/to/mcp-instagram-analytics/dist/index.js"
      ],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "your_token_here",
        "INSTAGRAM_ACCOUNT_ID": "17841405309211844"
      }
    }
  }
}
```

#### For Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "instagram-analytics": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "your_token_here",
        "INSTAGRAM_ACCOUNT_ID": "17841405309211844"
      }
    }
  }
}
```

#### Using .env File

Edit your `.env` file:

```env
INSTAGRAM_ACCESS_TOKEN=your_token_here
INSTAGRAM_ACCOUNT_ID=17841405309211844
```

### Step 4: Restart

Restart Windsurf or your MCP client for the changes to take effect.

## Switching Between Accounts

To switch to a different account:

1. Run `list_available_accounts` again to see all accounts
2. Copy the ID of the account you want to switch to
3. Update the `INSTAGRAM_ACCOUNT_ID` in your config
4. Restart the MCP client

## Use Cases

### Managing Multiple Businesses

If you manage multiple business accounts:

```json
// Account 1: Main Business
{
  "id": "17841405309211844",
  "username": "main_business",
  "name": "Main Business"
}

// Account 2: Side Project
{
  "id": "17841405309211999",
  "username": "side_project",
  "name": "Side Project"
}
```

**Workflow**:
1. Set `INSTAGRAM_ACCOUNT_ID` to main business ID
2. Analyze main business metrics
3. Switch to side project ID
4. Analyze side project metrics
5. Compare results

### Agency Use Case

If you're an agency managing client accounts:

1. Keep a list of client account IDs
2. Switch between accounts as needed
3. Generate reports for each client
4. Compare performance across clients

### Personal + Business

If you have both personal and business accounts:

```json
// Personal Brand
{
  "id": "17841405309211844",
  "username": "john_doe_personal",
  "name": "John Doe"
}

// Business Account
{
  "id": "17841405309211999",
  "username": "john_doe_business",
  "name": "John Doe Consulting"
}
```

## Error Messages

### "Multiple Instagram accounts found"

**Error**:
```
Multiple Instagram accounts found. Please set INSTAGRAM_ACCOUNT_ID in your environment to one of:

1. @my_business (My Business Account) - Page: My Business Page
2. @my_personal_brand (Personal Brand) - Page: Personal Brand Page

Account IDs:
1. 17841405309211844
2. 17841405309211999
```

**Solution**: Set the `INSTAGRAM_ACCOUNT_ID` environment variable to one of the listed IDs.

### "No Instagram Business accounts found"

**Possible Causes**:
- No Instagram accounts connected to your Facebook pages
- Instagram accounts are not Business or Creator accounts
- Access token doesn't have proper permissions

**Solution**:
1. Convert Instagram accounts to Business/Creator accounts
2. Connect them to Facebook pages
3. Ensure access token has required permissions

## Best Practices

### 1. Document Your Accounts

Keep a reference file with your account IDs:

```
# My Instagram Accounts

Main Business: 17841405309211844 (@main_business)
Side Project: 17841405309211999 (@side_project)
Personal: 17841405309212000 (@personal_account)
```

### 2. Use Descriptive Names

When setting up Facebook pages, use clear names to easily identify accounts.

### 3. Test Access

After switching accounts, run `get_user_profile` to verify you're using the correct account:

```
Use get_user_profile to confirm which account I'm using
```

### 4. Separate Configs for Different Accounts

If you frequently switch between accounts, consider creating separate MCP server instances:

```json
{
  "mcpServers": {
    "instagram-main-business": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "token",
        "INSTAGRAM_ACCOUNT_ID": "17841405309211844"
      }
    },
    "instagram-side-project": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "token",
        "INSTAGRAM_ACCOUNT_ID": "17841405309211999"
      }
    }
  }
}
```

Then you can access both accounts simultaneously!

## Troubleshooting

### Account Not Showing Up

**Check**:
1. Is it a Business or Creator account?
2. Is it connected to a Facebook page?
3. Does your access token have access to that page?

### Wrong Account Being Used

**Solution**:
1. Run `list_available_accounts`
2. Verify the `INSTAGRAM_ACCOUNT_ID` in your config
3. Restart the MCP client

### Can't Access Certain Accounts

**Possible Cause**: Access token permissions

**Solution**:
1. Regenerate access token
2. Ensure you select all required permissions
3. Make sure you have admin access to all Facebook pages

## FAQ

**Q: Can I use multiple accounts at the same time?**
A: Yes! Create separate MCP server instances with different account IDs (see Best Practices #4).

**Q: Do I need different access tokens for different accounts?**
A: No, one access token can access all accounts you have permissions for.

**Q: How do I know which account I'm currently using?**
A: Run `get_user_profile` to see the current account's username and details.

**Q: Can I switch accounts without restarting?**
A: No, you need to restart the MCP client after changing the account ID.

**Q: What if I only have one account?**
A: The server will automatically use it - no configuration needed!

## Summary

The Instagram Analytics MCP Server makes it easy to work with multiple accounts:

- ✅ Automatic detection for single accounts
- ✅ Easy listing of all available accounts
- ✅ Simple configuration to select an account
- ✅ Support for multiple simultaneous instances
- ✅ Clear error messages when selection is needed

For most users with a single account, everything works automatically. For users with multiple accounts, it's just a matter of setting one environment variable!
