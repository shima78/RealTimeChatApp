const chatForm = document.getElementById('chat-form');
const anwersForm = document.getElementById('chat-form-answers');

const socket = io();

const chatMessages = document.querySelector('.chat-messages');
const chatAnswers = document.querySelector('.chat-answers')

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


//recieve a message from server
socket.on('answer', answer => {
    // console.log(message);
    outputAnswer(answer);

    //scrol down on new message
    chatAnswers.scrollTop = chatAnswers.scrollHeight;
    document.getElementById('ans').value = '';
    document.getElementById('ans').focus();
});





//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get message text
    const msg = document.getElementById('msg').value;
    //emit a message to server
    socket.emit('chatMessage', msg);
})

anwersForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get message text
    const ans = document.getElementById('ans').value;
    //emit a message to server
    socket.emit('chatAnswer', ans);
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


//output Answer to DOM
function outputAnswer(answer) {
    const div = document.createElement('div');
    div.classList.add('answer');
    div.innerHTML = 	`<p class="meta">${answer.username}<span> ${answer.time}</span></p>
    <p class="text">
        ${answer.text}
    </p>`;
    document.querySelector('.chat-answers').appendChild(div);
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