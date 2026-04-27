## Why

Currently, Inkwell articles have no organizational structure - users can only browse by date or author. Adding a tag system allows users to freely categorize their articles with custom labels, enabling filtering and discovery by topic. This is a common feature in blogs that significantly improves content navigation without the complexity of a hierarchical category system.

## What Changes

- **New Tag entity**: Users can create tags with unique names (1-50 chars)
- **Ink-Tag association**: Articles can have multiple tags (N:M relationship via junction table)
- **Tag API endpoints**: CRUD operations for tags, association with articles
- **Tag filtering**: List articles filtered by one or more tags
- **Frontend tag input**: Tag input component with autocomplete from existing tags
- **Tag display**: Show tags on article list and detail pages

## Capabilities

### New Capabilities

- `post-tags`: Tag management and article-tag association
  - Create and list tags
  - Associate/dissociate tags with articles
  - Filter article list by tag(s)

### Modified Capabilities

- (none - this is purely additive)

## Impact

**Backend:**
- New `Tag` entity and `ink_tags` junction table
- New `TagRepository`
- New `TagService`
- New `TagController` (`/api/tags`)
- `Ink` entity modified with `@ManyToMany` tag relationship
- `InkController` extended with tag filtering query params
- `InkService` updated to handle tag associations

**Frontend:**
- New `Tag` type definition
- New `tagsApi` for tag operations
- `InkFormPage` enhanced with tag input component
- `InkListPage` enhanced with tag filter display
- Article detail display updated to show tags
