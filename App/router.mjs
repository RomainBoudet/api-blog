import express from 'express';
const {Router} = express;
const router = Router();

import postController from './controllers/postController.mjs';

router.get('/posts', postController.allPosts);

export default router;