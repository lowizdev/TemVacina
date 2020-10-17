const express = require('express');

const router = express.Router();

const VaccinationController = require('../controllers/vaccinations.js');

const ensureAuthenticated = require('../config/auth.js').ensureAuthenticated;

router.get('/create', ensureAuthenticated, VaccinationController.createGet);
router.post('/create', ensureAuthenticated, VaccinationController.validate('createVaccination'), VaccinationController.createPost);
router.get('/:vaccinationid/edit', ensureAuthenticated, VaccinationController.editGet);
router.post('/:vaccinationid/edit', ensureAuthenticated, VaccinationController.validate('createVaccination'), VaccinationController.editPost);
router.get('/search', VaccinationController.searchGet);
router.post('/search', VaccinationController.searchPost);
router.get('/dashboard', ensureAuthenticated, VaccinationController.showDashboard);

router.get('/', VaccinationController.showAll);

exports.router = router;