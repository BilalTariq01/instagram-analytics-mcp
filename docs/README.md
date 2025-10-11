# Social Analytics MCP Server

A comprehensive MCP (Model Context Protocol) server providing analytics and insights for multiple social media platforms. Currently supports Instagram with extensible architecture for additional platforms.

## 🚀 Features

- **Multi-Platform Support**: Instagram analytics with extensible architecture for TikTok, Twitter, LinkedIn, etc.
- **Instagram Analytics**: Complete account and media insights using Instagram Graph API v23.0
- **Advanced Filtering**: Time-based analysis, demographic breakdowns, content performance metrics
- **MCP Protocol**: Full Model Context Protocol compliance for AI assistants
- **Type-Safe**: Complete TypeScript implementation with strict typing
- **Production Ready**: Comprehensive error handling and logging

## 📁 Project Structure

```
social-analytics-mcp/
├── src/                          # Main entry point
│   └── index.ts                  # Multi-platform server dispatcher
├── platforms/                    # Platform-specific implementations
│   ├── instagram/                # Instagram platform
│   │   ├── client.ts            # Instagram API client
│   │   ├── server.ts            # Instagram MCP server
│   │   └── types.ts             # Instagram-specific types
│   └── shared/                   # Cross-platform utilities
├── docs/                         # All documentation
│   ├── README.md                 # Main project README (this file)
│   ├── guides/                   # User guides
│   │   ├── getting-started.md   # Quick start guide
│   │   ├── setup-guide.md       # Detailed setup
│   │   ├── debugging.md         # Troubleshooting
│   │   └── multiple-accounts.md # Multi-account usage
│   ├── api/                      # API documentation
│   │   ├── metrics-guide.md     # Account metrics reference
│   │   ├── media-metrics-guide.md # Media metrics reference
│   │   ├── api-fixes.md         # API compatibility fixes
│   │   └── api-v23-guide.md     # API v23.0 guide
│   ├── platforms/                # Platform-specific docs
│   │   └── instagram/            # Instagram docs
│   │       ├── dynamic-account-selection.md
│   │       ├── architecture.md
│   │       └── windsurf-setup.md
│   └── development/              # Development docs
│       ├── architecture.md       # System architecture
│       ├── changelog.md          # Version history
│       ├── completion-summary.md # Development summary
│       ├── contributing.md       # Contribution guidelines
│       └── project-summary.md    # Project overview
├── examples/                     # Usage examples
├── dist/                         # Compiled output
├── .env                          # Environment variables
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── LICENSE                       # MIT License
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Instagram Business or Creator account
- Facebook Developer App with Instagram permissions

### Setup

1. **Clone and install:**
   ```bash
   git clone <repository>
   cd social-analytics-mcp
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Instagram access token
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Configure Claude Desktop:**
   ```json
   {
     "mcpServers": {
       "social-analytics": {
         "command": "node",
         "args": ["/path/to/social-analytics-mcp/dist/index.js"],
         "env": {
           "INSTAGRAM_ACCESS_TOKEN": "your_token_here"
         }
       }
     }
   }
   ```

## 📊 Supported Platforms

### Instagram ✅
Complete Instagram Business/Creator analytics including:

**Account Insights:**
- Reach, engagement, follower demographics
- Content performance metrics
- Audience demographics by age, country, gender
- Follow/unfollow tracking
- Profile interaction analytics

**Media Insights:**
- Post, Story, and Reel analytics
- Content performance by media type
- Engagement metrics and trends
- View tracking and demographics

**Tools Available:**
- `list_available_accounts` - List connected Instagram accounts
- `get_user_profile` - Get account profile information
- `get_account_insights` - Comprehensive account analytics
- `list_media` - List recent posts and media
- `get_media_insights` - Detailed post performance
- `get_media_details` - Media metadata and details

### Future Platforms 🚧
- TikTok Analytics
- Twitter/X Analytics
- LinkedIn Analytics
- YouTube Analytics
- Facebook Page Analytics

## 🎯 Quick Start

### 1. Get Account IDs
```bash
# List all your Instagram accounts
Use list_available_accounts
```

### 2. Basic Profile Info
```json
{
  "account_id": "17841453340834745"
}
```

### 3. Account Insights
```json
{
  "metrics": ["reach", "likes", "comments", "views"],
  "period": "day",
  "account_id": "17841453340834745"
}
```

### 4. Demographic Analysis
```json
{
  "metrics": ["engaged_audience_demographics"],
  "period": "lifetime",
  "timeframe": "this_month",
  "account_id": "17841453340834745"
}
```

### 5. Media Analysis
```json
{
  "limit": 10,
  "account_id": "17841453340834745"
}
```

## 🔧 Configuration

### Environment Variables

```bash
# Required
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token

# Optional
SOCIAL_PLATFORM=instagram  # Default platform
```

### Platform Selection

Set the `SOCIAL_PLATFORM` environment variable to switch platforms:

```bash
# For Instagram (default)
SOCIAL_PLATFORM=instagram

# Future platforms
SOCIAL_PLATFORM=tiktok
SOCIAL_PLATFORM=twitter
```

## 📚 Documentation

### User Guides
- **[Getting Started](docs/guides/getting-started.md)** - Quick start guide
- **[Setup Guide](docs/guides/setup-guide.md)** - Detailed installation
- **[Multiple Accounts](docs/guides/multiple-accounts.md)** - Managing multiple accounts
- **[Debugging](docs/guides/debugging.md)** - Troubleshooting guide

### API Reference
- **[Account Metrics](docs/api/metrics-guide.md)** - Complete metrics reference
- **[Media Metrics](docs/api/media-metrics-guide.md)** - Content performance metrics
- **[API v23.0 Guide](docs/api/api-v23-guide.md)** - Latest API features
- **[API Fixes](docs/api/api-fixes.md)** - Compatibility updates

### Development
- **[Architecture](docs/development/architecture.md)** - System design
- **[Contributing](docs/development/contributing.md)** - Development guidelines
- **[Changelog](docs/development/changelog.md)** - Version history

## 🏗️ Architecture

### Multi-Platform Design

The server uses a modular architecture where each platform implements its own:

- **Client**: API integration and data fetching
- **Server**: MCP tool definitions and request handling
- **Types**: Platform-specific type definitions

### Adding New Platforms

1. Create platform directory: `platforms/{platform}/`
2. Implement client, server, and types
3. Export server creation function
4. Update main dispatcher in `src/index.ts`

Example structure for new platform:
```
platforms/tiktok/
├── client.ts      # TikTok API client
├── server.ts      # TikTok MCP server
└── types.ts       # TikTok-specific types
```

## 🤝 Contributing

### Adding a New Platform

1. **Fork and clone:**
   ```bash
   git clone <your-fork>
   cd social-analytics-mcp
   ```

2. **Create platform structure:**
   ```bash
   mkdir -p platforms/{platform}
   cp platforms/instagram/* platforms/{platform}/
   # Edit files for new platform
   ```

3. **Update main dispatcher:**
   ```typescript
   // In src/index.ts
   import { createTikTokServer } from '../platforms/tiktok/server.js';

   switch (platform) {
     case 'instagram':
       server = createInstagramServer();
       break;
     case 'tiktok':
       server = createTikTokServer();
       break;
   }
   ```

4. **Test and document:**
   ```bash
   npm run build
   # Add tests and documentation
   ```

### Development Guidelines

- Follow TypeScript strict mode
- Include comprehensive error handling
- Add platform-specific documentation
- Update examples and guides
- Maintain API compatibility

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**"Access token required"**
- Ensure `INSTAGRAM_ACCESS_TOKEN` is set in `.env`

**"Unsupported platform"**
- Check `SOCIAL_PLATFORM` environment variable
- Verify platform is implemented

**API Errors**
- Check [API Fixes](docs/api/api-fixes.md) for known issues
- Verify account has required permissions

### Getting Help

1. Check [Debugging Guide](docs/guides/debugging.md)
2. Review [API Documentation](docs/api/)
3. Check [GitHub Issues](https://github.com/your-repo/issues)

## 🔄 Version History

See [Changelog](docs/development/changelog.md) for detailed version history.

## 🙏 Acknowledgments

- Instagram Graph API team
- MCP protocol creators
- Open source community

---

**Version**: 1.0.0
**Platforms**: Instagram ✅
**API Version**: Instagram Graph API v23.0
**Status**: Production Ready
