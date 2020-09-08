const express = require('express');
const { body, validationResult } = require('express-validator/check');

const Vaccination = require('../models/vaccination.js').Vaccination;

exports.validate = (method) => {
    switch(method){
        case "createVaccination":{
            return [
                body('name', 'Unable to set name').exists(),
                body('description', 'Unable to set description').exists(),
                //body('pathologies', 'Unable to set pathologies').exists(),
                body('vaccode', 'Unable to set Vaccode').exists(),
                body('dosage', 'Unable to set dosage').exists(),
            ];
        }
    }
}

exports.createGet = (req, res, next) => {
    return res.render('vaccinations/create');
}

exports.createPost = (req, res, next) => {

    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        return res.send(validationErrors);
    }

    const { name, description, pathologies, vaccode, dosage } = req.body;

    const newVaccination = new Vaccination({
        name: name,
        description: description,
        //pathologies: pathologies,
        vaccode: vaccode,
        dosage: dosage,
    });

    newVaccination.save()
        .then(vaccination => {
            return res.redirect('/vaccinations');
        })
        .catch((err) => { console.log(err) });

}

exports.editGet = (req, res, next) => {

    const vaccinationId = req.params.vaccinationid;

    Vaccination.findById(vaccinationId)
    .then((vaccination) => {
        
        return res.render('vaccinations/edit', { vaccination: vaccination });
    
    }).catch((err) => {
        console.log(err);
    });

}

exports.editPost = (req, res, next) => {

    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        return res.send(validationErrors);
    }

    const vaccinationId = req.params.vaccinationid;

    const { name, description, pathologies, vaccode, dosage } = req.body;

    Vaccination.findById(vaccinationId)
    .then((curLocation) => {

        curLocation.name = name;
        curLocation.description = description;
        curLocation.pathologies = pathologies;
        curLocation.vaccode = vaccode;
        curLocation.dosage = dosage;

        return curLocation.save();

    }).then((location) => {
        return res.redirect('/vaccinations');
    }).catch((err) => {
        console.log(err);
    });

}