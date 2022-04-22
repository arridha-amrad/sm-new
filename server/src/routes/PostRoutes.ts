import express from 'express';
import createPostController from '../controllers/post/createPostController';
import deletePostController from '../controllers/post/deletePostController';
import getPostController from '../controllers/post/getPostController';
import getPostsController from '../controllers/post/getPostsController';
import likePostController from '../controllers/post/likePostController';
import updatePostController from '../controllers/post/updatePostController';
import { verifyAuthToken } from '../services/JwtServices';

const router = express.Router();

router.get('/', getPostsController);
router.get('/:postId', getPostController);

router.post('/create', verifyAuthToken, createPostController);
router.post('/like/:postId', verifyAuthToken, likePostController);

router.put('/:postId', verifyAuthToken, updatePostController);

router.delete('/:postId', verifyAuthToken, deletePostController);

export default router;
