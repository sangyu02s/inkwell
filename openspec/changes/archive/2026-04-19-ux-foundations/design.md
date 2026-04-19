## Context

The blog is a minimal Spring Boot + React MVP. Core CRUD works but production UX patterns are missing: no form validation, unbounded list loading, no error boundaries, and no loading states. Phase 1 addresses these foundational gaps.

**Current State:**
- `GET /api/posts` returns `List<Post>` with no pagination
- `PostFormPage` uses only HTML5 `required` attributes
- No React error boundaries exist
- Data fetching shows nothing during loads (raw undefined states)

**Constraints:**
- Backend: Spring Boot 3.2, JPA with H2 (dev) / PostgreSQL (prod-ready)
- Frontend: React 19, React Query v5, React Router v7, Vite
- Zod already available as a dependency opportunity
- No TypeScript errors allowed (`as any` banned)

## Goals / Non-Goals

**Goals:**
- Add runtime form validation with Zod schemas
- Implement cursor-free offset pagination (page/size/sort)
- Prevent full-page JS crashes via ErrorBoundary
- Show skeleton loading states during data fetches

**Non-Goals:**
- Authentication (Phase 2)
- Image upload / rich text editing (Phase 3)
- Search, comments, likes (future phases)
- PostgreSQL migration (production hardening)

## Decisions

### D1: Zod Schema Validation

**Decision:** Use Zod for frontend form validation with a corresponding `@Size` enhancement on the backend.

**Alternatives considered:**
- React Hook Form + Zod (more overhead, not needed for simple forms)
- Just HTML5 validation (already insufficient)

**Rationale:** Zod provides compile-time type inference, runtime validation, and excellent error messages. Single source of truth for validation rules.

### D2: Offset Pagination (page/size/sort)

**Decision:** Use Spring Data's `Pageable` with offset pagination, not cursor-based.

**Alternatives considered:**
- Cursor pagination (better for infinite scroll at scale)
- Client-side pagination (bad for large datasets)

**Rationale:** Blog post lists are naturally small-to-medium. Offset pagination is simpler, supports jumping to arbitrary pages, and `Pageable` is native to Spring Data JPA. Frontend will show page numbers (1, 2, 3...) with prev/next controls.

**API Shape:**
```
GET /api/posts?page=0&size=10&sort=createdAt,desc
Response: {
  "content": [...],
  "totalElements": 42,
  "totalPages": 5,
  "number": 0,
  "size": 10
}
```

### D3: ErrorBoundary with Retry

**Decision:** Wrap each page route with an ErrorBoundary that shows a fallback UI with a retry button.

**Alternatives considered:**
- Global error boundary only (too coarse, hides context)
- try/catch per component (pollutes component logic)

**Rationale:** Route-level ErrorBoundary per page keeps concerns separated. Fallback shows the error message + retry button. Uses React's `componentDidCatch`.

### D4: CSS Skeleton (not JS-assisted)

**Decision:** Pure CSS skeleton using `@keyframes` shimmer animation.

**Alternatives considered:**
- `react-content-loader` library (extra dependency)
- `useProgress` from `@tanstack/react-query` (less granular)

**Rationale:** Minimal implementation. Skeleton components accept `count` prop and render N placeholder rows. No extra runtime dependency.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Pagination breaks existing callers relying on array response | Default `page=0&size=1000` behavior matches current list size |
| Zod schema drifts from backend validation | Backend uses `@Size` matching Zod rules (1-200 chars) |
| ErrorBoundary hides bugs during development | ErrorBoundary only wraps production builds; dev throws normally |

## Migration Plan

1. Add `spring-boot-starter-validation` dependency (already present)
2. Update `Post` entity with `@Size` annotations
3. Update `PostController.findAll()` to accept `Pageable`
4. Update `PostRepository` to extend `PagingAndSortingRepository` (or use `JpaRepository` with `@Query`)
5. Add `Page<Post>` response handling in frontend API layer
6. Add Zod schemas in `src/validation/schemas.ts`
7. Add `ErrorBoundary` wrapper in `App.tsx`
8. Add `Skeleton` component in `src/components/`
9. Update `PostListPage` and `PostDetailPage` with skeleton states
10. Update `PostFormPage` with Zod validation + error display

**Rollback:** Disable pagination via feature flag; revert Zod usage.

## Open Questions

- Should pagination be the default UI mode or opt-in? → **Default: enabled, show all pages**
- What page size? → **Default: 10 posts per page**
- Should skeleton be used for create/edit forms too? → **No, forms load fast; skip for simplicity**
