const userController = require('../../controllers/apis/user');
const doctorController = require('../../controllers/apis/doctors');

const express = require('express');
let router = express.Router();
router.use('/users', userController);
router.use('/doctors', doctorController);
module.exports = router;