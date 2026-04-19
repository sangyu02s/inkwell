## ADDED Requirements

### Requirement: Post form title validation
The system SHALL validate the post title field using a Zod schema that enforces 1-200 characters. Title MUST NOT be empty, blank-only, or exceed 200 characters.

#### Scenario: Valid title accepted
- **WHEN** user enters a title between 1 and 200 characters
- **THEN** Zod schema validation passes and form can be submitted

#### Scenario: Empty title rejected
- **WHEN** user submits with an empty title
- **THEN** validation error "Title is required" is displayed

#### Scenario: Blank-only title rejected
- **WHEN** user submits with a title containing only whitespace
- **THEN** validation error "Title is required" is displayed

#### Scenario: Title exceeding 200 characters rejected
- **WHEN** user enters a title with more than 200 characters
- **THEN** validation error "Title must be at most 200 characters" is displayed

### Requirement: Post form content validation
The system SHALL validate the post content field using a Zod schema that enforces non-empty content. Content MUST NOT be empty or blank-only.

#### Scenario: Valid content accepted
- **WHEN** user enters any non-empty, non-blank content
- **THEN** Zod schema validation passes and form can be submitted

#### Scenario: Empty content rejected
- **WHEN** user submits with empty content
- **THEN** validation error "Content is required" is displayed

#### Scenario: Blank-only content rejected
- **WHEN** user submits with content containing only whitespace
- **THEN** validation error "Content is required" is displayed

### Requirement: Form validation error display
The system SHALL display validation errors inline below each invalid field and prevent form submission when errors exist.

#### Scenario: Errors displayed inline
- **WHEN** user submits an invalid form
- **THEN** error messages appear below the corresponding input fields

#### Scenario: Submit blocked while invalid
- **WHEN** form has validation errors
- **THEN** submit button is disabled or submission is blocked until all errors are resolved
