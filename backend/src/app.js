const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['https://buscapet-map.vercel.app', 'https://buscapet.onrender.com', 'https://buscapet-production.up.railway.app'],
        methods: ['GET', 'POST']
    }
});

let markers = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    socket.emit('existingMarkers', markers);

    socket.on('addMarker', (markerData) => {
        markers.push(markerData);
        io.emit('newMarker', markerData);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

server.listen(3002, () => {
    console.log('Server open');
});
