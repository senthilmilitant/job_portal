import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';
import http from 'http';

import userRoutes from './routes/user.routes.js';
import companyRoutes from './routes/company.routes.js';
import messageRoutes from './routes/message.routes.js';
import setupSocketIO, { connectedClients } from './socket.js';
import { initSocketDependencies } from './controllers/message/sendMessage.js'; // ✅ Import the initializer

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

//  Set up Socket.IO and get `io` instance
const io = setupSocketIO(server);

// Inject dependencies for use in sendMessage HTTP controller
initSocketDependencies(io, connectedClients);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(chalk.green('MongoDB connected'));
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Job Portal!');
});
// Register routes
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/messages', messageRoutes);

// Start server
server.listen(PORT, () => {
  console.log(chalk.yellowBright(`Server is running on http://localhost:${PORT}`));
});
