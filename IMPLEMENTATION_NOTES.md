# Implementation Notes

## Technology Stack
*   **Framework**: SvelteKit 2.x with Svelte 5.
*   **Language**: Javascript/Typescript (JSDoc typed).
*   **Database**: PostgreSQL.
*   **ORM**: Prisma.
*   **CSS**: Tailwind CSS v4 (using PostCSS).

## Directory Structure
*   `src/lib/server/prisma.js`: Singleton Prisma client instance.
*   `src/routes/+page.server.js`: Dashboard data loading (fetches user's maps with server-side auth check).
*   `src/routes/map/[id]`: The detailed view/editor for a specific map. The `[id]` parameter is used to fetch the map content.
*   `src/api`: Backend API routes for async operations (CRUD on nodes/maps) called by the client.

## Data Fetching & State Management
*   **Server-Side**: `load` functions in `+page.server.js` handle initial data fetching, ensuring content is SEO-friendly and fast to load. It verifies `locals.user` exists.
*   **Auth**: Authentication state is managed via `locals.user`, which is likely populated in `hooks.server.js` by verifying a session token/JWT from cookies.
*   **JSON Storage Strategy**: 
    - The `MindMap` model uses a `Json` type for the `content` field.
    - **Pros**: Simplifies the relational schema (no recursive SQL queries needed for tree retrieval) and allows fast loading of the entire map.
    - **Cons**: Requires the application layer to strictly handle integrity and structure. Updates to a single node require updating the generic JSON structure, although efficient JSON path updates in Postgres could be utilized if needed.

## Environment Variables
Required `.env` variables:
*   `DATABASE_URL`: Connection string for PostgreSQL.
*   `GOOGLE_CLIENT_ID`: OAuth client ID for Google Sign-In.
*   `GOOGLE_CLIENT_SECRET`: OAuth secret.
*   `JWT_SECRET`: Secret key for signing session tokens (if strictly JWT based).

## Development Setup
1.  Run `npm install`.
2.  Set up `.env` with valid credentials.
3.  Run `npx prisma db push` to sync schema.
4.  Run `npm run dev` to start the server.
