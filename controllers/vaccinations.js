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
    return res.render('vaccinations/create', {csrfToken: req.csrfToken()});
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
        //pathologies: pathologies, //TODO: IMPLEMENT PATHOLOGIES
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
        
        return res.render('vaccinations/edit', { vaccination: vaccination, csrfToken: req.csrfToken() });
    
    }).catch((err) => {
        err.status = 500;
        return next(err);
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
        err.status = 500;
        return next(err);
    });

}

exports.showAll = (req, res, pos) => {
    Vaccination.find({})
    .then(( vaccinations ) => {

        return res.render('vaccinations/showall', {vaccinations : vaccinations});

    })
    .catch((err) => {
        console.log(err);
    });
};

exports.searchGet = (req, res, pos) => {

    const vaccinations = [];

    return res.render('vaccinations/search', { vaccinations: vaccinations, csrfToken: req.csrfToken() });

};

exports.searchPost = (req, res, pos) => {

    const {q} = req.body;

    Vaccination.find( { $text: { $search: q } } )
    .then((vaccinations) => {
        return res.render('vaccinations/search', {vaccinations: vaccinations, csrfToken: req.csrfToken()});
    })
    .catch((err) => {
        err.status = 500;
        return next(err);
    });

};

exports.delete = (req, res, pos) => {

    const vaccinationId = req.body.vaccinationId;

    Vaccination.deleteOne({'_id': vaccinationId})
    .then((success) => {
        //TODO: CHECK SUCCESS
        return res.redirect('/vaccinations');
    })
    .catch((err) => {
        err.status = 500;
        return next(err);
    });

};

//DONETODO: MAKE ADMIN PANELS

exports.showDashboard = (req, res, next) => {
    Vaccination.find({}).then((vaccinations) => {

        return res.render('vaccinations/dashboard', { vaccinations: vaccinations });

    }).catch(err => { 

        err.status = 500;
        return next(err);
    });
}