const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,  getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const botName = 'admin';
const PORT  = 3000;
const app = express();

//we need a server that we can access
const server = http.createServer(app)
//set static folder 
app.use(express.static(path.join(__dirname, 'public')))


const io = socketio(server);
//Run when a client connects
io.on('connection',socket =>{
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
    
        socket.join(user.room);
    
        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
    
        // Broadcast when a user connects
        socket.broadcast.to(user.room)
        .emit('message',
        formatMessage(botName, `${user.username} has joined the chat`)
          );
          
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        })
    
 
      });

    //listen for chatMessage
    socket.on('chatMessage',msg => {
        const user = getCurrentUser(socket.id)
        //show this message to everone
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })

    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);
        console.log(user)
        //to emit all the clinets in general we can use io.emit
        if (user) {
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has 
            left the chat`));
        }
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        })
    })

})

server.listen(PORT, ()=>{console.log(`server running on port  ${PORT}`)});