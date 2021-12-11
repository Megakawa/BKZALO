const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true,});
const socket = io();
socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {outputRoomName(room);outputUsers(users);});

socket.on('message', (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let msg = e.target.elements.msg.value;
  let file_input = e.target.elements.file_input.value;
  msg = msg.trim();
  file_input = file_input.trim();
  if (!msg&!file_input) {
    return false;
  }
  socket.emit('chatMessage', msg, document.querySelector('.iv').src);
  e.target.elements.msg.value = '';
  e.target.elements.file_input.value = '';
  e.target.elements.msg.focus();
  e.target.elements.file_input.focus();

});

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('div');
  p.classList.add('meta')
  if (message.file!=null){
    p.innerHTML += `<img src='${message.file}' style="width: 25px;"></img>`;
  }
  p.innerHTML += `<span style="color: blue;"> ${message.username}</span>`;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('text');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  const div2 = document.createElement('div');
  const img = document.createElement('img');
  if (message.file2!=null&&!message.file2.includes('http')){
    img.src=message.file2;
    img.style.cssText='width:200px';
    div2.appendChild(img);
    div.appendChild(div2);
  }
  document.querySelector('.iv').src="#";
  document.querySelector('.iv').style="visibility: hidden;";
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
function previewFile() {
  const preview = document.querySelector('.iv');
  const file = document.querySelector('input[type=file]').files[0];
  const reader = new FileReader();

  reader.addEventListener("load", function () {
    preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
  document.querySelector('.iv').style="visibility: visible; width:200px;";
}