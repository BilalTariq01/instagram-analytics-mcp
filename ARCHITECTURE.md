# Architecture Documentation

## System Overview

The Instagram Analytics MCP Server is a TypeScript-based application that bridges MCP-compatible clients with the Instagram Graph API.

```
┌─────────────────────────────────────────────────────────────────┐
│                        MCP Client                               │
│                  (e.g., Claude Desktop)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ MCP Protocol (stdio)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   Instagram Analytics MCP Server                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              MCP Server (index.ts)                      │  │
│  │                                                         │  │
│  │  • Tool Registration                                    │  │
│  │  • Request Routing                                      │  │
│  │  • Response Formatting                                  │  │
│  │  • Error Handling                                       │  │
│  └────────────────────┬────────────────────────────────────┘  │
│                       │                                         │
│  ┌────────────────────▼────────────────────────────────────┐  │
│  │        Instagram Client (instagram-client.ts)           │  │
│  │                                                         │  │
│  │  • API Request Management                               │  │
│  │  • Authentication                                       │  │
│  │  • Account ID Detection                                 │  │
│  │  • Response Parsing                                     │  │
│  │  • Error Translation                                    │  │
│  └────────────────────┬────────────────────────────────────┘  │
│                       │                                         │
│  ┌────────────────────▼────────────────────────────────────┐  │
│  │           Type Definitions (types.ts)                   │  │
│  │                                                         │  │
│  │  • API Response Types                                   │  │
│  │  • Metric Enums                                         │  │
│  │  • Configuration Interfaces                             │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                  Instagram Graph API                            │
│                  (graph.facebook.com)                           │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. MCP Server Layer (`src/index.ts`)

**Responsibilities**:
- Initialize MCP server with capabilities
- Register available tools
- Handle tool execution requests
- Format responses according to MCP protocol
- Manage server lifecycle

**Key Components**:
```typescript
// Server initialization
const server = new Server({
  name: 'instagram-analytics',
  version: '1.0.0'
}, {
  capabilities: { tools: {} }
});

// Tool registration
server.setRequestHandler(ListToolsRequestSchema, ...);

// Tool execution
server.setRequestHandler(CallToolRequestSchema, ...);

// Transport setup
const transport = new StdioServerTransport();
await server.connect(transport);
```

**Tools Provided**:
1. `get_user_profile` → `InstagramClient.getUserProfile()`
2. `get_account_insights` → `InstagramClient.getAccountInsights()`
3. `list_media` → `InstagramClient.getMedia()`
4. `get_media_insights` → `InstagramClient.getMediaInsights()`
5. `get_media_details` → `InstagramClient.getMediaById()`

### 2. Instagram Client Layer (`src/instagram-client.ts`)

**Responsibilities**:
- Manage Instagram Graph API communication
- Handle authentication with access tokens
- Auto-detect Instagram Business Account ID
- Parse and transform API responses
- Provide user-friendly error messages

**Key Methods**:

```typescript
class InstagramClient {
  // Account management
  async getAccountId(): Promise<string>
  async getUserProfile(): Promise<UserProfile>
  
  // Insights
  async getAccountInsights(
    metrics: AccountMetric[],
    period: Period,
    since?: number,
    until?: number
  ): Promise<AccountInsight[]>
  
  // Media
  async getMedia(limit: number): Promise<MediaItem[]>
  async getMediaById(mediaId: string): Promise<MediaItem>
  async getMediaInsights(
    mediaId: string,
    metrics: MediaMetric[]
  ): Promise<MediaInsight[]>
}
```

**API Endpoints Used**:
- `GET /me/accounts` - Get Facebook pages
- `GET /{page-id}?fields=instagram_business_account` - Get IG account
- `GET /{ig-user-id}` - Get profile info
- `GET /{ig-user-id}/insights` - Get account insights
- `GET /{ig-user-id}/media` - List media
- `GET /{ig-media-id}` - Get media details
- `GET /{ig-media-id}/insights` - Get media insights

### 3. Type System (`src/types.ts`)

**Type Categories**:

```typescript
// Configuration
interface InstagramConfig {
  accessToken: string;
  accountId?: string;
}

// API Responses
interface UserProfile { ... }
interface AccountInsight { ... }
interface MediaInsight { ... }
interface MediaItem { ... }

// Enums
type AccountMetric = 'impressions' | 'reach' | ...
type MediaMetric = 'engagement' | 'impressions' | ...
type Period = 'day' | 'week' | 'days_28'
```

## Data Flow

### Example: Getting Account Insights

```
1. User Request (MCP Client)
   ↓
   "Get impressions and reach for the last week"
   
2. MCP Server (index.ts)
   ↓
   Receives CallToolRequest:
   {
     name: "get_account_insights",
     arguments: {
       metrics: ["impressions", "reach"],
       period: "week"
     }
   }
   
3. Instagram Client (instagram-client.ts)
   ↓
   a. Check if accountId is cached
   b. If not, call getAccountId()
      - GET /me/accounts
      - GET /{page-id}?fields=instagram_business_account
   c. Call getAccountInsights()
      - GET /{ig-user-id}/insights?metric=impressions,reach&period=week
   
4. Instagram Graph API
   ↓
   Returns JSON response:
   {
     "data": [
       {
         "name": "impressions",
         "period": "week",
         "values": [{"value": 1234, "end_time": "..."}],
         ...
       },
       ...
     ]
   }
   
5. Instagram Client
   ↓
   Parses response into AccountInsight[]
   
6. MCP Server
   ↓
   Formats as MCP response:
   {
     "content": [{
       "type": "text",
       "text": JSON.stringify(insights, null, 2)
     }]
   }
   
7. MCP Client
   ↓
   Displays formatted insights to user
```

## Error Handling Flow

```
Error Occurs
   ↓
Is it an Axios error?
   ├─ Yes → Extract error message from response.data.error.message
   └─ No  → Use error.message or "Unknown error"
   ↓
Wrap in descriptive Error with context
   ↓
Return to MCP Server
   ↓
Format as MCP error response:
{
  "content": [{
    "type": "text",
    "text": JSON.stringify({ error: message })
  }],
  "isError": true
}
   ↓
Display to user
```

## Configuration Flow

```
Application Start
   ↓
Load .env file (dotenv.config())
   ↓
Validate INSTAGRAM_ACCESS_TOKEN
   ├─ Missing → Exit with error
   └─ Present → Continue
   ↓
Create InstagramClient instance
   ↓
Initialize MCP Server
   ↓
Connect stdio transport
   ↓
Ready to accept requests
```

## Security Architecture

### Token Management
```
Environment Variable (INSTAGRAM_ACCESS_TOKEN)
   ↓
Loaded at startup (never logged)
   ↓
Stored in InstagramClient instance
   ↓
Sent with each API request
   ↓
Never exposed in responses
```

### Data Protection
- ✅ Access tokens in environment variables
- ✅ .gitignore prevents token commits
- ✅ No token logging
- ✅ Error messages sanitized
- ✅ No sensitive data in responses

## Performance Considerations

### Rate Limiting
- Instagram API: 200 calls/hour per token
- No built-in caching (future enhancement)
- Client responsible for rate limit management

### Optimization Strategies
1. **Account ID Caching**: Detected once, reused
2. **Batch Requests**: Use list_media then get insights
3. **Selective Metrics**: Only request needed metrics
4. **Period Selection**: Use appropriate time periods

### Memory Usage
- Minimal state (only access token and account ID)
- Streaming responses via stdio
- No data persistence

## Extensibility Points

### Adding New Tools

1. **Define Tool Schema** (index.ts):
```typescript
const NEW_TOOL: Tool = {
  name: 'new_tool_name',
  description: '...',
  inputSchema: { ... }
};
```

2. **Implement Handler** (index.ts):
```typescript
case 'new_tool_name': {
  const result = await instagramClient.newMethod(...);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
}
```

3. **Add Client Method** (instagram-client.ts):
```typescript
async newMethod(...): Promise<NewType> {
  const response = await this.axios.get(...);
  return response.data;
}
```

4. **Define Types** (types.ts):
```typescript
export interface NewType { ... }
```

### Adding New Metrics

1. Update type definitions in `types.ts`:
```typescript
export type AccountMetric = 
  | 'existing_metric'
  | 'new_metric';
```

2. Update tool schema in `index.ts`:
```typescript
enum: [..., 'new_metric']
```

3. No client changes needed (metrics passed through)

## Dependencies

### Runtime Dependencies
```
@modelcontextprotocol/sdk@1.0.4
  └─ MCP protocol implementation
  
axios@1.7.2
  └─ HTTP client for API requests
  
dotenv@16.4.5
  └─ Environment variable loading
```

### Development Dependencies
```
typescript@5.3.3
  └─ TypeScript compiler
  
@types/node@20.11.0
  └─ Node.js type definitions
```

## Build Process

```
Source Files (src/*.ts)
   ↓
TypeScript Compiler (tsc)
   ↓
JavaScript Output (dist/*.js)
   ├─ index.js (entry point)
   ├─ instagram-client.js
   ├─ types.js
   └─ *.d.ts (type declarations)
   ↓
Executable via: node dist/index.js
```

## Deployment Architecture

### Local Development
```
Developer Machine
   ├─ Source code
   ├─ .env file
   └─ node_modules/
   
npm run watch → Auto-rebuild
npm start → Run server
```

### Production Use
```
User Machine
   ├─ Compiled dist/
   ├─ .env or environment config
   └─ node_modules/
   
MCP Client Config
   └─ Points to dist/index.js
   
Server runs as subprocess
   └─ Communicates via stdio
```

## Testing Strategy

### Manual Testing
1. Build project
2. Configure MCP client
3. Test each tool
4. Verify error handling
5. Check edge cases

### Future Automated Testing
- Unit tests for InstagramClient methods
- Integration tests with mock API
- E2E tests with MCP client
- Error scenario testing

## Monitoring & Debugging

### Logging
- Server startup logged to stderr
- Errors logged to stderr
- MCP communication via stdio
- No sensitive data in logs

### Debugging
```typescript
// Add debug logging
console.error('Debug:', data);

// Check environment
console.error('Token present:', !!process.env.INSTAGRAM_ACCESS_TOKEN);

// Inspect API responses
console.error('API Response:', JSON.stringify(response.data));
```

## Scalability Considerations

### Current Limitations
- Single access token (one account)
- No request queuing
- No rate limit handling
- No caching

### Future Enhancements
- Multi-account support
- Request queue with rate limiting
- Redis caching layer
- Webhook support for real-time data
- Horizontal scaling with load balancer

---

This architecture provides a solid foundation for Instagram analytics while maintaining simplicity and extensibility.
