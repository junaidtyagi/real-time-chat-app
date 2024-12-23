const express = require('express');
const cors = require('cors')
const app = express();

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes');


app.use(cors())
app.use(express.json({
    limit:"50mb"
}));
const server = require('http').createServer(app);
const io = require('socket.io')( server,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET','POST']
    }
})
 const onlineUsers = [];
io.on('connection',socket =>{
    socket.on('join-room', userid=>{
        socket.join(userid);
    })
    socket.on('send-message', (message)=>{
        io.to(message.members[0])
          .to(message.members[1])
          .emit('receive-message',message)

        io.to(message.members[0])
          .to(message.members[1])
          .emit('set-message-count',message)
    })
    socket.on('clear-unread-messages', (data)=>{
        io.to(data.members[0])
          .to(data.members[1])
          .emit('message-count-cleared',data)
    })
    socket.on('user-typing', (data)=>{
        io.to(data.members[0])
          .to(data.members[1])
          .emit('started-typing', data)
    })
    socket.on('user-login', userid =>{
        if(!onlineUsers.includes(userid)){
            onlineUsers.push(userid);
        }
        socket.emit('online-users',onlineUsers);
    })
    socket.on('user-offline',userId =>{
        onlineUsers.splice(onlineUsers.indexOf(userId),1)
        io.emit('online-users-updated',onlineUsers)
    })
})
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);


module.exports = server;