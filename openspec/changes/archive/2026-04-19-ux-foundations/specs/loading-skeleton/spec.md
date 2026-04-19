## ADDED Requirements

### Requirement: Post list loading skeleton
The post list page SHALL display a skeleton loading state while fetching the posts list, showing placeholder rows that mimic the post card layout.

#### Scenario: Skeleton shown during initial load
- **WHEN** user navigates to the post list page
- **AND** data is still being fetched
- **THEN** skeleton placeholder rows are displayed instead of the empty screen

#### Scenario: Skeleton count matches expected items
- **WHEN** skeleton is shown on post list
- **THEN** 5-10 skeleton rows are displayed to indicate loading

### Requirement: Post detail loading skeleton
The post detail page SHALL display a skeleton loading state while fetching the single post.

#### Scenario: Skeleton shown during detail fetch
- **WHEN** user navigates to a post detail page
- **AND** data is still being fetched
- **THEN** skeleton placeholder content is displayed

#### Scenario: Detail skeleton mimics layout
- **WHEN** skeleton is shown on post detail
- **THEN** it displays placeholder for title and content areas with appropriate widths

### Requirement: Skeleton CSS animation
Skeleton placeholders SHALL display a shimmer effect indicating they are loading, not static placeholders.

#### Scenario: Shimmer animation runs
- **WHEN** skeleton is displayed
- **THEN** a CSS `@keyframes` shimmer animation runs on placeholder elements
