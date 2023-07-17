const express = require('express');
const router = express.Router();

const adminAuthController = require('../controller/adminAuthController');
const loginLimiter = require('../middleware/loginLimitter');

router.route('/')
  .post(loginLimiter, adminAuthController.login);

router.route('/refresh')
  .get(adminAuthController.refresh);

router.route('/logout')
  .post(adminAuthController.logout);

module.exports = router;
