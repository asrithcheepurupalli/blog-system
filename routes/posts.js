
const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

// Create Post
router.post('/create', async (req, res) => {
  const { title, content, tags } = req.body;
  const post = new Post({
    title,
    content,
    tags,
    author: req.user.userId,
  });
  await post.save();
  res.status(201).send('Post created');
});

// Get All Posts
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username');
  res.json(posts);
});

// Update Post
router.put('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.user.userId) {
    return res.status(403).send('Unauthorized');
  }
  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  await post.save();
  res.send('Post updated');
});

// Delete Post
router.delete('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.user.userId) {
    return res.status(403).send('Unauthorized');
  }
  await post.remove();
  res.send('Post deleted');
});

module.exports = router;
