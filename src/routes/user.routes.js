import express from 'express';
import userSignup from '../controllers/users/signup.js';
import verifyOtp from '../controllers/users/verifyOtp.js';
import login from '../controllers/users/login.js';
import logout from '../controllers/users/logout.js'; 
import getProfile from '../controllers/users/getProfile.js';  
import updateProfile from '../controllers/users/updateProfile.js';
import uploadProfileImage from '../controllers/users/uploadProfileimage.js'
import applyJob from '../controllers/users/applyjob.js';
import searchJobs from '../controllers/users/searchJobs.js';
import searchProfiles from '../controllers/users/searchProfiles.js';
import filterJobs from '../controllers/users/filterJobs.js';
import listJobs from '../controllers/users/listJobs.js';
import viewAppliedJobs from '../controllers/users/viewAppliedJobs.js';

import { updateProfileSchema,searchProfilesSchema } from '../validations/userValidation.js';
import { signupSchema,verifyOtpSchema,loginSchema, } from '../validations/authValidation.js';
import { validate } from '../middlewares/validate.js';
import  upload  from '../middlewares/upload.js';
import { verifyToken } from '../middlewares/verifyToken.js';

 

const router = express.Router();

router.post('/signup', validate(signupSchema), userSignup);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/login', validate(loginSchema), login);
router.post('/logout', verifyToken, logout);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, validate(updateProfileSchema), updateProfile);
router.post('/upload-profile-image', verifyToken, upload.single('profileImage'), uploadProfileImage);
router.post('/apply-job', verifyToken, applyJob);
router.get('/search-profiles', verifyToken, validate(searchProfilesSchema), searchProfiles);
router.get('/search-jobs', verifyToken, searchJobs);
router.get('/filter-jobs', verifyToken, filterJobs);
router.get('/list-jobs', verifyToken, listJobs);
router.get('/view-applied-jobs', verifyToken, viewAppliedJobs);

export default router;
