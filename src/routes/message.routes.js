import express from 'express';  
import sendMessage from '../controllers/message/sendMessage.js';
import getMessages from '../controllers/message/getMessage.js';



import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/send', verifyToken,sendMessage);
router.get('/get', verifyToken, getMessages);

export default router;
