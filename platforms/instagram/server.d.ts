#!/usr/bin/env node
/**
 * Instagram Analytics MCP Server
 * Provides tools for accessing Instagram insights and analytics via MCP protocol
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
export declare function createInstagramServer(): {
    start: () => Promise<void>;
    getServer: () => Server<{
        method: string;
        params?: {
            [x: string]: unknown;
            _meta?: {
                [x: string]: unknown;
                progressToken?: string | number | undefined;
            } | undefined;
        } | undefined;
    }, {
        method: string;
        params?: {
            [x: string]: unknown;
            _meta?: {
                [x: string]: unknown;
            } | undefined;
        } | undefined;
    }, {
        [x: string]: unknown;
        _meta?: {
            [x: string]: unknown;
        } | undefined;
    }>;
};
//# sourceMappingURL=server.d.ts.map