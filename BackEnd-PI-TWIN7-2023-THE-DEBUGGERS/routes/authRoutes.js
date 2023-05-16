var express = require('express');
var router = express.Router();
const { login_post } = require('../controllers/authController');
const { logout_get } = require('../controllers/authController');
const { forget_password } = require('../controllers/authController');
const { reset_password } = require('../controllers/authController');
const { loginAdmin_post } = require('../controllers/authController');




router.post('/login', login_post);
router.post('/loginAdmin', loginAdmin_post);
router.get('/logout', logout_get);
router.post('/forget-password', forget_password);
router.post('/reset-password/:token', reset_password);


module.exports = router;