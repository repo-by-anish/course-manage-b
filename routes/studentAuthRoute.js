const express = require('express');
const router = express.Router();

const studAuthController=require("../controller/studAuthController")
const loginLimiter = require('..//middleware/loginLimitter');



router.route("/")
    .post(loginLimiter, studAuthController.login)

router.route("/refresh")
    .get(studAuthController.refresh)


router.route("/logout")
    .post(studAuthController.logout)

module.exports = router