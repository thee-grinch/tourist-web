const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const { adminMiddleware } = require('../middleware/auth');

// Get all blog posts
router.get('/posts', cmsController.getAllPosts);

// Get a single blog post by ID
router.get('/posts/:id', cmsController.getPostById);

// Admin routes for managing blog posts
router.post('/admin/posts', adminMiddleware, cmsController.createPost);
router.put('/admin/posts/:id', adminMiddleware, cmsController.updatePost);
router.delete('/admin/posts/:id', adminMiddleware, cmsController.deletePost);

module.exports = router;