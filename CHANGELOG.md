# Changelog

All notable changes to the Social Analytics MCP Server will be documented in this file.

## [3.0.0] - 2026-02-09

### Breaking Changes

- **Restructured project**: All source code now lives under `src/` (including platform clients)
- **Removed root `index.ts`**: The entry point is now `src/index.ts` → `dist/index.js`
- **Removed standalone servers**: `platforms/instagram/server.ts` and `platforms/facebook/server.ts` are deleted
- **Bumped to v3.0.0**: Package version, server version, and types are now in sync

### Added

- **New Instagram tools**:
  - `instagram_get_stories` — Retrieve recent Instagram Stories
  - `instagram_get_hashtag_search` — Search for hashtag IDs
  - `instagram_get_hashtag_media` — Get top/recent media for a hashtag
  - `instagram_get_content_publishing_limit` — Check publishing rate limits
  - `instagram_get_mentioned_media` — Get media where account is tagged

- **New Facebook tools**:
  - `facebook_get_page_details` — Get page profile info (name, category, followers, about)
  - `facebook_get_page_feed` — Get page feed with reactions/comments/shares
  - `facebook_list_known_metrics` — Expose supported metrics reference
  - `facebook_validate_token` — Validate access tokens

- **Shared retry utility** (`src/utils/retry.ts`): Exponential backoff with jitter, respects `Retry-After` header. Used by both Instagram and Facebook clients.

- **Unified error handling** (`src/utils/errors.ts`): `SocialAnalyticsError` base class, `InstagramApiError` (new), `FacebookApiError` (moved)

- **Structured logger** (`src/utils/logger.ts`): Writes to stderr (MCP-safe), debug mode via `DEBUG=social-analytics-mcp`

- **`createServer()` export**: For programmatic MCP server creation

- **`CONTRIBUTING.md`**: Development setup and contribution guidelines

### Fixed

- **API version mismatch**: Instagram client was hardcoded to `v20.0` but documented as `v23.0`. Now defaults to `v23.0` and is configurable via `INSTAGRAM_API_VERSION` env var.
- **Server version mismatch**: Server reported `1.0.0` but `package.json` said `2.0.0`. Now kept in sync at `3.0.0`.
- **`account_id` required vs optional**: Tool schemas marked `account_id` as required despite descriptions saying "optional if set in environment". Removed from `required` arrays — the client handles auto-detection.
- **`page_id` required vs optional**: Same fix for Facebook `page_id`.
- **Instagram client missing retry logic**: Now uses shared retry utility matching Facebook client behavior.
- **Media insights documentation**: Tool description now explains which metrics work for which media types (images vs videos vs reels vs stories).

### Changed

- **File structure**: Platform clients moved from `platforms/` to `src/platforms/`
- **`tsconfig.json`**: `rootDir` changed to `./src`, removed old `platforms/**/*` include
- **`.gitignore`**: Added patterns for compiled JS in source directories
- **`package.json`**: Added `files`, `types`, `exports`, `engines`, `clean`, and `prepublishOnly` fields for npm publishing readiness

### Removed

- `src/instagram-client.ts` (duplicate of platform client)
- `src/types.ts` (duplicate of platform types)
- `platforms/instagram/server.ts` (deprecated standalone server)
- `platforms/facebook/server.ts` (deprecated standalone server)
- All compiled `.js`/`.d.ts`/`.map` files from `platforms/`
- `PROJECT_STRUCTURE.md`, `INDEX.md`, `QUICKSTART.md` (consolidated into README)
- `docs/` directory (consolidated into README and CONTRIBUTING)
- `examples/` directory (examples in README)

### Migration from v2.x

Update your MCP client configuration to point to the new output path:

```json
{
  "mcpServers": {
    "social-analytics": {
      "command": "node",
      "args": ["/path/to/social-analytics-mcp/dist/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "...",
        "FACEBOOK_ACCESS_TOKEN": "..."
      }
    }
  }
}
```

Tool names are unchanged. New tools are additions only — no existing tools were renamed or removed.

---

## [2.0.0] - 2025-01-11

### Major Refactor: Unified Server Architecture

#### Breaking Changes

- **Unified Server**: Merged Instagram and Facebook into single MCP server
- **Configuration Changes**: `FACEBOOK_PAGE_ACCESS_TOKEN` → `FACEBOOK_ACCESS_TOKEN`; Account/Page IDs now optional

#### Added

- Unified MCP server, rich prompts system, modular tool definitions, centralized handlers, discovery tools

#### Changed

- Tool naming convention: all tools prefixed with `instagram_` or `facebook_`
- Package name: `mcp-instagram-analytics` → `social-analytics-mcp`

---

## [1.0.0] - 2024-12-XX

### Initial Release

- Instagram Business Account analytics
- Facebook Page analytics
- Separate servers per platform
- Basic MCP protocol implementation
