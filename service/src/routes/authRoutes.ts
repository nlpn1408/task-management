import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();    

router.post("/start-login", authController.startLogin);
router.post("/verify-otp", authController.verifyOtp);
// router.post("/register", authController.register);
export default router;