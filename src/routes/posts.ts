import express, { Router } from 'express';
import {
  getPosts,
  createPost,
  editPost,
  delPost,
} from '../controllers/postsControllers';
import { isAuth } from '../service/auth';

const router: Router = express.Router();

router.get('/', getPosts);
router.post('/', isAuth, createPost);
router.patch('/:id', isAuth, editPost);
router.delete('/:id', isAuth, delPost);

export default router;
