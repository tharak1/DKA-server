const express = require('express');
const { VerifyMail, VerifyOTP } = require('../Controllers/SendMailController');


const router = express.Router();
router.route("/verifyMail").post(VerifyMail);
router.route("/verifyOTP").post(VerifyOTP);


module.exports = router;