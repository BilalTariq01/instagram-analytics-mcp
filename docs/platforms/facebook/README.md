# Facebook Page Insights MCP Server

This document describes the Facebook Page Insights integration for the Social Analytics MCP server.

## Prerequisites

- **Facebook Page** with at least 30 likes (Insights require minimum audience size)
- **Facebook Developer App** with permissions `read_insights` and `pages_read_engagement`
- **User Access Token** generated via OAuth that includes the above scopes
- Optional: **App Access Token** if you plan to use `debug_token` flows outside this server

## Setup Flow

1. **Get your User Access Token** from the Graph API Explorer or your app's OAuth flow
2. **List available pages** using the `list_pages` tool to see all pages you manage
3. **Select a page** and copy its `id` value
4. **Configure environment** by setting `FACEBOOK_PAGE_ID` to the selected page ID
5. **Use analytics tools** (`get_page_insights`, `list_posts_with_insights`) which will automatically use the configured page

## Environment Variables

Add the following to `.env` (or host configuration):

```env
FACEBOOK_PAGE_ACCESS_TOKEN=your_user_access_token_here
FACEBOOK_PAGE_ID=your_selected_page_id_here
FACEBOOK_API_VERSION=v22.0
# Optional when running validate access token via /me
# FACEBOOK_APP_ACCESS_TOKEN=your_app_access_token_here
```

Set `SOCIAL_PLATFORM=facebook` when starting the MCP server to enable this integration.

## Supported Tools

### list_pages

List all Facebook Pages accessible with the current access token. Use this to discover page IDs before configuring `FACEBOOK_PAGE_ID`.

#### Inputs for list_pages

- `access_token` (string, optional override)

#### Outputs for list_pages

- `data`: array of page objects with `id`, `name`, `access_token`, `category`, `tasks`
- `paging`: pagination info

### get_page_insights

Fetch page-level metrics using `/{page-id}/insights`. Requires `FACEBOOK_PAGE_ID` to be set in environment.

#### Inputs for get_page_insights

- `metrics` (string[], required)
- `period` (`day` | `week` | `days_28` | `lifetime`, optional)
- `since`, `until` (string, optional)
- `limit` (number, optional, 1-200)
- `after`, `before` (string, optional)
- `api_version` (string, optional)
- `access_token` (string, optional override)

#### Outputs for get_page_insights

- `data`: array of insight objects
- `paging`: cursors and navigation URLs
- `warnings`: optional array (e.g., missing period)

### get_post_insights

Fetch metrics for a specific post using `/{post-id}/insights`.

#### Inputs for get_post_insights

- `post_id` (string, required)
- `metrics` (string[], required)
- `period` (`day` | `week` | `days_28` | `lifetime`, optional)
- `api_version`, `access_token` (optional)

#### Outputs for get_post_insights

- Same shape as `get_page_insights`

### list_posts_with_insights

List posts with inline metrics using `/{page-id}/posts?fields=...insights.metric(...)`. Requires `FACEBOOK_PAGE_ID` to be set in environment.

#### Inputs for list_posts_with_insights

- `post_metrics` (string[], required)
- `limit` (number, optional, default 25)
- `after`, `before` (string cursors, optional)
- `api_version`, `access_token` (optional)

#### Outputs for list_posts_with_insights

- `posts`: post objects with `insights`
- `paging`: pagination info

### list_known_metrics

Return curated metric metadata. Use as guidance only; the Graph API is source of truth.

#### Outputs for list_known_metrics

- `page`: array of `{ name, periods, notes }`
- `post`: same structure

### validate_access_token

Validate that a token can access `/me` using `/me?fields=id,name`.

#### Inputs for validate_access_token

- `access_token` (string, required)
- `api_version` (string, optional)
- `fields` (string[], optional)

#### Outputs for validate_access_token

- `isValid` (boolean)
- `id`, `name` (optional)
- `raw` (full response or error payload)

## Error Handling

Errors are normalized into `{ code, subcode?, message, raw }` with these categories:

- **OAUTH**: invalid tokens or missing permissions
- **VALIDATION**: missing parameters or Graph `code 100`
- **RATE_LIMIT**: HTTP 429 or Graph error codes 4/17/32/613
- **GRAPH**: other Graph API errors
- **NETWORK**: transport-level issues

## Usage Tips

- Insights often refresh daily; expect lag for real-time stats
- Ensure the Page has ≥30 likes; otherwise Insight calls can return empty data
- Metric availability depends on API version and Page type; allow new metrics to pass through
- Respect rate limits by implementing backoff when `retry-after` is present

## Example Calls

### Example: list_pages

```json
{
  "tool": "list_pages",
  "arguments": {}
}
```

### Example: get_page_insights

```json
{
  "tool": "get_page_insights",
  "arguments": {
    "metrics": ["page_impressions", "page_engaged_users"],
    "period": "day",
    "since": "2025-09-12",
    "until": "2025-10-11"
  }
}
```

### Example: get_post_insights

```json
{
  "tool": "get_post_insights",
  "arguments": {
    "post_id": "1234567890_0987654321",
    "metrics": ["post_impressions", "post_engaged_users"],
    "period": "day"
  }
}
```

### Example: list_posts_with_insights

```json
{
  "tool": "list_posts_with_insights",
  "arguments": {
    "post_metrics": ["post_impressions", "post_engaged_users"],
    "limit": 10
  }
}
```

### Example: validate_access_token

```json
{
  "tool": "validate_access_token",
  "arguments": {
    "access_token": "EAAG...",
    "fields": ["id", "name", "tasks"]
  }
}
```

## Troubleshooting

- **Permissions error**: confirm the token includes `read_insights` and `pages_read_engagement`
- **Empty data**: Page may have insufficient likes or metric/period combination unsupported
- **Rate limiting**: wait and retry; the client applies exponential backoff
- **Unknown metric**: Graph API may support it; the server passes through unless Graph rejects it

Refer to Meta’s documentation for the latest metric availability and API behavior.
