## ADDED Requirements

### Requirement: Route-level error boundary
Each page route (`/`, `/posts/new`, `/posts/:id`, `/posts/:id/edit`) SHALL be wrapped in a dedicated ErrorBoundary component that catches JavaScript errors thrown in the component subtree.

#### Scenario: JS error caught by boundary
- **WHEN** a component throws an unhandled JavaScript error
- **THEN** ErrorBoundary catches it and displays a fallback UI instead of crashing the entire page

#### Scenario: Fallback UI with retry
- **WHEN** ErrorBoundary catches an error
- **THEN** a fallback UI is displayed with the error message and a "Try Again" button

#### Scenario: Retry resets error state
- **WHEN** user clicks "Try Again" on fallback UI
- **THEN** error state is reset and the component re-renders

### Requirement: Error boundary fallback UI
The fallback UI SHALL display a user-friendly error message and prevent the entire application from crashing.

#### Scenario: Fallback shows generic message
- **WHEN** ErrorBoundary catches any error
- **THEN** user sees "Something went wrong. Please try again." message

#### Scenario: Fallback shows technical detail in dev
- **WHEN** ErrorBoundary catches an error in development mode
- **THEN** error message includes the error stack for debugging
