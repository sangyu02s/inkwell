## ADDED Requirements

### Requirement: Authentication state management
The frontend SHALL maintain user authentication state via AuthContext.

#### Scenario: User logged in state
- **WHEN** user has valid JWT token stored in cookies
- **THEN** AuthContext exposes `user: { id, username, email }` and `isAuthenticated: true`
- **AND** API requests automatically include Authorization header

#### Scenario: User logged out state
- **WHEN** no valid token exists in cookies
- **THEN** AuthContext exposes `user: null` and `isAuthenticated: false`

#### Scenario: Token expired in use
- **WHEN** API request returns 401 with "Token expired" message
- **THEN** AuthContext clears stored user and token
- **AND** page redirects to login

### Requirement: Login page
The frontend SHALL provide a login page at `/auth/login`.

#### Scenario: Login form renders
- **WHEN** user navigates to `/auth/login`
- **THEN** form displays username and password fields
- **AND** submit button is disabled until fields are filled

#### Scenario: Login form validation
- **WHEN** user submits empty username field
- **THEN** form shows inline error "Username is required"
- **AND** form is not submitted

#### Scenario: Successful login redirect
- **WHEN** user submits valid credentials
- **THEN** page redirects to `/inks`
- **AND** navigation shows username and logout option

#### Scenario: Failed login
- **WHEN** user submits invalid credentials
- **THEN** form shows error message "Invalid credentials"
- **AND** user stays on login page

### Requirement: Registration page
The frontend SHALL provide a registration page at `/auth/register`.

#### Scenario: Registration form renders
- **WHEN** user navigates to `/auth/register`
- **THEN** form displays username, email, password, and confirm password fields

#### Scenario: Password confirmation validation
- **WHEN** user fills password and confirmPassword with different values
- **THEN** form shows error "Passwords do not match"

#### Scenario: Successful registration
- **WHEN** user submits valid registration data
- **THEN** user is automatically logged in
- **AND** page redirects to `/inks`

### Requirement: Logout functionality
The frontend SHALL allow logged-in users to log out.

#### Scenario: Logout clears state
- **WHEN** authenticated user clicks logout
- **THEN** AuthContext clears user state
- **AND** cookie is cleared
- **AND** page redirects to `/auth/login`

### Requirement: Protected routes
The frontend SHALL protect write routes for unauthenticated users.

#### Scenario: Unauthenticated access to create ink
- **WHEN** unauthenticated user navigates to `/inks/new`
- **THEN** page redirects to `/auth/login?redirect=/inks/new`
- **AND** after login, user is redirected back to `/inks/new`

#### Scenario: Unauthenticated access to edit ink
- **WHEN** unauthenticated user navigates to `/inks/:id/edit`
- **THEN** page redirects to `/auth/login`

### Requirement: Current user info display
The frontend SHALL show current user info in navigation.

#### Scenario: Logged in navigation
- **WHEN** user is logged in as "alice"
- **THEN** navigation shows "alice" username
- **AND** shows "Logout" button

#### Scenario: Logged out navigation
- **WHEN** no user is logged in
- **THEN** navigation shows "Login" and "Register" links