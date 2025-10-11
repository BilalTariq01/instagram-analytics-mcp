# Get Started in 5 Minutes

The fastest way to get your Instagram Analytics MCP Server up and running.

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] Instagram Business or Creator account
- [ ] Facebook Page connected to your Instagram
- [ ] Facebook Developer account
- [ ] Node.js 18+ installed
- [ ] 10 minutes of time

## Step 1: Get Your Access Token (5 min)

### Quick Method

1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Click "Get Token" → "Get User Access Token"
3. Select these permissions:
   - `instagram_basic`
   - `instagram_manage_insights`
   - `pages_read_engagement`
   - `pages_show_list`
4. Click "Generate Access Token"
5. **Copy the token** (you'll need it in Step 3)

> ⚠️ **Important**: This token expires in 1 hour. For long-term use, see [SETUP_GUIDE.md](SETUP_GUIDE.md) to get a 60-day token.

## Step 2: Install the Server (2 min)

```bash
# Clone or download this repository
cd mcp-instagram-analytics

# Install dependencies
npm install

# Build the project
npm run build
```

## Step 3: Configure (1 min)

```bash
# Create environment file
cp .env.example .env

# Edit .env and add your token
# Replace YOUR_TOKEN_HERE with the token from Step 1
echo "INSTAGRAM_ACCESS_TOKEN=YOUR_TOKEN_HERE" > .env
```

Or manually edit `.env`:
```env
INSTAGRAM_ACCESS_TOKEN=your_actual_token_here
```

## Step 4: Test It (1 min)

```bash
# Start the server
npm start
```

You should see:
```
Instagram Analytics MCP Server running on stdio
```

Press `Ctrl+C` to stop.

✅ **Success!** Your server is working.

## Step 5: Connect to Claude Desktop (1 min)

### macOS

1. Open this file in a text editor:
   ```
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```

2. Add this configuration (replace `/path/to/` with your actual path):
   ```json
   {
     "mcpServers": {
       "instagram-analytics": {
         "command": "node",
         "args": ["/absolute/path/to/mcp-instagram-analytics/dist/index.js"],
         "env": {
           "INSTAGRAM_ACCESS_TOKEN": "your_token_here"
         }
       }
     }
   }
   ```

3. Restart Claude Desktop

### Windows

1. Open this file:
   ```
   %APPDATA%/Claude/claude_desktop_config.json
   ```

2. Add the same configuration (use Windows paths)

3. Restart Claude Desktop

## Step 6: Try It Out!

In Claude Desktop, try these commands:

### Get Your Profile
```
Use the get_user_profile tool to show my Instagram profile
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

### List Recent Posts
```
Use list_media to show my 5 most recent posts

Parameters:
{
  "limit": 5
}
```

## Common Issues

### "Access token is invalid"
- Make sure you copied the entire token
- Check that you selected all required permissions
- The token might have expired (get a new one)

### "No Instagram Business account found"
- Ensure your Instagram is set to Business/Creator account
- Verify it's connected to a Facebook Page
- Check the connection in Instagram Settings

### "Command not found: node"
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installing

### Server doesn't start
- Run `npm run build` again
- Check for error messages
- Make sure `.env` file exists with your token

## What's Next?

Now that it's working:

1. **Get a long-lived token** (60 days instead of 1 hour)
   - See [SETUP_GUIDE.md](SETUP_GUIDE.md) for instructions

2. **Explore all features**
   - Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for all available tools
   - Check [examples/usage-examples.md](examples/usage-examples.md) for ideas

3. **Understand the data**
   - See [README.md](README.md) for detailed documentation
   - Review Instagram's [Insights documentation](https://developers.facebook.com/docs/instagram-platform/insights)

## Quick Tips

### Save Time
- Use `npm run watch` during development (auto-rebuilds on changes)
- Keep your access token in the MCP client config for easy updates

### Get Better Insights
- Request only the metrics you need (faster responses)
- Use appropriate time periods (day/week/days_28)
- Check insights regularly for trends

### Avoid Rate Limits
- Instagram allows 200 API calls per hour
- Don't request the same data repeatedly
- Batch your requests when possible

## Need Help?

- **Quick answers**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Setup problems**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Full documentation**: [README.md](README.md)
- **Examples**: [examples/usage-examples.md](examples/usage-examples.md)
- **Technical details**: [ARCHITECTURE.md](ARCHITECTURE.md)

## You're All Set! 🎉

You now have a working Instagram Analytics MCP Server. Start exploring your Instagram data and building insights!

---

**Estimated total time**: 10 minutes
**Difficulty**: Beginner-friendly
**Cost**: Free (uses Instagram's free API)
