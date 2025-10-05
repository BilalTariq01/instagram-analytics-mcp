# Contributing to Instagram Analytics MCP Server

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

This project follows a simple code of conduct:

- **Be respectful**: Treat everyone with respect and kindness
- **Be constructive**: Provide helpful feedback and suggestions
- **Be collaborative**: Work together to improve the project
- **Be patient**: Remember that everyone is learning

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- A text editor or IDE (VS Code recommended)
- Instagram Business Account with API access

### Areas for Contribution

We welcome contributions in these areas:

- **Bug fixes**: Fix issues reported in GitHub Issues
- **New features**: Add new tools or capabilities
- **Documentation**: Improve README, guides, or code comments
- **Examples**: Add usage examples or tutorials
- **Testing**: Add tests or improve test coverage
- **Performance**: Optimize API calls or data processing
- **Error handling**: Improve error messages and handling

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/mcp-instagram-analytics.git
cd mcp-instagram-analytics
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
cp .env.example .env
# Edit .env and add your Instagram access token
```

### 4. Build the Project

```bash
npm run build
```

### 5. Run in Development Mode

```bash
npm run watch
# In another terminal:
npm start
```

## Making Changes

### Branch Naming

Create a descriptive branch name:

- `feature/add-story-insights` - For new features
- `fix/rate-limit-handling` - For bug fixes
- `docs/setup-guide-improvements` - For documentation
- `refactor/api-client-structure` - For code refactoring

```bash
git checkout -b feature/your-feature-name
```

### Commit Messages

Write clear, descriptive commit messages:

```
Add support for Instagram Stories insights

- Implement getStoryInsights method in InstagramClient
- Add get_story_insights MCP tool
- Update documentation with story examples
- Add type definitions for story metrics
```

Format:
- First line: Brief summary (50 chars or less)
- Blank line
- Detailed description with bullet points

## Submitting Changes

### 1. Test Your Changes

```bash
# Build the project
npm run build

# Test manually with your MCP client
npm start
```

### 2. Update Documentation

If your change affects usage:
- Update README.md
- Update SETUP_GUIDE.md if needed
- Add examples to examples/usage-examples.md
- Update type definitions and comments

### 3. Commit Your Changes

```bash
git add .
git commit -m "Your descriptive commit message"
```

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create a Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template:
   - **Description**: What does this PR do?
   - **Motivation**: Why is this change needed?
   - **Testing**: How did you test it?
   - **Screenshots**: If applicable

## Coding Standards

### TypeScript Style

- Use TypeScript for all code
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Export types from `types.ts`

Example:
```typescript
// Good
interface MediaMetrics {
  engagement: number;
  impressions: number;
  reach: number;
}

async function getMetrics(mediaId: string): Promise<MediaMetrics> {
  // ...
}

// Avoid
async function getMetrics(mediaId: any): Promise<any> {
  // ...
}
```

### Code Organization

- Keep files focused and single-purpose
- Use descriptive variable and function names
- Add comments for complex logic
- Group related functionality

### Error Handling

Always handle errors gracefully:

```typescript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  if (axios.isAxiosError(error)) {
    throw new Error(`API Error: ${error.response?.data?.error?.message || error.message}`);
  }
  throw error;
}
```

### API Client Guidelines

When adding new API methods:

1. Add type definitions to `types.ts`
2. Implement method in `instagram-client.ts`
3. Add proper error handling
4. Document parameters and return types
5. Follow existing patterns

Example:
```typescript
/**
 * Get insights for Instagram Stories
 * @param storyId - The ID of the story
 * @param metrics - Array of metrics to retrieve
 * @returns Array of story insights
 */
async getStoryInsights(
  storyId: string,
  metrics: StoryMetric[]
): Promise<StoryInsight[]> {
  try {
    const response = await this.axios.get<InsightsResponse>(
      `/${storyId}/insights`,
      { params: { metric: metrics.join(',') } }
    );
    return response.data.data as StoryInsight[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to get story insights: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}
```

### MCP Tool Guidelines

When adding new MCP tools:

1. Define the tool in the `TOOLS` array
2. Add a descriptive name and description
3. Define a clear input schema
4. Implement the handler in the switch statement
5. Return properly formatted responses

Example:
```typescript
{
  name: 'get_story_insights',
  description: 'Get insights for an Instagram Story',
  inputSchema: {
    type: 'object',
    properties: {
      story_id: {
        type: 'string',
        description: 'The ID of the story',
      },
      metrics: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['impressions', 'reach', 'replies', 'exits'],
        },
        description: 'Metrics to retrieve',
      },
    },
    required: ['story_id', 'metrics'],
  },
}
```

## Testing

### Manual Testing

1. Build the project: `npm run build`
2. Configure with an MCP client
3. Test each tool with various inputs
4. Verify error handling with invalid inputs
5. Check edge cases

### Test Checklist

Before submitting a PR, verify:

- ✅ Code builds without errors
- ✅ All existing tools still work
- ✅ New features work as expected
- ✅ Error messages are clear and helpful
- ✅ Documentation is updated
- ✅ No sensitive data (tokens, IDs) in code

## Feature Requests

Have an idea for a new feature?

1. Check existing issues to avoid duplicates
2. Open a new issue with:
   - Clear description of the feature
   - Use case / motivation
   - Proposed implementation (if you have ideas)
3. Wait for feedback before starting work
4. Reference the issue in your PR

## Bug Reports

Found a bug?

1. Check if it's already reported
2. Open a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Error messages (remove sensitive tokens!)

## Questions?

- Check the README.md and SETUP_GUIDE.md first
- Look through existing issues
- Open a new issue with the "question" label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions help make this project better for everyone. We appreciate your time and effort! 🙏
