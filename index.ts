/**
 * Social Analytics MCP Server
 * Root entry point - re-exports the main server
 */

export { server } from './src/index.js';
export { InstagramClient } from './platforms/instagram/client.js';
export { FacebookClient } from './platforms/facebook/client.js';

// Re-export for convenience
export * from './src/tools.js';
export * from './src/prompts.js';
export * from './src/handlers.js';

// Start server if run directly (for backwards compatibility with old scripts)
if (import.meta.url === `file://${process.argv[1]}`) {
  import('./src/index.js').then(({ server }) => {
    import('@modelcontextprotocol/sdk/server/stdio.js').then(({ StdioServerTransport }) => {
      server.connect(new StdioServerTransport()).catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
      });
    });
  });
}
