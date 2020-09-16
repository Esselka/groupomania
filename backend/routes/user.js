const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const userCtrl = require('../controllers/user');

router.put('/:id', auth, multer, userCtrl.modifyUser);

module.exports = router;