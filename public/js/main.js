const chatForm = document.getElementById('chat-form');
const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

 
// Join chatroom
socket.emit('joinRoom', { username, room });


//get room and users 
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);

});

//recieve a message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scrol down on new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();
});

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get message text
    const msg = document.getElementById('msg').value;
    //emit a message to server
    socket.emit('chatMessage', msg);
})

//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = 	`<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//add users to DOM
function outputUsers(users){
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
}