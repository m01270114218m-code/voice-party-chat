const express = require('express');
const Post = require('../models/Post');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');

const router = express.Router();

/** GET /api/posts?tab=recommended|popular&scope=friends|following */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { tab = 'recommended', scope = 'all', limit = 30 } = req.query;
  const filter = {};
  if (tab === 'recommended') filter.isRecommended = true;
  if (scope === 'following' && req.user) filter.authorId = { $in: req.user.friends };
  const posts = await Post.find(filter)
    .sort({ createdAt: -1 }).limit(parseInt(limit, 10))
    .populate('authorId', 'username avatar userId vipTier level')
    .populate('comments.userId', 'username avatar');
  res.json({ posts });
}));

/** POST /api/posts — create a post (text / images / audio / room card) */
router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { text = '', images = [], audioUrl = '', roomCard = null } = req.body;
  const post = await Post.create({ authorId: req.user._id, text, images, audioUrl, roomCard });
  res.status(201).json({ post });
}));

/** POST /api/posts/:id/like — toggle like */
router.post('/:id/like', requireAuth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'post_not_found');
  const idx = post.likes.findIndex((u) => String(u) === String(req.user._id));
  if (idx >= 0) post.likes.splice(idx, 1); else post.likes.push(req.user._id);
  await post.save();
  res.json({ likes: post.likes.length, liked: idx < 0 });
}));

/** POST /api/posts/:id/comment */
router.post('/:id/comment', requireAuth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'post_not_found');
  post.comments.push({ userId: req.user._id, text: req.body.text || '' });
  await post.save();
  res.json({ comments: post.comments.length });
}));

/** POST /api/posts/:id/share */
router.post('/:id/share', requireAuth, asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { shares: 1 } }, { new: true });
  res.json({ shares: post?.shares || 0 });
}));

module.exports = router;
