const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const postCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');

// Gestion des posts
router.post('/', auth, multer, postCtrl.createPost);
router.get('/:slug', auth, postCtrl.getOnePost);
router.put('/:slug', auth, postCtrl.modifyPost);
router.delete('/:slug', auth, postCtrl.deletePost);
router.get('/', auth, postCtrl.getAllPosts);
router.post('/:postId/react', auth, postCtrl.reactToPost);

// Gestion des commentaires
router.post('/:postId/comments', auth, commentCtrl.createComment);
router.put('/:postId/comments/:commentId', auth, commentCtrl.modifyComment);
router.delete('/:postId/comments/:commentId', auth, commentCtrl.deleteComment);

module.exports = router;