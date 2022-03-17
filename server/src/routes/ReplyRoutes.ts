import { Router } from 'express';
import createReplyCommentController from '../controllers/replyComment/createReplyCommentController';
import deleteReplyCommentController from '../controllers/replyComment/deleteReplyCommentController';
import likeReplyCommentController from '../controllers/replyComment/likeReplyCommentController';
import { verifyAccessToken } from '../services/JwtServices';

const router = Router();

router.post('/:commentId', verifyAccessToken, createReplyCommentController);

router.post('/like/:replyId', verifyAccessToken, likeReplyCommentController);

router.delete('/:replyId', verifyAccessToken, deleteReplyCommentController);

export default router;
