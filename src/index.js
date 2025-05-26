import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';
import userRoutes from './routes/user.routes.js';
import companyRoutes from './routes/company.routes.js';
import messageRoutes from './routes/message.routes.js';


dotenv.config();

//initialize express app
const app = express();
//configuring the port
const PORT = process.env.PORT || 3000;


// MongoDB connection   
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(chalk.green('MongoDB connected'))
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.get('/', (req, res) => {
  res.send('welcome to the Job Portal!');
});

app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/messages', messageRoutes);


app.listen(PORT, () => {
  console.log(chalk.yellowBright(`Server is running on http://localhost:${PORT}`));
});