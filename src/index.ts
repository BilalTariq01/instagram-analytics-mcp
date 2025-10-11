#!/usr/bin/env node

/**
 * Social Analytics MCP Server
 * Main entry point for all social media platforms
 */

// Import platform servers
import { createInstagramServer } from '../platforms/instagram/server.js';
import { createFacebookServer } from '../platforms/facebook/server.js';

// Get platform from environment or default to instagram
const platform = process.env.SOCIAL_PLATFORM || 'instagram';

// Create server based on platform
let server;

switch (platform) {
  case 'instagram':
    server = createInstagramServer();
    break;
  case 'facebook':
    server = createFacebookServer();
    break;
  default:
    throw new Error(`Unsupported platform: ${platform}. Supported platforms: instagram, facebook`);
}

// Export for testing
export { server };

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  server.start();
}
