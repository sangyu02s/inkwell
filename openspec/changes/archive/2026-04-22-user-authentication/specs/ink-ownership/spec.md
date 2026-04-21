## ADDED Requirements

### Requirement: Ink authorship tracking
The system SHALL track which user created each ink via an `authorId` field.

#### Scenario: Author recorded on creation
- **WHEN** authenticated user creates a new ink
- **THEN** ink is saved with `authorId` set to the authenticated user's ID
- **AND** authorId cannot be changed after creation

#### Scenario: Author visible in responses
- **WHEN** user requests ink details
- **THEN** response includes `authorId` and `authorUsername` fields
- **AND** unauthenticated users can still read inks

### Requirement: Ownership-based write protection
The system SHALL allow only the author of an ink to edit or delete it.

#### Scenario: Author can edit own ink
- **WHEN** authenticated user who is the author sends PUT request to update their ink
- **THEN** ink is updated successfully
- **AND** response includes updated ink data

#### Scenario: Non-author cannot edit
- **WHEN** authenticated user who is NOT the author sends PUT request to update someone else's ink
- **THEN** system returns 403 Forbidden with error message "You can only edit your own inks"

#### Scenario: Author can delete own ink
- **WHEN** authenticated user who is the author sends DELETE request
- **THEN** ink is deleted successfully
- **AND** response returns 204 No Content

#### Scenario: Non-author cannot delete
- **WHEN** authenticated user who is NOT the author sends DELETE request
- **THEN** system returns 403 Forbidden with error message "You can only delete your own inks"
- **AND** ink remains in database

### Requirement: Public read access
The system SHALL allow anyone to read inks without authentication.

#### Scenario: Anonymous can list inks
- **WHEN** unauthenticated user sends GET request to list inks
- **THEN** system returns paginated list of all inks
- **AND** no authentication is required

#### Scenario: Anonymous can view ink detail
- **WHEN** unauthenticated user sends GET request to view ink detail
- **THEN** system returns full ink data including author info
- **AND** no authentication is required