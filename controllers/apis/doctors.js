const express = require('express');
const doctorService = require('../../services/users/doctors');
let router = express.Router();

router.get('/', doctorService.getUsers);

router.get('/:id', doctorService.getUserById);

router.post('/', doctorService.createUser);

router.post('/login', doctorService.loginUser);

router.put('/:id', doctorService.updateUser);

router.delete('/:id', doctorService.deleteUser);

module.exports = router;