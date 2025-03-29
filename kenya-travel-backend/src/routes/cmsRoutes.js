const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const { auth } = require('../middleware/auth');

// Get all blog posts
router.get('/posts', cmsController.getAllPosts);

// Get a single blog post by ID
router.get('/posts/:id', cmsController.getPostById);

// Admin routes for managing blog posts
router.post('/admin/posts', auth('admin'), cmsController.createPost);
router.put('/admin/posts/:id', auth('admin'), cmsController.updatePost);
router.delete('/admin/posts/:id', auth('admin'), cmsController.deletePost);

module.exports = router;