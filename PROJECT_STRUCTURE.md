# Project Structure

This document explains the professional architecture of the Social Analytics MCP Server.

## Directory Structure

```
social-analytics-mcp/
├── src/                          # Main server code
│   ├── index.ts                  # Unified server entry point
│   ├── tools.ts                  # Tool definitions for all platforms
│   ├── prompts.ts                # Pre-built analysis prompts
│   └── handlers.ts               # Tool execution handlers
│
├── platforms/                    # Platform-specific implementations
│   ├── instagram/
│   │   ├── client.ts             # Instagram Graph API client
│   │   ├── types.ts              # Instagram type definitions
│   │   └── server.ts             # Legacy standalone server (deprecated)
│   │
│   ├── facebook/
│   │   ├── client.ts             # Facebook Graph API client
│   │   ├── types.ts              # Facebook type definitions
│   │   └── server.ts             # Legacy standalone server (deprecated)
│   │
│   └── shared/                   # Shared utilities (future)
│       └── errors.ts             # Common error handling
│
├── docs/                         # Documentation
│   ├── platforms/
│   │   ├── instagram/
│   │   │   └── README.md         # Instagram-specific docs
│   │   └── facebook/
│   │       └── README.md         # Facebook-specific docs
│   ├── api/                      # API reference docs
│   ├── guides/                   # User guides
│   └── development/              # Developer docs
│
├── examples/                     # Example configurations
│   ├── claude-desktop-config.json
│   └── usage-examples.md
│
├── .env.example                  # Environment template
├── QUICKSTART.md                 # Quick start guide
├── README.md                     # Main documentation
└── package.json                  # Dependencies and scripts
```

## Architecture Principles

### 1. Unified Server Design

**Before**: Separate servers for each platform requiring `SOCIAL_PLATFORM` env variable
**After**: Single server supporting all platforms simultaneously

Benefits:
- Users can query both Instagram and Facebook in one conversation
- Simpler deployment and configuration
- Easier to add new platforms

### 2. Minimal Configuration

**Philosophy**: Only access tokens required in MCP settings

- No need to pre-configure account IDs or page IDs
- Discovery tools (`instagram_list_accounts`, `facebook_list_pages`) help users find IDs
- Optional: Users can set default IDs if they want

### 3. Clean Separation of Concerns

```
┌─────────────────────────────────────────┐
│         src/index.ts                    │
│    (Unified MCP Server)                 │
│  - Registers all tools & prompts        │
│  - Routes requests to handlers          │
└─────────────────────────────────────────┘
              │
              ├─────────────────┬─────────────────┐
              ▼                 ▼                 ▼
      ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
      │  tools.ts    │  │ prompts.ts   │  │ handlers.ts  │
      │              │  │              │  │              │
      │ Tool schemas │  │ Prompt       │  │ Request      │
      │ for all      │  │ templates    │  │ routing &    │
      │ platforms    │  │ & content    │  │ execution    │
      └──────────────┘  └──────────────┘  └──────────────┘
                                                  │
                        ┌─────────────────────────┴─────────────────────────┐
                        ▼                                                   ▼
              ┌──────────────────────┐                          ┌──────────────────────┐
              │ platforms/instagram/ │                          │ platforms/facebook/  │
              │                      │                          │                      │
              │ - client.ts          │                          │ - client.ts          │
              │ - types.ts           │                          │ - types.ts           │
              └──────────────────────┘                          └──────────────────────┘
```

### 4. Extensible for Future Platforms

Adding a new platform (e.g., Twitter, LinkedIn) requires:

1. Create `platforms/twitter/` directory
2. Implement `TwitterClient` class
3. Define types in `types.ts`
4. Add tools to `src/tools.ts`
5. Add handler in `src/handlers.ts`
6. Add prompts to `src/prompts.ts` (optional)

No changes needed to core server logic!

### 5. Type Safety

- Full TypeScript implementation
- Strict type checking for API requests/responses
- Type-safe tool definitions
- Proper error handling with typed exceptions

### 6. Error Handling Strategy

```typescript
// Platform clients throw typed errors
throw new InstagramApiError({ code: 'OAUTH', message: '...' });

// Handlers catch and format for MCP
try {
  result = await handleInstagramTool(...);
} catch (error) {
  return formatError(error);
}

// Users get clear, actionable error messages
```

## Key Design Decisions

### Why Unified Server?

**Alternative considered**: Keep separate servers, use MCP client to manage multiple

**Decision**: Single unified server

**Reasoning**:
- Better user experience (one configuration)
- Cross-platform analysis in single conversation
- Simpler maintenance
- Easier to add shared utilities

### Why Tool Prefixes? (`instagram_*`, `facebook_*`)

**Alternative considered**: Generic tool names with `platform` parameter

**Decision**: Platform-specific tool names

**Reasoning**:
- Clearer tool discovery
- Better autocomplete in AI assistants
- Easier to understand what each tool does
- Simpler routing logic

### Why Separate Client Classes?

**Alternative considered**: Single unified client with platform parameter

**Decision**: Separate `InstagramClient` and `FacebookClient`

**Reasoning**:
- Different API structures and authentication
- Easier to maintain platform-specific logic
- Better type safety
- Cleaner code organization

### Why Prompts?

**Alternative considered**: Let users write their own queries

**Decision**: Provide pre-built prompts

**Reasoning**:
- Faster onboarding
- Best practices built-in
- Consistent analysis patterns
- Users can still write custom queries

## Testing Strategy

### Current State
- Build verification with TypeScript compiler
- Manual testing with MCP clients

### Future Enhancements
- Unit tests for each client
- Integration tests for MCP handlers
- Mock API responses for reliable testing
- CI/CD pipeline with automated tests

## Performance Considerations

### Rate Limiting
- Graph API has rate limits
- Clients should implement exponential backoff
- Consider caching for frequently accessed data

### Token Management
- Access tokens expire
- Consider implementing token refresh
- Provide clear error messages when tokens expire

### Pagination
- Large result sets should use pagination
- Implement cursor-based pagination for efficiency

## Security Best Practices

1. **Never commit tokens**: Use `.env` files (gitignored)
2. **Validate inputs**: All tool parameters validated
3. **Error messages**: Don't expose sensitive data in errors
4. **Token storage**: MCP client handles secure storage
5. **Permissions**: Request minimum required permissions

## Future Roadmap

### Short Term
- Add more Instagram metrics
- Enhance Facebook demographic insights
- Improve error messages
- Add request caching

### Medium Term
- Add Twitter/X analytics
- Add LinkedIn analytics
- Implement token refresh
- Add webhook support for real-time updates

### Long Term
- Multi-account management
- Scheduled reports
- Data export features
- Custom dashboard generation

## Contributing

When adding new features:

1. Follow existing patterns
2. Add TypeScript types
3. Update documentation
4. Add examples
5. Test thoroughly
6. Update CHANGELOG

## Questions?

See the main [README](./README.md) or platform-specific docs in `docs/platforms/`.
