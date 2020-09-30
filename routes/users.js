const express = require('express');

const router = express.Router();

const UserController = require('../controllers/users.js');
const { User } = require('../models/user.js');

const ensureAuthenticated = require('../config/auth.js').ensureAuthenticated;

router.get('/login', UserController.loginGet);
router.post('/login', UserController.loginPost);
router.get('/register', UserController.registerGet);
router.post('/register', UserController.validate('createUser') , UserController.registerPost);
router.get('/logout', UserController.logout);
router.get('/edit', ensureAuthenticated,  UserController.editGet);
router.post('/edit', ensureAuthenticated,  UserController.editPost);

router.get('/dashboard', UserController.dashboard);

router.get('/testuser', UserController.test);


exports.router = router;