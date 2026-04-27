## Context

Inkwell currently has no content organization - articles are only sortable by date. Users have requested the ability to tag articles with custom labels to organize and filter content by topic.

**Current state:**
- `Ink` entity with id, title, content, author, timestamps
- No tagging or categorization capability
- `InkRepository` with only basic CRUD from JpaRepository

**Constraints:**
- PostgreSQL not yet in use (H2 for development), but interface should support future migration
- Frontend uses React + TypeScript + TanStack Query
- Existing API style: REST endpoints returning JSON

## Goals / Non-Goals

**Goals:**
- Allow users to create tags with unique names (1-50 characters)
- Allow associating multiple tags with a single article
- Allow filtering article list by tag(s)
- Provide autocomplete for tag names when creating/editing articles
- Display tags on article list and detail views

**Non-Goals:**
- Hierarchical tag categories (flat tag namespace only)
- Tag editing or deletion (tags are append-only)
- Tag popularity analytics or suggestions
- Automatic tag generation from content
- Integration with external tagging systems

## Decisions

### Decision 1: Pure Tag Model (No Categories)

**Choice:** Flat tag namespace only, no hierarchical categories.

**Rationale:** Personal blog scale doesn't require category complexity. Tags are simpler to implement and more flexible for users. Categories can be added later if needed.

**Alternatives considered:**
- Category tree: Overkill for personal blog, more UI complexity
- Tag + Category hybrid: Can be added later without breaking tag design

### Decision 2: Junction Table for N:M Relationship

**Choice:** Explicit `ink_tags` junction table with composite primary key.

**Rationale:**
```sql
CREATE TABLE ink_tags (
  ink_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL,
  PRIMARY KEY (ink_id, tag_id)
);
```

**Alternatives considered:**
- JPA `@ManyToMany` with `@JoinTable` (less control, harder to query)
- Serialized tag list in Ink table (not normalized, harder to maintain)

**Trade-off:** More entities, but proper relational design allows efficient queries.

### Decision 3: Tags Append-Only

**Choice:** No tag deletion or editing API.

**Rationale:** Simplifies implementation. Tags used by multiple articles shouldn't be deleted casually. Users can simply not use a tag.

**Alternatives considered:**
- Full tag CRUD: More complexity for marginal utility
- Soft delete: Overkill for personal blog

### Decision 4: Tag Autocomplete Queries

**Choice:** `GET /api/tags?q=prefix` returns matching tags for autocomplete.

**Rationale:** Common UX pattern. Limits database load by requiring minimum 1 character before searching.

## API Design

### Tag Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tags` | List all tags (for management) |
| GET | `/api/tags?q=prefix` | Search tags by prefix (autocomplete) |
| POST | `/api/tags` | Create a new tag `{name}` |

### Ink Endpoints Extended

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/inks?tag=name` | Filter by single tag |
| GET | `/api/inks?tags=name1,name2` | Filter by multiple tags (AND) |
| GET | `/api/inks/{id}/tags` | Get tags for an ink |
| PUT | `/api/inks/{id}/tags` | Update tags for an ink `{tagIds: [1,2,3]}` |

## Data Model

```
┌─────────────────────────────────────────────────────────────┐
│                      Entity Diagram                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────┐         ┌──────────────┐         ┌─────────┐  │
│   │   Tag   │         │   ink_tags   │         │   Ink   │  │
│   ├─────────┤         ├──────────────┤         ├─────────┤  │
│   │ id (PK) │◄────┐   │ ink_id (FK)  │    ┌───│ id (PK) │  │
│   │ name    │     └───│ tag_id (FK)  │◄───│   │ title   │  │
│   │ (unique)│         │ (composite PK)│    │   │ content │  │
│   └─────────┘         └──────────────┘    │   │ ...     │  │
│                                           │   └────┬────┘  │
│                                           └────────┘       │
│                                               │            │
│                                           ManyToMany      │
│                                               │            │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Components

### TagInput Component
- Text input with autocomplete dropdown
- Shows existing matching tags as user types
- Selected tags shown as removable chips
- API: `GET /api/tags?q=prefix` for autocomplete

### TagFilter Component (List Page)
- Horizontal list of tag buttons
- Click to filter, click again to remove filter
- "All" button to clear filter

### Tag Display
- Small chips on article cards and detail page
- Read-only display, no interaction

## Risks / Trade-offs

1. **[Risk]** Tag name uniqueness race condition
   **→ Mitigation:** Use database unique constraint, catch ConstraintViolationException

2. **[Risk]** Large number of tags causing slow autocomplete
   **→ Mitigation:** Require minimum 1-char prefix, index on tag name

3. **[Trade-off]** Append-only tags vs user error correction
   **→ Acceptable** - users can simply not use incorrect tags

4. **[Trade-off]** No tag count caching
   **→ Acceptable** - simple COUNT queries are fast enough for personal blog scale

## Open Questions

1. Should tags be per-user (each user has their own tag namespace) or global?
   - **Decision:** Global tags - simpler, allows cross-user discovery

2. Maximum tags per article?
   - **Decision:** No hard limit (application-level reasonable limit of ~20)

3. Tag name case sensitivity?
   - **Decision:** Case-insensitive for user convenience, stored lowercase
