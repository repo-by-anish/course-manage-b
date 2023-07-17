const express = require('express');
const router = express.Router();

const instructorAuthController = require('../controller/InstructorAuthController');
const loginLimiter = require('../middleware/loginLimitter');

router.route('/')
  .post(loginLimiter, instructorAuthController.login);

router.route('/refresh')
  .get(instructorAuthController.refresh);

router.route('/logout')
  .post(instructorAuthController.logout);

module.exports = router;
