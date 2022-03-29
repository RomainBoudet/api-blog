import express from 'express';
const {Router} = express;
const router = Router();

import postController from './controllers/postController.mjs';

router.get('/posts', postController.allPosts);
router.get('/posts/:id(\\d+)', postController.onePost);
router.get('/posts/category/:id(\\d+)', postController.postsByCategory);
router.post('/posts', postController.newPost);


export default router;