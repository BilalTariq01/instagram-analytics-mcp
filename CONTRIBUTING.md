# Contributing

Thanks for your interest in contributing to Social Analytics MCP Server!

## Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd social-analytics-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

4. Build:
   ```bash
   npm run build
   ```

5. Run in development mode:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── index.ts              # Server entry point and exports
├── tools.ts              # MCP tool definitions
├── handlers.ts           # Tool execution routing
├── prompts.ts            # Pre-built analysis prompts
├── utils/
│   ├── retry.ts          # Shared retry with exponential backoff
│   ├── errors.ts         # Unified error types
│   └── logger.ts         # Structured stderr logger
└── platforms/
    ├── instagram/
    │   ├── client.ts     # Instagram Graph API client
    │   └── types.ts      # Instagram type definitions
    └── facebook/
        ├── client.ts     # Facebook Graph API client
        └── types.ts      # Facebook type definitions
```

## Code Style

- TypeScript strict mode is enabled
- Use ESM imports (`.js` extensions in import paths)
- MCP servers must not write to stdout — use `logger` (writes to stderr)
- Error classes should extend `SocialAnalyticsError` or platform-specific errors
- All API requests should use the shared `requestWithRetry` utility

## Adding a New Tool

1. Define the tool schema in `src/tools.ts`
2. Add a handler case in `src/handlers.ts`
3. Implement the client method in the appropriate platform client
4. Add any new types to the platform's `types.ts`

## Adding a New Platform

1. Create `src/platforms/<platform>/client.ts` and `types.ts`
2. Add tool definitions with `<platform>_` prefix in `src/tools.ts`
3. Add a handler function in `src/handlers.ts`
4. Initialize the client in `src/index.ts`
5. Add routing in the `CallToolRequestSchema` handler

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure `npm run build` passes with zero errors
4. Update `CHANGELOG.md` if adding features or fixing bugs
5. Submit a PR with a clear description of the changes

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
