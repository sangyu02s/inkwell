## ADDED Requirements

### Requirement: Tag creation
The system SHALL allow creating tags with unique names between 1 and 50 characters.

#### Scenario: Create tag successfully
- **WHEN** user creates a tag with name "spring"
- **THEN** the system returns the created tag with a generated ID and the tag is stored in the database

#### Scenario: Create tag with duplicate name
- **WHEN** user creates a tag with name "spring" but a tag with that name already exists
- **THEN** the system returns a 409 Conflict error with message "Tag already exists"

#### Scenario: Create tag with empty name
- **WHEN** user creates a tag with empty or blank name
- **THEN** the system returns a 400 Bad Request error

#### Scenario: Create tag with name exceeding 50 characters
- **WHEN** user creates a tag with name longer than 50 characters
- **THEN** the system returns a 400 Bad Request error

### Requirement: Tag listing and search
The system SHALL allow listing all tags and searching tags by name prefix.

#### Scenario: List all tags
- **WHEN** user requests GET /api/tags
- **THEN** the system returns all tags sorted alphabetically

#### Scenario: Search tags by prefix
- **WHEN** user requests GET /api/tags?q=spr
- **THEN** the system returns tags whose names start with "spr" (case-insensitive)

#### Scenario: Search returns empty for no matches
- **WHEN** user requests GET /api/tags?q=xyz
- **THEN** the system returns an empty array

### Requirement: Article-tag association
The system SHALL allow associating multiple tags with an article.

#### Scenario: Get tags for an article
- **WHEN** user requests GET /api/inks/{id}/tags
- **THEN** the system returns all tags associated with that article

#### Scenario: Update tags for an article
- **WHEN** user requests PUT /api/inks/{id}/tags with body {tagIds: [1, 2, 3]}
- **THEN** the system replaces all existing tag associations with the new set

#### Scenario: Update tags with invalid tag ID
- **WHEN** user requests PUT /api/inks/{id}/tags with a tagId that does not exist
- **THEN** the system returns a 404 Not Found error

### Requirement: Tag-based article filtering
The system SHALL allow filtering the article list by tag(s).

#### Scenario: Filter by single tag
- **WHEN** user requests GET /api/inks?tag=spring
- **THEN** the system returns only articles that have the tag "spring"

#### Scenario: Filter by multiple tags
- **WHEN** user requests GET /api/inks?tags=spring,java
- **THEN** the system returns only articles that have BOTH tags "spring" AND "java"

#### Scenario: Filter by non-existent tag
- **WHEN** user requests GET /api/inks?tag=nonexistent
- **THEN** the system returns an empty page

### Requirement: Tag display on articles
The system SHALL display tags on article list and detail views.

#### Scenario: Tags shown on article list
- **WHEN** user views the article list
- **THEN** each article card displays its associated tags as chips

#### Scenario: Tags shown on article detail
- **WHEN** user views an article detail page
- **THEN** all associated tags are displayed below the title
