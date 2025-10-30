const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());


const server = http.createServer(app);


// Allow origins for development; change to your production origin
const io = new Server(server, {
cors: {
origin: '*',
methods: ['GET', 'POST']
}
});


const PORT = process.env.PORT || 4000;


// Keep an in-memory list of messages (simple example)
let messages = [];


io.on('connection', (socket) => {
console.log('a user connected', socket.id);


// Send existing messages to newly connected client
socket.emit('init', messages);


socket.on('join', (username) => {
socket.data.username = username || 'Anonymous';
console.log(`${socket.data.username} joined (${socket.id})`);
io.emit('user-joined', { id: socket.id, username: socket.data.username });
});


socket.on('chat-message', (payload) => {
// payload expected: { username, text, time }
const msg = {
id: Date.now() + '-' + Math.random().toString(36).slice(2, 9),
username: payload.username || socket.data.username || 'Anonymous',
text: payload.text || '',
time: payload.time || new Date().toISOString()
};


// store message (in-memory). For production use DB.
messages.push(msg);
// limit stored messages to last 200
if (messages.length > 200) messages.shift();


// broadcast to all clients including sender
io.emit('message', msg);
});


socket.on('disconnect', (reason) => {
console.log('user disconnected', socket.id, reason);
io.emit('user-left', { id: socket.id, username: socket.data.username });
});
});


// Optional: simple health route
app.get('/', (req, res) => res.send('Real-time chat server running'));


server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
