const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const userCtrl = require('../controllers/user');

router.get('/avatar', auth, userCtrl.getAvatarUrl);
router.put('/modifyAvatar', auth, multer, userCtrl.modifyAvatar);
router.get('/myDatas', auth, userCtrl.getUserDatas);
router.put('/:userId', auth, userCtrl.modifyUser);
router.post('/delete', auth, userCtrl.deleteUser);

module.exports = router;