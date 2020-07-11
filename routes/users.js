const express = require('express');

const router = express.Router();

const UserController = require('../controllers/users.js');



router.get('/login', UserController.loginGet);
router.post('/login', UserController.loginPost);
router.get('/register', UserController.registerGet);
router.post('/register', UserController.registerPost);
router.get('/logout', UserController.logout);


exports.router = router;