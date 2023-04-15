import express, { Router } from 'express';
import {
  signup,
  signin,
  getUser,
  editUser,
  updatePassword,
} from '../controllers/usersControllers';
import { isAuth } from '../service/auth';

const router: Router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', isAuth, getUser);
router.patch('/profile', isAuth, editUser);
router.patch('/updatePassword', isAuth, updatePassword);

export default router;
