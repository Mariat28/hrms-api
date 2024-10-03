const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const otpController = require('../controllers/otpController');

router.post('/users', userController.createUser);

router.get('/users', userController.getAllUsers);

router.patch('/users/:id', userController.updateUser);

router.post('/generateOTP', otpController.generateOTP);
 router.post('/validateOTP',otpController.validateOTP);
module.exports = router;
