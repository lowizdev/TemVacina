const express = require('express');

const router = express.Router();

const LocationController = require('../controllers/locations.js');

router.get('/:id', LocationController.locationGet);
router.get('/create', LocationController.createGet);
router.post('/create', LocationController.createPost);

exports.router = router;