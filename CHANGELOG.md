# Changelog

All notable changes to the Instagram Analytics MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-05

### Added
- Initial release of Instagram Analytics MCP Server
- **MCP Tools**:
  - `get_user_profile` - Retrieve Instagram business account profile information
  - `get_account_insights` - Get account-level analytics and insights
  - `list_media` - List recent media posts
  - `get_media_insights` - Get insights for specific media posts
  - `get_media_details` - Get detailed information about a media post
- **Instagram API Client**:
  - Full TypeScript implementation
  - Support for Instagram Graph API v18.0
  - Automatic account ID detection
  - Comprehensive error handling
- **Account Metrics Support**:
  - Impressions, reach, profile views
  - Follower count tracking
  - Contact actions (email, phone, text, directions)
  - Website clicks
- **Media Metrics Support**:
  - Engagement, impressions, reach
  - Saves, likes, comments, shares
  - Video views (for video content)
- **Documentation**:
  - Comprehensive README with setup instructions
  - Detailed SETUP_GUIDE for step-by-step configuration
  - Usage examples and common workflows
  - Quick reference guide
  - Contributing guidelines
- **Configuration**:
  - Environment variable support via .env
  - Example configuration files
  - Claude Desktop integration example
- **Developer Experience**:
  - TypeScript with full type definitions
  - Watch mode for development
  - Clear error messages
  - Extensive code comments

### Technical Details
- Built with @modelcontextprotocol/sdk v1.0.4
- Uses axios for HTTP requests
- TypeScript 5.3.3 with strict mode
- Node.js 18+ required
- Supports stdio transport for MCP communication

## [Unreleased]

### Planned Features
- Instagram Stories insights support
- Reels-specific analytics
- Hashtag performance tracking
- Audience demographics insights
- Batch operations for multiple media items
- Caching layer for rate limit optimization
- Webhook support for real-time updates
- Export functionality (CSV, JSON)
- Scheduled reporting
- Comparison tools (time periods, posts)

---

## Version History

### Version Numbering

- **Major (X.0.0)**: Breaking changes, major new features
- **Minor (1.X.0)**: New features, backwards compatible
- **Patch (1.0.X)**: Bug fixes, minor improvements

### Categories

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

---

For upgrade instructions and migration guides, see the README.md file.
