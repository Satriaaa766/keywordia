import { configureServer } from './webSocket.js';

export const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server) {
        if (server.httpServer) {
            configureServer(server.httpServer);
        }
    }
};
