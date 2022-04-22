import express from 'express';
import createCommentController from '../controllers/comment/createCommentController';
import deleteCommentController from '../controllers/comment/deleteCommentController';
import likeCommentController from '../controllers/comment/likeCommentController';
import updateCommentController from '../controllers/comment/updateCommentController';
import { verifyAuthToken } from '../services/JwtServices';

const router = express.Router();

router.post('/:postId', verifyAuthToken, createCommentController);
router.post('/like/:commentId', verifyAuthToken, likeCommentController);
router.delete('/:commentId', verifyAuthToken, deleteCommentController);
router.put('/:commentId', verifyAuthToken, updateCommentController);

export default router;
