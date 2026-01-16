import { Server } from 'socket.io';

export const configureServer = (server) => {
    const io = new Server(server);

    // Make io accessible globally for API routes
    global.io = io;

    io.on('connection', (socket) => {
        console.log('Client connected', socket.id);

        socket.on('join-map', (mapId) => {
            if (mapId) {
                socket.join(mapId);
                console.log(`Socket ${socket.id} joined map ${mapId}`);
            }
        });

        socket.on('leave-map', (mapId) => {
            if (mapId) socket.leave(mapId)
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
        });
    });

    console.log('Socket.IO server configured');
    return io;
};
