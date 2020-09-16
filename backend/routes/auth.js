const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');

const verifyPassword = require('../middlewares/verifyPassword');
const noCache = require('../middlewares/noCache');
const rateLimiter = require("../middlewares/express-rate-limit");

router.post('/signup', noCache, verifyPassword, authCtrl.signup);
router.post('/signin', noCache, rateLimiter, authCtrl.signin);

module.exports = router;