const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const userCtrl = require('../controllers/user');

router.get('/avatar', auth, userCtrl.getAvatarUrl);
router.get('/:userId', auth, userCtrl.getUserDatas);
router.put('/:userId', auth, multer, userCtrl.modifyUser);
router.delete('/delete', auth, userCtrl.deleteUser);

module.exports = router;