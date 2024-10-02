const express = require('express');
const userController = require('../controllers/userController'); // Adjust the path as necessary

const router = express.Router();

// Route to create a new user
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.patch('/user',userController.updateUser);

// Other routes can be added here
module.exports = router;
