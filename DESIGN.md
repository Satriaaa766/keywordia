# Keyword - Mind Map Application Design

## 1. Overview
Keyword is a web-based mind mapping tool that allows users to create, edit, and manage mind maps. It focuses on simplicity and ease of use, providing a clean interface for structuring ideas and brainstorming.

## 2. Architecture
The application works as a full-stack web app:
*   **Frontend**: SvelteKit (Svelte 5) for reactive UI and server-side rendering (SSR).
*   **Backend**: SvelteKit Server Routes (API endpoints and Server Actions) acting as the backend.
*   **Database**: PostgreSQL for persistent storage.
*   **ORM**: Prisma for type-safe database access.
*   **Styling**: Tailwind CSS for utility-first styling.

## 3. Data Model
### User
*   System supports Google OAuth for authentication.
*   Stores generic user profile (email, name, Google ID).

### MindMap
*   Represents a single document.
*   **Structure**: The `content` field stores the entire tree structure as a JSON object. This allows for flexible schema evolution within the map structure without altering the database schema for every node type.
*   **Ownership**: Linked to a User.
*   **Visibility**: Supports public/private visibility (boolean flag).

## 4. Key Components
*   **Dashboard**: Validates user session and lists owned mind maps.
*   **Editor**: A canvas-based interactive editor to manipulate the JSON tree structure. Uses a recursive data structure where each node has `text` and `children`.

## 5. Security & Auth
*   Session-based authentication using HTTP-only cookies (managed via `src/hooks.server.js` and `locals`).
*   Google OAuth integration for identity verification.
