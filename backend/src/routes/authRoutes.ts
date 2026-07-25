import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController';
import { registerValidation, loginValidation } from '../validators/authValidator';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/me', protect, getMe);

export default router;
