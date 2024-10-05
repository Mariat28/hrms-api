const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const otpController = require('../controllers/otpController');
const logController = require('../controllers/logController');
const roleController = require('../controllers/roleController')
router.post('/users', userController.createUser);

router.get('/users', userController.getAllUsers);

router.patch('/user', userController.updateUser);

router.post('/generate-otp', otpController.generateOTP);
router.post('/validate-otp',otpController.validateOTP);
router.post('/log-api', logController.createLog);
router.get('/logs', logController.fetchLogs);
router.get('/roles',roleController.fetchRoles);

module.exports = router;
