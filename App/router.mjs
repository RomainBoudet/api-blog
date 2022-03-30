import express from 'express';
const {Router} = express;
const router = Router();

// Import Controller
import postController from './controllers/postController.mjs';

// Import validation input
import clean from './MW/sanitizer.mjs';
import postSchema from './schemas/postSchema.mjs';
import validateBody from'./services/validator.mjs';

router.get('/posts', postController.allPosts);
router.get('/posts/:id(\\d+)', postController.onePost);
router.get('/posts/category/:id(\\d+)', postController.postsByCategory);
router.post('/posts', clean, validateBody(postSchema), postController.newPost);


export default router;