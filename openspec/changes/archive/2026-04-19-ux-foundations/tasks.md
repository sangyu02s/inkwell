## 1. Backend — Pagination & Validation

- [x] 1.1 Add `@Size(min = 1, max = 200)` on `Post.title` and `@NotBlank` on `Post.content`
- [x] 1.2 Update `PostController.findAll()` to accept `Pageable` parameter
- [x] 1.3 Verify `JpaRepository` already supports pagination (it does via `findAll(Pageable)`)
- [x] 1.4 Test pagination API: `GET /api/posts?page=0&size=5&sort=createdAt,desc`
- [x] 1.5 Test validation: POST with title > 200 chars returns HTTP 400

## 2. Frontend — API Layer Updates

- [x] 2.1 Update `postsApi.getAll()` to accept `{ page, size, sort }` params and return `Page<Post>`
- [x] 2.2 Create `src/types/Page.ts` with `Page<T>` interface (content, totalElements, totalPages, number, size)
- [x] 2.3 Update `Post` type to match backend (createdAt/updatedAt remain strings)

## 3. Frontend — Zod Form Validation

- [x] 3.1 Create `src/validation/schemas.ts` with `postTitleSchema` (1-200 chars) and `postContentSchema` (non-blank)
- [x] 3.2 Update `PostFormPage` to validate with Zod on submit
- [x] 3.3 Display inline error messages below each field on validation failure
- [x] 3.4 Disable submit button or block submission when validation errors exist

## 4. Frontend — Error Boundary

- [x] 4.1 Create `src/components/ErrorBoundary.tsx` extending React.Component with `componentDidCatch`
- [x] 4.2 Implement fallback UI with "Something went wrong" message and "Try Again" button
- [x] 4.3 Wrap each route in `App.tsx` with `<ErrorBoundary>` around `<Routes>`
- [ ] 4.4 Test: throw a deliberate error in a page to verify boundary catches it

## 5. Frontend — Loading Skeleton

- [x] 5.1 Create `src/components/Skeleton.tsx` with CSS shimmer `@keyframes`
- [x] 5.2 Create `src/components/PostListSkeleton.tsx` rendering 5-10 skeleton post cards
- [x] 5.3 Create `src/components/PostDetailSkeleton.tsx` rendering title + content placeholders
- [x] 5.4 Add skeleton state to `PostListPage` using `isLoading` from `useQuery`
- [x] 5.5 Add skeleton state to `PostDetailPage` using `isLoading` from `useQuery`

## 6. Frontend — Pagination UI

- [x] 6.1 Add page controls component (`<Pagination>`) with Prev/Next buttons and page numbers
- [x] 6.2 Display "Showing X–Y of Z posts" summary below post list
- [x] 6.3 Wire `onPageChange` to refetch with new page param
- [x] 6.4 Disable Prev on page 0, disable Next on last page

## 7. Integration & Verification

- [x] 7.1 Run `npm run build` / `tsc -b` — fix any TypeScript errors
- [x] 7.2 Run `npm run lint` — fix any lint errors
- [x] 7.3 End-to-end test: create post, list with pagination, view detail, edit, delete
- [x] 7.4 Verify error boundary triggers on network error (offline test)
