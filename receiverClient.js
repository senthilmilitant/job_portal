import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzU2MGRhNmJmMGMzNmQwOGNlZDY4MyIsInJvbGUiOiJjb21wYW55IiwiaWF0IjoxNzQ4MzQ3NzkwLCJleHAiOjE3NDg5NTI1OTB9.aCTWvsp8bNKBNhMaR8qMNJ1AbjRS2AZ4nhCo9zXCkJo',
  },
});

socket.on('connect', () => {
  console.log('Receiver connected to socket server');
});

socket.on('receiveMessage', (msg) => {
  console.log(`✅ Received message from ${msg.senderModel}: ${msg.content}`);

  // Mark message as read
  socket.emit('markAsRead', msg._id);
});
