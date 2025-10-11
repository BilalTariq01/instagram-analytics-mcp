# Changelog

All notable changes to the Social Analytics MCP Server will be documented in this file.

## [2.0.0] - 2025-01-11

### 🎉 Major Refactor: Unified Server Architecture

#### Breaking Changes

- **Unified Server**: Merged Instagram and Facebook into single MCP server
  - No longer need `SOCIAL_PLATFORM` environment variable
  - Both platforms work simultaneously
  - Tool names now prefixed: `instagram_*` and `facebook_*`

- **Configuration Changes**:
  - `FACEBOOK_PAGE_ACCESS_TOKEN` → `FACEBOOK_ACCESS_TOKEN`
  - Account/Page IDs now optional (use discovery tools instead)

#### Added

- **Unified MCP Server** (`src/index.ts`)
  - Single server supporting both Instagram and Facebook
  - Automatic platform routing based on tool prefix
  - Cleaner architecture for future platform additions

- **Rich Prompts System** (`src/prompts.ts`)
  - `analyze_instagram_performance` - Comprehensive Instagram analysis
  - `analyze_facebook_performance` - Comprehensive Facebook analysis
  - `compare_post_performance` - Cross-post comparison
  - `get_audience_demographics` - Demographic insights
  - `setup_platform` - Interactive setup guide

- **Modular Tool Definitions** (`src/tools.ts`)
  - All Instagram tools with `instagram_` prefix
  - All Facebook tools with `facebook_` prefix
  - Clean separation of platform-specific schemas

- **Centralized Handlers** (`src/handlers.ts`)
  - `handleInstagramTool()` - Routes Instagram tool calls
  - `handleFacebookTool()` - Routes Facebook tool calls
  - Consistent error handling across platforms

- **Discovery Tools**
  - `instagram_list_accounts` - Find Instagram Business accounts
  - `facebook_list_pages` - Find Facebook Pages
  - No need to pre-configure IDs!

- **Documentation**
  - `QUICKSTART.md` - 3-step setup guide
  - `PROJECT_STRUCTURE.md` - Architecture documentation
  - Updated `README.md` with unified approach
  - Enhanced `.env.example` with clear sections

#### Changed

- **Minimal Configuration Philosophy**
  - Only access tokens required in MCP settings
  - Account/Page IDs discovered via tools
  - Optional: Set default IDs if desired

- **Tool Naming Convention**
  - Instagram: `instagram_list_accounts`, `instagram_get_profile`, etc.
  - Facebook: `facebook_list_pages`, `facebook_get_page_insights`, etc.

- **Package Metadata**
  - Name: `mcp-instagram-analytics` → `social-analytics-mcp`
  - Version: `1.0.0` → `2.0.0`
  - Main: `dist/index.js` → `dist/src/index.js`

#### Improved

- **Error Messages**
  - Clear "client not initialized" errors
  - Helpful guidance when tokens missing
  - Better API error formatting

- **Type Safety**
  - Proper TypeScript types throughout
  - Type-safe tool handlers
  - Compile-time error checking

- **Code Organization**
  - Clear separation: server, tools, prompts, handlers
  - Platform clients remain independent
  - Easy to add new platforms

#### Migration Guide

**Old Configuration (v1.x)**:
```json
{
  "mcpServers": {
    "instagram": {
      "env": {
        "SOCIAL_PLATFORM": "instagram",
        "INSTAGRAM_ACCESS_TOKEN": "...",
        "INSTAGRAM_ACCOUNT_ID": "..."
      }
    },
    "facebook": {
      "env": {
        "SOCIAL_PLATFORM": "facebook",
        "FACEBOOK_PAGE_ACCESS_TOKEN": "...",
        "FACEBOOK_PAGE_ID": "..."
      }
    }
  }
}
```

**New Configuration (v2.0)**:
```json
{
  "mcpServers": {
    "social-analytics": {
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "...",
        "FACEBOOK_ACCESS_TOKEN": "..."
      }
    }
  }
}
```

**Tool Name Changes**:
- `list_available_accounts` → `instagram_list_accounts`
- `get_user_profile` → `instagram_get_profile`
- `get_account_insights` → `instagram_get_account_insights`
- `list_media` → `instagram_list_media`
- `get_media_details` → `instagram_get_media_details`
- `get_media_insights` → `instagram_get_media_insights`
- `list_pages` → `facebook_list_pages`
- `get_page_insights` → `facebook_get_page_insights`
- `get_post_insights` → `facebook_get_post_insights`
- `list_posts_with_insights` → `facebook_list_posts_with_insights`

## [1.0.0] - 2024-12-XX

### Initial Release

- Instagram Business Account analytics
- Facebook Page analytics
- Separate servers per platform
- Basic MCP protocol implementation
- Environment-based configuration

---

## Future Roadmap

### v2.1.0 (Planned)
- Add Twitter/X analytics support
- Implement request caching
- Enhanced error recovery
- Token refresh mechanism

### v2.2.0 (Planned)
- LinkedIn analytics support
- Webhook support for real-time updates
- Scheduled report generation
- Data export features

### v3.0.0 (Planned)
- Multi-account management
- Custom dashboard generation
- Advanced analytics and ML insights
- Performance optimizations
