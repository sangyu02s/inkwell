## 1. Backend - Data Model

- [x] 1.1 Create `Tag` entity with id and name (unique, 1-50 chars)
- [x] 1.2 Create `InkTag` junction entity with composite key (inkId, tagId) (cancelled - handled by @ManyToMany)
- [x] 1.3 Create `TagRepository` extending JpaRepository
- [x] 1.4 Add `@ManyToMany` relationship from `Ink` to `Tag`

## 2. Backend - Tag Service & Controller

- [x] 2.1 Create `TagService` with create, findAll, findByPrefix methods
- [x] 2.2 Create `TagController` with GET /api/tags and POST /api/tags endpoints
- [x] 2.3 Add unique constraint handling for duplicate tag names (return 409)

## 3. Backend - Ink-Tag Association

- [x] 3.1 Add `getTags` and `setTags` methods to `InkService`
- [x] 3.2 Add GET /api/inks/{id}/tags endpoint
- [x] 3.3 Add PUT /api/inks/{id}/tags endpoint
- [x] 3.4 Add tagId validation (return 404 for non-existent tags)

## 4. Backend - Tag Filtering

- [x] 4.1 Update `InkRepository` with `findByTagName` and `findByTagNames` query methods
- [x] 4.2 Add tag query parameter support to GET /api/inks
- [x] 4.3 Add tags (multi-tag AND) query parameter support

## 5. Frontend - Types & API

- [x] 5.1 Add `Tag` type to frontend types
- [x] 5.2 Update `Ink` type to include tags array
- [x] 5.3 Create `tagsApi` with getAll, search, create methods
- [x] 5.4 Update `inksApi` to include tag-related methods

## 6. Frontend - TagInput Component

- [x] 6.1 Create `TagInput` component with text input
- [x] 6.2 Implement autocomplete dropdown (GET /api/tags?q=)
- [x] 6.3 Implement tag chip display with remove functionality
- [x] 6.4 Integrate TagInput into `InkFormPage`

## 7. Frontend - Tag Display

- [x] 7.1 Create `TagChip` component for read-only display
- [x] 7.2 Add tags display to `InkListPage` article cards
- [x] 7.3 Add tags display to `InkDetailPage`

## 8. Frontend - Tag Filtering

- [x] 8.1 Create `TagFilter` component for list page
- [x] 8.2 Implement filter state management
- [x] 8.3 Update `InkListPage` to filter by selected tag
