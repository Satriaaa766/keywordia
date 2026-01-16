import { createServer } from 'http';
import { handler } from './build/handler.js';
import { configureServer } from './src/lib/server/webSocket.js';
import express from 'express';

const app = express();
const server = createServer(app);

// Configure Socket.IO
configureServer(server);

// Use SvelteKit handler
// Note: In production build, handler is typically imported from build/handler.js
// We assume 'build' script runs before start
app.use(handler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
