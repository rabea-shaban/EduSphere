# Store Directory

This folder is dedicated to global state management.

## State Management Guidelines

1. **Keep it minimal**: Use global stores only for states that must be shared across disparate page components (e.g., authentication session, sidebar collapsed state).
2. **Prefer server state**: For server data, rely entirely on **TanStack Query** in `src/providers/query-provider.tsx` rather than caching API results in global stores.
3. **Prefer React Context**: For single-page/subtree layouts, use native React Context inside feature folders before resorting to global stores.
