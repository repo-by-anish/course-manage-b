const express = require('express');
const router = express.Router();

const principalAuthController = require('../controller/principalAuthController');
const loginLimiter = require('../middleware/loginLimitter');

router.route('/')
  .post(loginLimiter, principalAuthController.login);

router.route('/refresh')
  .get(principalAuthController.refresh);

router.route('/logout')
  .post(principalAuthController.logout);

module.exports = router;
