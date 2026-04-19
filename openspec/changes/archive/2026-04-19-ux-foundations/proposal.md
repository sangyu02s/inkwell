## Why

The blog currently lacks basic production-quality UX patterns. Forms submit without validation, the entire post list loads at once, network errors crash the UI, and loading states are non-existent. These gaps make the app feel incomplete and fragile.

## What Changes

- **Frontend**: Add Zod runtime validation schemas for all form inputs
- **Frontend**: Implement pagination for the post list with page controls
- **Frontend**: Add React ErrorBoundary to prevent full-page crashes
- **Frontend**: Add loading skeleton/shimmer for list and detail views
- **Backend**: Add pagination API support (`Pageable`) for list endpoint
- **Backend**: Enhance validation annotations on Post entity

## Capabilities

### New Capabilities

- `form-validation`: Zod schemas validating title (1-200 chars) and content (non-empty) with typed error messages
- `post-list-pagination`: Backend supports `Pageable` with `page`, `size`, `sort` params; frontend displays page controls
- `error-boundary`: React ErrorBoundary catches JS errors in component trees, shows fallback UI
- `loading-skeleton`: Skeleton/shimmer components for list and detail views during data fetching

### Modified Capabilities

- (none - Phase 1 does not change existing Post entity requirements)

## Impact

- **Frontend**: New Zod dependency; new `Skeleton` component; new `ErrorBoundary` wrapper; `PostListPage` and `PostDetailPage` gain loading states; `PostFormPage` gains validation
- **Backend**: `GET /api/posts` gains optional `page`, `size`, `sort` query params; `Post` entity gets `@Size` validation annotations
- **No breaking changes**: Pagination is opt-in; existing API behavior unchanged for callers not using pagination params
