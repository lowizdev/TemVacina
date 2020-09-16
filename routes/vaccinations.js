const express = require('express');

const router = express.Router();

const VaccinationController = require('../controllers/vaccinations.js');

router.get('/create', VaccinationController.createGet);
router.post('/create', VaccinationController.validate('createVaccination'), VaccinationController.createPost);
router.get('/:vaccinationid/edit', VaccinationController.editGet);
router.post('/:vaccinationid/edit', VaccinationController.validate('createVaccination'), VaccinationController.editPost);
router.get('/search', VaccinationController.searchGet);
router.post('/search', VaccinationController.searchPost);

exports.router = router;