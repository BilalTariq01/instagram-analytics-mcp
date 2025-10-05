# Instagram Analytics MCP Server - Setup Guide

This guide will walk you through setting up the Instagram Analytics MCP Server step by step.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting Up Instagram Business Account](#setting-up-instagram-business-account)
3. [Creating a Facebook App](#creating-a-facebook-app)
4. [Getting Your Access Token](#getting-your-access-token)
5. [Installing the MCP Server](#installing-the-mcp-server)
6. [Configuring MCP Clients](#configuring-mcp-clients)
7. [Testing Your Setup](#testing-your-setup)

## Prerequisites

### Required Accounts

- ✅ **Instagram Account** (must be Business or Creator account)
- ✅ **Facebook Page** (connected to your Instagram account)
- ✅ **Facebook Developer Account**

### Required Software

- ✅ **Node.js** (version 18 or higher)
- ✅ **npm** (comes with Node.js)
- ✅ **Git** (optional, for cloning the repository)

## Setting Up Instagram Business Account

### Step 1: Convert to Business Account

1. Open Instagram app on your phone
2. Go to your profile
3. Tap the menu (☰) → Settings
4. Tap "Account"
5. Tap "Switch to Professional Account"
6. Choose "Business" or "Creator"
7. Complete the setup process

### Step 2: Connect to Facebook Page

1. In Instagram app, go to Settings
2. Tap "Account" → "Linked Accounts"
3. Tap "Facebook"
4. Select or create a Facebook Page to connect
5. Confirm the connection

**Important**: Your Instagram account must be connected to a Facebook Page for the API to work.

## Creating a Facebook App

### Step 1: Access Facebook Developers

1. Go to [https://developers.facebook.com/](https://developers.facebook.com/)
2. Log in with your Facebook account
3. Click "My Apps" in the top right

### Step 2: Create New App

1. Click "Create App"
2. Select "Business" as the app type
3. Click "Next"
4. Fill in the details:
   - **App Name**: e.g., "Instagram Analytics Tool"
   - **App Contact Email**: Your email
   - **Business Account**: Select or create one
5. Click "Create App"

### Step 3: Add Instagram Product

1. In your app dashboard, find "Add Products"
2. Locate "Instagram" and click "Set Up"
3. You may need to add "Instagram Graph API" specifically
4. Complete any additional setup steps

## Getting Your Access Token

### Step 1: Use Graph API Explorer

1. In your Facebook App dashboard, go to **Tools** → **Graph API Explorer**
2. Or visit: [https://developers.facebook.com/tools/explorer/](https://developers.facebook.com/tools/explorer/)

### Step 2: Configure Explorer

1. Select your app from the "Facebook App" dropdown
2. Click "Generate Access Token"
3. You'll be prompted to grant permissions

### Step 3: Add Required Permissions

Select these permissions:
- ✅ `instagram_basic`
- ✅ `instagram_manage_insights`
- ✅ `pages_read_engagement`
- ✅ `pages_show_list`

Click "Generate Access Token" and approve the permissions.

### Step 4: Get Long-Lived Token

The token from Graph API Explorer expires in 1 hour. Convert it to a long-lived token (60 days):

1. Go to **Tools** → **Access Token Tool** in your app dashboard
2. Or use this curl command:

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

Replace:
- `YOUR_APP_ID`: Found in App Dashboard → Settings → Basic
- `YOUR_APP_SECRET`: Found in App Dashboard → Settings → Basic
- `YOUR_SHORT_LIVED_TOKEN`: The token from Graph API Explorer

The response will contain your long-lived token:
```json
{
  "access_token": "YOUR_LONG_LIVED_TOKEN",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

### Step 5: Get Your Instagram Account ID (Optional)

The server can auto-detect this, but you can find it manually:

1. In Graph API Explorer, use this query:
```
me/accounts
```

2. Find your Facebook Page ID from the response

3. Then query:
```
{PAGE_ID}?fields=instagram_business_account
```

4. The response contains your Instagram Business Account ID

## Installing the MCP Server

### Step 1: Download the Code

**Option A: Clone with Git**
```bash
git clone <repository-url>
cd mcp-instagram-analytics
```

**Option B: Download ZIP**
1. Download the repository as ZIP
2. Extract it
3. Open terminal in the extracted folder

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file:
```bash
nano .env
# or use any text editor
```

3. Add your credentials:
```env
INSTAGRAM_ACCESS_TOKEN=your_long_lived_token_here
INSTAGRAM_ACCOUNT_ID=your_account_id_here  # Optional
```

### Step 4: Build the Project

```bash
npm run build
```

You should see output like:
```
Successfully compiled TypeScript files to dist/
```

### Step 5: Test the Server

```bash
npm start
```

You should see:
```
Instagram Analytics MCP Server running on stdio
```

Press `Ctrl+C` to stop.

## Configuring MCP Clients

### For Claude Desktop

1. **Find the config file location**:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Edit the config file**:

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

**Important**: Replace `/absolute/path/to/mcp-instagram-analytics` with the actual full path to your installation.

3. **Restart Claude Desktop**

### For Other MCP Clients

Refer to your MCP client's documentation for adding servers. You'll typically need:
- **Command**: `node`
- **Args**: `["/path/to/dist/index.js"]`
- **Environment Variables**: `INSTAGRAM_ACCESS_TOKEN`

## Testing Your Setup

### Test 1: Get Profile Information

In your MCP client (e.g., Claude), try:

```
Use the get_user_profile tool to show me my Instagram profile information
```

Expected result: Your profile data including username, followers, etc.

### Test 2: Get Account Insights

```
Use get_account_insights to show me impressions and reach for the last day
```

Parameters:
```json
{
  "metrics": ["impressions", "reach"],
  "period": "day"
}
```

### Test 3: List Recent Media

```
Use list_media to show me my 5 most recent Instagram posts
```

Parameters:
```json
{
  "limit": 5
}
```

### Test 4: Get Media Insights

First, get a media ID from the previous test, then:

```
Use get_media_insights to analyze this post
```

Parameters:
```json
{
  "media_id": "your_media_id_here",
  "metrics": ["engagement", "impressions", "reach"]
}
```

## Troubleshooting

### Error: "INSTAGRAM_ACCESS_TOKEN environment variable is required"

**Solution**: Make sure your `.env` file exists and contains the access token, or that you've set it in your MCP client config.

### Error: "Access token is invalid"

**Solutions**:
1. Check if your token has expired
2. Verify you selected all required permissions
3. Generate a new long-lived token
4. Ensure you're using a User Access Token, not an App Access Token

### Error: "No Instagram Business account found"

**Solutions**:
1. Verify your Instagram account is set to Business or Creator
2. Check that your Instagram is connected to a Facebook Page
3. Ensure the Facebook Page is accessible with your token
4. Try disconnecting and reconnecting Instagram to Facebook Page

### Error: "Unsupported request"

**Solutions**:
1. Check that you're using the correct metric names
2. Verify your account type supports the requested metrics
3. For video metrics, ensure you're querying a video post

### Server doesn't start

**Solutions**:
1. Run `npm run build` again
2. Check for TypeScript errors
3. Verify Node.js version: `node --version` (should be 18+)
4. Delete `node_modules` and run `npm install` again

## Getting Help

If you're still having issues:

1. **Check the main README.md** for additional information
2. **Review Instagram Platform docs**: [https://developers.facebook.com/docs/instagram-platform](https://developers.facebook.com/docs/instagram-platform)
3. **Check Facebook Developer Community**: [https://developers.facebook.com/community/](https://developers.facebook.com/community/)
4. **Open an issue** in this repository with:
   - Error messages (remove sensitive tokens!)
   - Steps you've already tried
   - Your Node.js version
   - Your operating system

## Next Steps

Once everything is working:

1. **Explore all available tools** - Try each tool to understand what data you can access
2. **Build automations** - Use the MCP server to automate your analytics workflow
3. **Monitor regularly** - Set up regular checks of your key metrics
4. **Analyze trends** - Compare data over time to understand your growth

Happy analyzing! 📊
