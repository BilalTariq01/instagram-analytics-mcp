# Debugging & Logging Guide

This guide explains how to debug and view logs for the Instagram Analytics MCP Server.

## Viewing MCP Server Logs

### Claude Desktop (macOS)

#### Real-time Logs
```bash
# Watch logs as they happen
tail -f ~/Library/Logs/Claude/mcp*.log

# Watch with timestamps
tail -f ~/Library/Logs/Claude/mcp*.log | while read line; do echo "$(date): $line"; done
```

#### View All Logs
```bash
# View all MCP logs
cat ~/Library/Logs/Claude/mcp*.log

# View logs with less (scrollable)
less ~/Library/Logs/Claude/mcp*.log

# Search for specific errors
grep -i "error" ~/Library/Logs/Claude/mcp*.log

# View last 100 lines
tail -n 100 ~/Library/Logs/Claude/mcp*.log
```

#### Log Locations
```
~/Library/Logs/Claude/mcp.log
~/Library/Logs/Claude/mcp-server-instagram-analytics.log
```

### Claude Desktop (Windows)
```
%APPDATA%\Claude\logs\mcp*.log
```

### Windsurf

Windsurf logs are typically shown in:
1. The IDE's output panel
2. Terminal where you run the server

```bash
# Check Windsurf logs
~/.codeium/windsurf/logs/
```

## Manual Testing

### Test the Server Directly

```bash
cd /Users/bilaltariq01/Documents/work/me/CascadeProjects/windsurf-project

# Run the server
node dist/index.js
```

You should see:
```
Instagram Analytics MCP Server running on stdio
```

### Test with Input

Create a test file `test-request.json`:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

Then test:
```bash
cat test-request.json | node dist/index.js
```

## Common Issues & Solutions

### Issue 1: "Invalid argument" Error

**Symptom**: Error about invalid_argument from MCP server

**Cause**: Tool schema has invalid properties (like `default` values)

**Solution**: 
- Removed `default` from schema properties
- Rebuild: `npm run build`
- Restart Claude Desktop

### Issue 2: "Access token is invalid"

**Check logs for**:
```bash
grep -i "access token" ~/Library/Logs/Claude/mcp*.log
```

**Solution**:
- Verify token in config file
- Generate new token if expired
- Check token has correct permissions

### Issue 3: Server Not Starting

**Check logs**:
```bash
tail -n 50 ~/Library/Logs/Claude/mcp*.log
```

**Common causes**:
- Node.js not installed
- Wrong path in config
- Missing dependencies

**Solution**:
```bash
# Check Node.js
node --version

# Reinstall dependencies
cd /Users/bilaltariq01/Documents/work/me/CascadeProjects/windsurf-project
npm install

# Rebuild
npm run build
```

### Issue 4: "Multiple Instagram accounts found"

**Check logs**:
```bash
grep -i "multiple" ~/Library/Logs/Claude/mcp*.log
```

**Solution**: Pass `account_id` parameter in your tool calls

## Adding Debug Logging

### Temporary Debug Logging

Edit `src/index.ts` to add debug output:

```typescript
// At the top of tool handlers
console.error('DEBUG: Tool called:', name);
console.error('DEBUG: Arguments:', JSON.stringify(args, null, 2));

// Before API calls
console.error('DEBUG: Calling Instagram API...');

// After API calls
console.error('DEBUG: API Response received');
```

**Note**: Use `console.error()` not `console.log()` - stderr is used for logging in MCP servers.

### Rebuild After Adding Logs
```bash
npm run build
```

### View Your Debug Logs
```bash
tail -f ~/Library/Logs/Claude/mcp*.log | grep DEBUG
```

## Testing Individual Tools

### Test list_available_accounts

In Claude Desktop:
```
Use list_available_accounts
```

Check logs:
```bash
grep -A 20 "list_available_accounts" ~/Library/Logs/Claude/mcp*.log
```

### Test get_user_profile

```
Use get_user_profile with account_id 17841471286039698
```

Check logs:
```bash
grep -A 20 "get_user_profile" ~/Library/Logs/Claude/mcp*.log
```

## Restart MCP Server

### Claude Desktop
1. Quit Claude Desktop completely (Cmd+Q)
2. Reopen Claude Desktop
3. MCP servers restart automatically

### Windsurf
1. Close Windsurf
2. Reopen Windsurf
3. Or reload window: Cmd+Shift+P → "Reload Window"

## Verify Configuration

### Check Config File
```bash
# Claude Desktop
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Windsurf
cat ~/.codeium/windsurf/mcp_config.json
```

### Verify Path
```bash
# Check if dist/index.js exists
ls -la /Users/bilaltariq01/Documents/work/me/CascadeProjects/windsurf-project/dist/index.js

# Check if it's executable
node /Users/bilaltariq01/Documents/work/me/CascadeProjects/windsurf-project/dist/index.js
```

## Environment Variables

### Check if Token is Set

In your config file, verify:
```json
{
  "env": {
    "INSTAGRAM_ACCESS_TOKEN": "your_token_here"
  }
}
```

### Test Token Manually

```bash
# Test with curl
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_TOKEN"
```

## Error Messages Reference

### "INSTAGRAM_ACCESS_TOKEN environment variable is required"
- Token not set in config
- Check config file syntax

### "No Facebook pages found"
- Token doesn't have access to pages
- Regenerate token with correct permissions

### "No Instagram Business account found"
- Instagram not connected to Facebook page
- Account not Business/Creator type

### "Failed to get account ID"
- API error
- Check logs for detailed error message

### "Multiple Instagram accounts found"
- You have multiple accounts
- Pass `account_id` parameter

## Performance Monitoring

### Check API Call Times

Add timing logs:
```typescript
const start = Date.now();
const result = await instagramClient.getAccountInsights(...);
console.error(`DEBUG: API call took ${Date.now() - start}ms`);
```

### Monitor Rate Limits

Instagram API limits: 200 calls/hour

Add counter:
```typescript
let apiCallCount = 0;
// In each API call
apiCallCount++;
console.error(`DEBUG: API calls this session: ${apiCallCount}`);
```

## Advanced Debugging

### Enable Verbose Logging

Set environment variable:
```json
{
  "env": {
    "INSTAGRAM_ACCESS_TOKEN": "token",
    "DEBUG": "true"
  }
}
```

Then in code:
```typescript
if (process.env.DEBUG === 'true') {
  console.error('DEBUG:', ...);
}
```

### Capture Network Traffic

Use a proxy to see API requests:
```bash
# Install mitmproxy
brew install mitmproxy

# Run proxy
mitmproxy -p 8080

# Configure axios to use proxy (in instagram-client.ts)
proxy: {
  host: 'localhost',
  port: 8080
}
```

## Quick Troubleshooting Checklist

- [ ] Server builds successfully (`npm run build`)
- [ ] Config file has correct path
- [ ] Access token is valid and not expired
- [ ] Node.js is installed (v18+)
- [ ] Dependencies are installed (`npm install`)
- [ ] Claude Desktop/Windsurf has been restarted
- [ ] Logs show server starting
- [ ] No error messages in logs

## Getting Help

If issues persist:

1. **Collect logs**:
   ```bash
   tail -n 200 ~/Library/Logs/Claude/mcp*.log > mcp-logs.txt
   ```

2. **Check build output**:
   ```bash
   npm run build 2>&1 | tee build-output.txt
   ```

3. **Test server manually**:
   ```bash
   node dist/index.js 2>&1 | tee server-output.txt
   ```

4. **Share**:
   - mcp-logs.txt
   - build-output.txt
   - server-output.txt
   - Your config file (remove sensitive tokens!)

## Summary

**Quick Commands**:
```bash
# View logs
tail -f ~/Library/Logs/Claude/mcp*.log

# Rebuild
cd /Users/bilaltariq01/Documents/work/me/CascadeProjects/windsurf-project && npm run build

# Test server
node dist/index.js

# Check config
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Remember**: Always restart Claude Desktop after making changes!
