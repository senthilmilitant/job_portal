import express from 'express';
import signup from '../controllers/company/signup.js';
import verifyOtp from '../controllers/company/verifyOtp.js';
import login from '../controllers/company/login.js';
import logout from '../controllers/company/logout.js'
import getProfile from '../controllers/company/getprofile.js';
import updateProfile from '../controllers/company/updateProfile.js';   
import uploadImage from '../controllers/company/uploadImage.js'; 
import postJob from '../controllers/company/postJob.js';
import bulkUploadJobs from '../controllers/company/bulkUploadJobs.js';
import viewApplicants from '../controllers/company/viewApplicants.js';
import filterApplicants from '../controllers/company/filterApplicants.js';
import updateJob from '../controllers/company/updateJob.js';
import deleteJob from '../controllers/company/deleteJob.js';


import { signupSchema,verifyOtpSchema,loginSchema } from '../validations/authValidation.js';
import { updateProfileSchema } from '../validations/companyValidation.js';
import { postJobSchema } from '../validations/jobValidation.js';
import { validate } from '../middlewares/validate.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import upload from '../middlewares/upload.js'; // Assuming you have a middleware for handling file uploads
import excelUpload from '../middlewares/excelUpload.js';


const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, validate(updateProfileSchema), updateProfile);
router.post('/profile/image', verifyToken, upload.single('image'), uploadImage);
router.post('/jobs', verifyToken, validate(postJobSchema), postJob);
router.post('/jobs/bulk-upload', verifyToken, excelUpload.single('file'), bulkUploadJobs);
router.get('/jobs/:jobId/applicants', verifyToken, viewApplicants);
router.get('/jobs/:jobId/applicants/filter', verifyToken, filterApplicants);
router.put('/jobs/:jobId', verifyToken, updateJob);
router.delete('/jobs/:jobId', verifyToken, deleteJob);

export default router;
