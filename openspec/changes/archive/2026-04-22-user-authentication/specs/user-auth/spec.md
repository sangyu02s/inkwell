## ADDED Requirements

### Requirement: User registration
The system SHALL allow users to register with username, email, and password.

#### Scenario: Successful registration
- **WHEN** user submits valid registration form with username "alice", email "alice@example.com", and password "SecurePass123"
- **THEN** system creates user record with BCrypt-hashed password
- **AND** system returns JWT token in response body
- **AND** user is automatically logged in

#### Scenario: Duplicate username
- **WHEN** user submits registration with username that already exists
- **THEN** system returns 409 Conflict with error message "Username already taken"
- **AND** no user is created

#### Scenario: Invalid email format
- **WHEN** user submits registration with invalid email format
- **THEN** system returns 400 Bad Request with validation error "Invalid email format"
- **AND** no user is created

#### Scenario: Weak password
- **WHEN** user submits registration with password shorter than 8 characters
- **THEN** system returns 400 Bad Request with validation error "Password must be at least 8 characters"
- **AND** no user is created

### Requirement: User login
The system SHALL allow users to log in with username and password.

#### Scenario: Successful login
- **WHEN** user submits login form with correct username and password
- **THEN** system returns JWT token in response body
- **AND** token contains userId and username claims

#### Scenario: Invalid credentials
- **WHEN** user submits login with wrong password
- **THEN** system returns 401 Unauthorized with error message "Invalid credentials"
- **AND** no token is returned

#### Scenario: Nonexistent user
- **WHEN** user submits login with username that does not exist
- **THEN** system returns 401 Unauthorized with error message "Invalid credentials"
- **AND** no token is returned

### Requirement: JWT token validation
The system SHALL validate JWT tokens on protected endpoints.

#### Scenario: Valid token
- **WHEN** request includes valid JWT token in Authorization header
- **THEN** request proceeds to handler
- **AND** handler can access userId from token

#### Scenario: Missing token on protected endpoint
- **WHEN** request to POST/PUT/DELETE endpoint has no Authorization header
- **THEN** system returns 401 Unauthorized with error message "Authentication required"
- **AND** no data is modified

#### Scenario: Expired token
- **WHEN** request includes expired JWT token
- **THEN** system returns 401 Unauthorized with error message "Token expired"
- **AND** no data is modified

#### Scenario: Malformed token
- **WHEN** request includes malformed JWT token
- **THEN** system returns 401 Unauthorized with error message "Invalid token"
- **AND** no data is modified

### Requirement: Password security
The system SHALL store passwords using BCrypt hashing with salt rounds of at least 10.

#### Scenario: Password stored securely
- **WHEN** user registers with password "MyPassword123"
- **THEN** database stores bcrypt hash, not plaintext
- **AND** original password cannot be recovered from stored hash