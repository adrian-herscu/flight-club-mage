# GitHub Copilot Instructions

## Project Overview

**Flight Club Mage** is a flight school management system built with **Wasp** (v0.21.x), a full-stack web framework that uses React for the frontend and Node.js for the backend with Prisma ORM.

## Priority Guidelines

When generating code for this repository:

1. **Version Compatibility**: Strictly adhere to the exact versions in `package.json` and `main.wasp`
2. **Wasp Conventions**: Follow Wasp's declarative patterns for routes, pages, actions, and queries
3. **Codebase Patterns**: Match existing code style in `src/` directory
4. **Role-Based Access**: Respect the role system (`student`, `schoolOwner`, `superAdmin`)
5. **Code Quality**: Prioritize maintainability, security, and consistency

## Technology Stack

### Exact Versions (DO NOT use features beyond these)
- **Wasp**: ^0.21.0
- **React**: ^19.2.1
- **React Router**: ^7.12.0
- **TypeScript**: 5.8.2
- **Prisma**: 5.19.1
- **Tailwind CSS**: ^4.1.18
- **Vite**: ^7.0.6
- **Database**: SQLite (development)

### File Structure
```
main.wasp          # Wasp app declaration (routes, pages, actions, queries)
schema.prisma      # Database models
src/
  actions.js       # Server-side mutations
  queries.js       # Server-side data fetching
  Layout.jsx       # Root layout component
  pages/           # Page components
    auth/          # Authentication pages
```

## Wasp-Specific Guidelines

### Declaring Routes and Pages (main.wasp)
```wasp
route ExampleRoute { path: "/example/:id", to: ExamplePage }
page ExamplePage {
  component: import ExamplePage from "@src/pages/Example",
  authRequired: true
}
```

### Declaring Actions (main.wasp)
```wasp
action actionName {
  fn: import { actionName } from "@src/actions.js",
  entities: [Entity1, Entity2]
}
```

### Declaring Queries (main.wasp)
```wasp
query queryName {
  fn: import { queryName } from "@src/queries.js",
  entities: [Entity1]
}
```

## Backend Code Patterns

### Actions (src/actions.js)
```javascript
import { HttpError } from 'wasp/server'

export const actionName = async (args, context) => {
  // 1. Always check authentication first
  if (!context.user) { throw new HttpError(401) }
  
  // 2. Check role-based authorization
  if (context.user.role !== 'requiredRole') { 
    throw new HttpError(403, 'Descriptive error message') 
  }
  
  // 3. Perform database operations via context.entities
  const result = await context.entities.Entity.create({
    data: { /* ... */ }
  });
  
  return result;
}
```

### Queries (src/queries.js)
```javascript
import { HttpError } from 'wasp/server'

export const queryName = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  
  return context.entities.Entity.findMany({
    where: { /* filter conditions */ },
    include: { /* related entities */ }
  });
}
```

### Error Handling
- Use `HttpError` from `wasp/server` for all errors
- 401 for unauthenticated requests
- 403 for unauthorized requests (with descriptive message)
- 404 for not found resources

## Frontend Code Patterns

### Page Components (src/pages/*.jsx)
```jsx
import React from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { queryName, actionName } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { useParams } from 'react-router';

const PageName = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery(queryName, { variables: { id } });
  const actionFn = useAction(actionName);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  return (
    <div className="p-4">
      {/* Tailwind CSS for styling */}
    </div>
  );
};

export default PageName;
```

### Import Patterns
```javascript
// Wasp client imports
import { useQuery, useAction } from 'wasp/client/operations';
import { queryName, actionName } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';

// React Router (for params)
import { useParams } from 'react-router';
```

## Database Patterns (schema.prisma)

### Model Definition
```prisma
model EntityName {
    id        Int      @id @default(autoincrement())
    name      String
    // Foreign key with relation
    parentId  Int
    parent    Parent   @relation(fields: [parentId], references: [id])
    // Reverse relation
    children  Child[]
}
```

### Many-to-Many Relations
```prisma
model JoinTable {
    userId    Int
    entityId  Int
    user      User   @relation(fields: [userId], references: [id])
    entity    Entity @relation(fields: [entityId], references: [id])
    
    @@id([userId, entityId])
}
```

## Styling Guidelines

- Use **Tailwind CSS** utility classes exclusively
- Common patterns:
  - Container: `p-4`
  - Card: `bg-gray-100 p-4 mb-2 rounded-lg`
  - Heading: `text-2xl font-bold mb-4`
  - Subheading: `text-xl font-semibold mb-2`
  - Link: `text-blue-500 hover:underline`
  - Button: `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`

## Role-Based Authorization

### User Roles
- `student` (default): Can enroll in courses, view progress
- `schoolOwner`: Can register schools, manage courses, finalize syllabi
- `superAdmin`: Full system access

### Authorization Check Pattern
```javascript
// In actions/queries
if (context.user.role !== 'schoolOwner' && context.user.role !== 'superAdmin') {
  throw new HttpError(403, 'User does not have the necessary role.')
}
```

## Database Migrations

When modifying `schema.prisma`:
1. Run `wasp db migrate-dev` to create migration
2. Migration files go in `migrations/` directory
3. Use descriptive migration names

## Testing Considerations

- Queries should handle empty results gracefully
- Actions should validate all required fields
- Always verify entity relationships exist before operations

## Security Best Practices

- Never expose user passwords or sensitive data in queries
- Always authenticate before any database operation
- Validate user ownership/management rights for mutations
- Use parameterized queries (Prisma handles this automatically)

## General Code Style

- Use ES modules (`import`/`export`)
- Prefer `const` over `let`
- Use descriptive variable names
- Keep functions focused and single-purpose
- Handle loading and error states in UI components
- Use early returns for guard clauses
