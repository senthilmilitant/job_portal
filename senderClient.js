import { io } from 'socket.io-client';

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzU4NGMzOTBlMWFlNzg2YzQxODgxMyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ4MzQ0MjYyLCJleHAiOjE3NDg5NDkwNjJ9.8dcTaac4Y7Fog8D7aRCPQpWKqGacwn4ZJ5lc-fOuYQk'; // Replace with actual JWT token of the sender

const socket = io('http://localhost:5500', {
  auth: { token },
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Sender connected');

  setTimeout(() => {
    socket.emit('sendMessage', {
      receiverId: '683560da6bf0c36d08ced683',
      receiverModel: 'Company',
      content: 'this is socket connection!'
    });
  }, 1000);
});

socket.on('messageDelivered', (msg) => {
  console.log('Message delivered:', msg);
});

socket.on('errorMessage', (err) => {
  console.error('Server error:', err);
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
});
