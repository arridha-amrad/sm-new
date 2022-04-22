import { Router } from 'express';
import createReplyCommentController from '../controllers/replyComment/createReplyCommentController';
import deleteReplyCommentController from '../controllers/replyComment/deleteReplyCommentController';
import likeReplyCommentController from '../controllers/replyComment/likeReplyCommentController';
import { verifyAuthToken } from '../services/JwtServices';

const router = Router();

router.post('/:commentId', verifyAuthToken, createReplyCommentController);
router.post('/like/:replyId', verifyAuthToken, likeReplyCommentController);
router.delete('/:replyId', verifyAuthToken, deleteReplyCommentController);

export default router;
