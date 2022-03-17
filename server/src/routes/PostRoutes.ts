import express from 'express';
import createPostController from '../controllers/post/createPostController';
import deletePostController from '../controllers/post/deletePostController';
import getPostController from '../controllers/post/getPostController';
import getPostsController from '../controllers/post/getPostsController';
import likePostController from '../controllers/post/likePostController';
import updatePostController from '../controllers/post/updatePostController';
import { verifyAccessToken } from '../services/JwtServices';

const router = express.Router();

router.get('/', getPostsController);
router.get('/:postId', getPostController);

router.post('/create', verifyAccessToken, createPostController);
router.post('/like/:postId', verifyAccessToken, likePostController);

router.put('/:postId', verifyAccessToken, updatePostController);

router.delete('/:postId', verifyAccessToken, deletePostController);

export default router;
