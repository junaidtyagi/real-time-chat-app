const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Global CORS middleware (for REST API routes)
app.use(cors({
  origin: "https://real-time-chat-app-client-yfml.onrender.com",  // Restrict to your frontend during development
  methods: ['GET', 'POST'],
  credentials: true  // Allow cookies if needed
}));

app.use(express.json({
  limit: "50mb"
}));

const server = require('http').createServer(app);

// Socket.IO server with specific CORS settings
const io = require('socket.io')(server, {
  cors: {
    origin: "https://real-time-chat-app-client-yfml.onrender.com",  // Adjust based on your frontend's URL
    methods: ['GET', 'POST'],
    credentials: true  // Allow cookies if needed
  }
});

const onlineUsers = [];

// Socket.IO events
io.on('connection', (socket) => {
  socket.on('join-room', userid => {
    socket.join(userid);
  });

  socket.on('send-message', (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit('receive-message', message);

    io.to(message.members[0])
      .to(message.members[1])
      .emit('set-message-count', message);
  });

  socket.on('clear-unread-messages', (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit('message-count-cleared', data);
  });

  socket.on('user-typing', (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit('started-typing', data);
  });

  socket.on('user-login', userid => {
    if (!onlineUsers.includes(userid)) {
      onlineUsers.push(userid);
    }
    socket.emit('online-users', onlineUsers);
  });

  socket.on('user-offline', userId => {
    onlineUsers.splice(onlineUsers.indexOf(userId), 1);
    io.emit('online-users-updated', onlineUsers);
  });
});

// REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

module.exports = server;
