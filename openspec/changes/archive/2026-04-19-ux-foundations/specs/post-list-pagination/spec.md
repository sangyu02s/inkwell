## ADDED Requirements

### Requirement: Paginated post list API
The system SHALL expose a paginated `GET /api/posts` endpoint that accepts `page`, `size`, and `sort` query parameters and returns a Spring `Page` object with content, totalElements, totalPages, number, and size.

#### Scenario: Default pagination (no params)
- **WHEN** client calls `GET /api/posts` with no query parameters
- **THEN** response returns a Page with default page=0, size=10, sorted by createdAt descending

#### Scenario: Explicit pagination params
- **WHEN** client calls `GET /api/posts?page=1&size=20&sort=createdAt,desc`
- **THEN** response returns page 1 with 20 items per page, sorted by createdAt descending

#### Scenario: Page beyond data range
- **WHEN** client requests a page number greater than available pages
- **THEN** response returns an empty content array with totalElements reflecting actual count

### Requirement: Post entity backend validation
The `Post` entity SHALL enforce title length (1-200 chars) and non-empty content via JPA `@Size` and `@NotBlank` annotations, returning HTTP 400 with field-level error details on validation failure.

#### Scenario: Title too long returns 400
- **WHEN** POST request contains title exceeding 200 characters
- **THEN** server returns HTTP 400 with JSON `{"title": "must be at most 200 characters"}`

#### Scenario: Empty content returns 400
- **WHEN** POST request contains empty content
- **THEN** server returns HTTP 400 with JSON `{"content": "must not be blank"}`

### Requirement: Frontend pagination controls
The post list page SHALL display page controls allowing users to navigate between pages and display current page / total pages information.

#### Scenario: Page navigation
- **WHEN** user clicks page number 2
- **THEN** list refreshes showing posts for page 2

#### Scenario: Previous/Next navigation
- **WHEN** user clicks "Previous" or "Next" button
- **THEN** list navigates to adjacent page if available

#### Scenario: Disabled prev on first page
- **WHEN** user is on page 1
- **THEN** "Previous" button is disabled

#### Scenario: Disabled next on last page
- **WHEN** user is on the last page
- **THEN** "Next" button is disabled

### Requirement: Pagination info display
The system SHALL display "Showing X-Y of Z posts" indicating current range and total count.

#### Scenario: Shows correct range on middle page
- **WHEN** viewing page 2 of 5 with 10 items per page
- **THEN** display shows "Showing 11-20 of 42 posts"
